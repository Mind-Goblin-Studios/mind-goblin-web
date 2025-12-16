'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { animate } from 'animejs';

interface ThreeCubeProps {
  className?: string;
}

export default function ThreeCube({ className }: ThreeCubeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true // Transparent background
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Main Cube - Black
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x0a0a0a, // Very dark, almost black
      transparent: true,
      opacity: 0.9,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Border Cube - Red wireframe
    const borderGeometry = new THREE.BoxGeometry(1.55, 1.55, 1.55);
    const borderMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff4b4b, // Red
      wireframe: true 
    });
    const borderCube = new THREE.Mesh(borderGeometry, borderMaterial);
    scene.add(borderCube);

    // Inner glow cube
    const innerGeometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const innerMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff4b4b, // Red
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(innerCube);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom for cleaner experience
    controls.autoRotate = false; // We'll handle rotation with anime.js

    // Anime.js animation for cube rotation
    animate([cube.rotation, borderCube.rotation, innerCube.rotation], {
      y: Math.PI * 2,
      x: Math.PI * 2,
      duration: 8000,
      ease: 'linear',
      loop: true,
    });

    // Anime.js animation for cube scaling (pulsing effect)
    animate([cube.scale, borderCube.scale], {
      x: [1, 1.1, 1],
      y: [1, 1.1, 1],
      z: [1, 1.1, 1],
      duration: 3000,
      ease: 'inOutSine',
      loop: true,
    });

    // Inner cube pulses opposite
    animate(innerCube.scale, {
      x: [1, 0.9, 1],
      y: [1, 0.9, 1],
      z: [1, 0.9, 1],
      duration: 3000,
      ease: 'inOutSine',
      loop: true,
    });

    // Animate border color
    const colorAnimation = { r: 1, g: 0.29, b: 0.29 }; // Starting red
    animate(colorAnimation, {
      r: [1, 0.5, 1],
      g: [0.29, 0.1, 0.29],
      b: [0.29, 0.1, 0.29],
      duration: 2000,
      ease: 'inOutSine',
      loop: true,
      onUpdate: () => {
        borderMaterial.color.setRGB(colorAnimation.r, colorAnimation.g, colorAnimation.b);
      },
    });

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationId: number;
    function animateScene() {
      animationId = requestAnimationFrame(animateScene);
      controls.update();
      renderer.render(scene, camera);
    }

    animateScene();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      borderGeometry.dispose();
      borderMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

