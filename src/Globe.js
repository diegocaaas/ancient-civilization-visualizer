import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Globe = () => {
    const mountRef = useRef(null); // Reference to the DOM element

    useEffect(() => {
        // Create the scene
        const scene = new THREE.Scene();
        const currentmount = mountRef.current;

        // Create the camera
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5; // Move the camera back

        // Create the renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        currentmount.appendChild(renderer.domElement); 

        // Create the globe (sphere)
        const geometry = new THREE.SphereGeometry(1, 32, 32);
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshStandardMaterial({
           map: textureLoader.load('/earth.jpg')
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe); // Add the globe to the scene

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate); // Call animate on the next frame
            globe.rotation.y += 0.01;
            globe.rotation.x += 0.01; // Rotate the globe // Rotate the globe
            renderer.render(scene, camera); // Render the scene
        };
        animate(); // Start the animation loop

        // Cleanup function
        return () => {
            currentmount.removeChild(renderer.domElement);
            renderer.dispose(); // Dispose of the renderer
            geometry.dispose(); // Dispose of the geometry
            material.dispose(); // Dispose of the material
        };
    }, []); // Run effect only on mount

    return <div ref={mountRef} />; // Render the ref div
};

export default Globe;