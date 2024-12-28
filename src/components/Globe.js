import React, { useContext, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { CivilizationsContext } from '../App';


const Globe = () => {
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const scrollPositionRef = useRef(4);
    const globePressRef = useRef(false);
    const mountRef = useRef(null);
    const animationRef = useRef(null);
    const mouseMovementTimeoutRef = useRef(null);
    const globeRef = useRef(null);
    const cameraRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const pointerRef = useRef(new THREE.Vector2());
    const raycasterRef = useRef(new THREE.Raycaster());
    const {civilizations, setPickedCivilization} = useContext(CivilizationsContext);

    const onMouseMove = (event) => {
        mousePositionRef.current = { x: event.movementX, y: event.movementY };

        const rect = rendererRef.current.domElement.getBoundingClientRect(); 
        
        if(pointerRef.current){
            pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointerRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        if (mouseMovementTimeoutRef.current) {
            clearTimeout(mouseMovementTimeoutRef.current);
        }

        mouseMovementTimeoutRef.current = setTimeout(() => {
            mousePositionRef.current = { x: 0, y: 0 };
        }, 0.01);
    };

    const onMouseScroll = (event) => {
        if (event.deltaY > 0 && scrollPositionRef.current < 5.5) {
            scrollPositionRef.current += 0.5;
        } else if (event.deltaY < 0  && scrollPositionRef.current > 2.5 ) {
            scrollPositionRef.current -= 0.5;
        }
    };
    
    useEffect(() => {
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        rendererRef.current = renderer;
        const textureLoader = new THREE.TextureLoader();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xBEEFBFA);
        const currentmount = mountRef.current;

        const aspectRatio = (window.innerWidth/2) / window.innerHeight;
        
        const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
        camera.position.z = scrollPositionRef.current;

        renderer.setSize(window.innerWidth/2, window.innerHeight);
        currentmount.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load('/earth.jpg')
        });

        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        
        globeRef.current = globe;
        cameraRef.current = camera;
        sceneRef.current = scene;
        return () => {
            cancelAnimationFrame(animationRef.current);
            currentmount.removeChild(renderer.domElement);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);


    useEffect(() => {
        document.getElementById("loading-screen").style.display = 'flex';
        
        while (globeRef.current.children.length > 0) {
            const child = globeRef.current.children[0];
        
            if (child.geometry) {
                child.geometry.dispose();
            }
        
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach((material) => {
                        if (material.map) material.map.dispose();
                        material.dispose(); 
                    });
                } else {
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            }
        
            globeRef.current.remove(child);
        }

        function latLongToVector3(lat, lon, radius) {
            const phi = (lat) * (Math.PI / 180); 
            const theta = (lon) * (Math.PI / 180); 
            
            const x = radius * Math.cos(phi) * Math.sin(theta);
            const y =  radius * Math.sin(phi);
            const z = radius * Math.cos(phi) * Math.cos(theta);
            
            return new THREE.Vector3(x, y, z);
        }
        
        for(let i in civilizations){
            const latitude = civilizations[i].latitude;
            const longitude = civilizations[i].longitude;
            const location = latLongToVector3(latitude, longitude +  90, 1);
        
            const markerGeometry = new THREE.SphereGeometry(0.006, 32, 32); 
            const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const marker = new THREE.Mesh(markerGeometry, markerMaterial);
                
            marker.position.copy(location);
            marker.name = i.toString();
            globeRef.current.add(marker);
        }
        
        const raycaster = raycasterRef.current
        const camera = cameraRef.current;
        const scene  = sceneRef.current;
        const animate = (globe) => {
            let intersects = [];
            if(pointerRef.current){
                raycaster.setFromCamera( pointerRef.current, camera );
                intersects = raycaster.intersectObjects( globe.children );
            }
            
            if (globePressRef.current) {
                if(intersects.length > 0 && civilizations.length > 0){
                    intersects[0].object.material.color.set( 0xffff00 );
                    const chosenCivilization = civilizations[parseInt(intersects[0].object.name)];
                    setPickedCivilization(chosenCivilization);
                }
                if(mousePositionRef.current.x !== 0){
                    const magnitude = Math.sqrt(mousePositionRef.current.x ** 2 + mousePositionRef.current.y ** 2);
                    const normalizedX = (mousePositionRef.current.x / magnitude);
                    const normalizedY = (mousePositionRef.current.y / magnitude);
                    globe.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.12 * normalizedX);
                    globe.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), 0.12 * normalizedY);
                }
            }
            camera.position.z = scrollPositionRef.current;
            rendererRef.current.render(scene, camera);
            animationRef.current = requestAnimationFrame(() => animate(globe));
        };
        animate(globeRef.current);
        
        setTimeout(()=>{
            document.getElementById("loading-screen").style.display = 'none';
        }, 1000);
        
        return () => {
            cancelAnimationFrame(animationRef.current); 
        };
    }, [civilizations, setPickedCivilization]);


    return (
        <div 
            id='GlobePanel'
            onMouseDown={() => globePressRef.current = true}
            onMouseUp={() => globePressRef.current = false}
            onMouseMove={onMouseMove}
            onWheel={onMouseScroll}
            ref={mountRef}>
            <div id="loading-screen">
                <div className="loading-spinner"></div>
            </div>
        </div>
    );
};

export default Globe;
