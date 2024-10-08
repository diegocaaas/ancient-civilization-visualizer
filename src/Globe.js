import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe = () => {
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const globePressRef = useRef(false);
    const mountRef = useRef(null); 
    const animationRef = useRef();
    const timeoutRef = useRef(null);

    const onMouseMove = (event) => {
        mousePositionRef.current = {x: event.movementX, y: event.movementY};

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
      
        timeoutRef.current = setTimeout(() => {
            mousePositionRef.current = { x: 0, y: 0 };
        }, 1);
    }

    useEffect(() => {
        const scene = new THREE.Scene();
        const currentmount = mountRef.current;


        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5; 

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentmount.appendChild(renderer.domElement); 

        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const textureLoader = new THREE.TextureLoader();
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

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            if(globePressRef.current && mousePositionRef.current.x !== 0){
                const magnitude = Math.sqrt(mousePositionRef.current.x**2 + mousePositionRef.current.y**2);
                const normalizedX = (mousePositionRef.current.x / magnitude);
                const normalizedY = (mousePositionRef.current.y / magnitude); 
                globe.rotation.y += 0.3*normalizedX;
                globe.rotation.x += 0.3*normalizedY;
            }
            renderer.render(scene, camera); 
        };
        animate(); 

        return () => {
            cancelAnimationFrame(animationRef.current);
            currentmount.removeChild(renderer.domElement);
            renderer.dispose(); 
            geometry.dispose(); 
            material.dispose();
        };
    }, []); 

    return <div onMouseDown={() => globePressRef.current = true} onMouseUp={() => globePressRef.current = false} onMouseMove={onMouseMove} ref={mountRef} />; // Render the ref div
};

export default Globe;