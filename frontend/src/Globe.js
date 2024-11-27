import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe = () => {
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const scrollPositionRef = useRef(5);
    const globePressRef = useRef(false);
    const mountRef = useRef(null);
    const animationRef = useRef();
    const mouseMovementTimeoutRef = useRef(null);

    const onMouseMove = (event) => {
        mousePositionRef.current = { x: event.movementX, y: event.movementY };

        if (mouseMovementTimeoutRef.current) {
            clearTimeout(mouseMovementTimeoutRef.current);
        }

        mouseMovementTimeoutRef.current = setTimeout(() => {
            mousePositionRef.current = { x: 0, y: 0 };
        }, 1);
    };

    const onMouseScroll = (event) => {
        if (event.deltaY > 3 && scrollPositionRef.current < 10) {
            scrollPositionRef.current += 0.5;
        } else if (event.deltaY < 0 && scrollPositionRef.current > 2) {
            scrollPositionRef.current -= 0.5;
        }
    };

    useEffect(() => {
        const textureLoader = new THREE.TextureLoader();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xBEEFBFA);
        const currentmount = mountRef.current;

        const aspectRatio = (window.innerWidth/2) / window.innerHeight;
        
        const camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth/2, window.innerHeight);
        currentmount.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const material = new THREE.MeshStandardMaterial({});

        // Load the texture asynchronously
        const loadTexture = async () => {
            return new Promise((resolve, reject) => {
                textureLoader.load(
                    '/earth.jpg',
                    (texture) => {
                        resolve(texture);
                    },
                    undefined,
                    (error) => {
                        reject(error);
                    }
                );
            });
        };

        const setupGlobe = async () => {
            try {
                const texture = await loadTexture();
                material.map = texture; // Set the loaded texture
                material.needsUpdate = true; // Mark the material for an update
                const globe = new THREE.Mesh(geometry, material);
                scene.add(globe);

                const ambientLight = new THREE.AmbientLight(0xffffff, 2);
                scene.add(ambientLight);
                const pointLight = new THREE.PointLight(0xffffff, 2);
                pointLight.position.set(5, 5, 5);
                scene.add(pointLight);
                
                animate(globe);

                setTimeout(()=>{
                    document.getElementById("loading-screen").style.display = 'none';
                }, 1000
            )
            } catch (error) {
                console.error("Error loading texture:", error);
            }
        };

        const animate = (globe) => {
            animationRef.current = requestAnimationFrame(() => animate(globe));
            if (globePressRef.current && mousePositionRef.current.x !== 0) {
                const magnitude = Math.sqrt(mousePositionRef.current.x ** 2 + mousePositionRef.current.y ** 2);
                const normalizedX = (mousePositionRef.current.x / magnitude);
                const normalizedY = (mousePositionRef.current.y / magnitude);
                globe.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.3 * normalizedX);
                globe.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), 0.3 * normalizedY);
            }
            camera.position.z = scrollPositionRef.current;
            renderer.render(scene, camera);
        };

        setupGlobe(); // Load the globe and its texture

        return () => {
            cancelAnimationFrame(animationRef.current);
            currentmount.removeChild(renderer.domElement);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div 
            id='GlobePanel'
            onMouseDown={() => globePressRef.current = true}
            onMouseUp={() => globePressRef.current = false}
            onMouseMove={onMouseMove}
            onWheel={onMouseScroll}
            ref={mountRef}>
            <div id="loading-screen">
                Loading....
            </div>
        </div>
    );
};

export default Globe;
