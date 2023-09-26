"use client";

import React, { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
} from "three";

const createRenderer = (containerElement: HTMLDivElement) => {
  const { innerWidth: width, innerHeight: height } = window;
  const aspect = width / height;
  const camera = new PerspectiveCamera(30, aspect, 0.01, 20);
  camera.position.z = 5;
  camera.position.x = 5;
  camera.position.y = 5;

  const scene = new Scene();

  const ambient = new AmbientLight();
  ambient.intensity = 0.3;
  scene.add(ambient);

  const pointLight = new PointLight();
  pointLight.position.set(-2, 2, 1);
  pointLight.intensity = 30;
  pointLight.castShadow = true;
  scene.add(pointLight);

  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({ color: "hotpink" });
  const cube = new Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  cube.position.y = 1;
  scene.add(cube);

  const planeGeometry = new PlaneGeometry(5, 5);
  const planeMaterial = new MeshStandardMaterial();
  const plane = new Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.castShadow = true;
  scene.add(plane);

  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.5;

  camera.lookAt(cube.position);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  containerElement.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    const { innerWidth: width, innerHeight: height } = window;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  const animation = (time: number) => {
    renderer.render(scene, camera);

    cube.rotation.z -= 0.01;
    cube.rotation.x -= 0.01;

    const newCubeScale = Math.sin(time * 0.001);
    cube.scale.set(newCubeScale, newCubeScale, newCubeScale);

    pointLight.position.x = Math.sin(time * 0.005);
    pointLight.position.z = Math.cos(time * 0.005);
    pointLight.position.y = Math.sin(time * 0.003) + 2;

    requestAnimationFrame(animation);
  };

  animation(0);

  return renderer;
};

const Three2 = () => {
  const rendererRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const rendererContainer = rendererRef.current;
    if (!rendererContainer) {
      return;
    }

    const renderer = createRenderer(rendererContainer);

    return () => {
      renderer.dispose();
      rendererContainer?.getElementsByTagName("canvas")[0].remove();
    };
  }, [rendererRef]);

  return <div ref={rendererRef} />;
};

export default Three2;
