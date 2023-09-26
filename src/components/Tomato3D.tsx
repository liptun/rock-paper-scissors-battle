"use client";

import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const Tomato3D = () => {
  const rendererRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const rendererElement = rendererRef.current;
    const loader = new GLTFLoader();

    loader.load("/assets/tomato.glb", (tomato) => {
      scene.add(tomato.scene);
      tomato.scene.scale.set(0.5, 0.5, 0.5);
      document.addEventListener("mousemove", (event) => {
        const mouse = {
          x: event.clientX,
          y: event.clientY,
        };
        tomato.scene.rotation.y =
          (mouse.x - window.innerHeight / 2) * 0.005 + Math.PI;
        tomato.scene.rotation.x = (mouse.y - window.innerHeight / 2) * 0.0005;
        tomato.scene.traverse(function (node) {
          node.castShadow = true;
          node.receiveShadow = true;
        });
      });
    });

    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.01,
      10
    );
    camera.position.z = 1.5;
    camera.position.y = 0.5;

    const scene = new THREE.Scene();

    const sunlight = new THREE.DirectionalLight(0xffffff, 6);
    sunlight.castShadow = true;
    sunlight.position.set(10, 10, 10); // You can adjust the position as needed
    sunlight.rotation.x = Math.PI / 3;
    sunlight.shadow.mapSize.width = 1024 * 10;
    sunlight.shadow.mapSize.height = 1024 * 10;
    sunlight.shadow.camera.near = 0.5;
    sunlight.shadow.camera.far = 500;
    scene.add(sunlight);

    const ambient = new THREE.AmbientLight();
    scene.add(ambient);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth - 64, window.innerHeight - 64);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    rendererElement?.appendChild(renderer.domElement);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose();
    };
  }, [rendererRef]);

  return <div ref={rendererRef} />;
};

export default Tomato3D;
