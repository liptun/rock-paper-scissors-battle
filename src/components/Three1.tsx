"use client";

import React, { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  SRGBColorSpace,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three";

const createRenderer = (containerElement: HTMLDivElement) => {
  const { innerWidth: width, innerHeight: height } = window;
  const aspect = width / height;
  const camera = new PerspectiveCamera(30, aspect, 0.01, 10);
  camera.position.z = 5;

  const scene = new Scene();
  scene.background = new Color("lime");

  const ambient = new AmbientLight();
  ambient.color.set("red");
  ambient.intensity = 5;
  scene.add(ambient);

  const pointLight = new PointLight();
  pointLight.position.set(2, 2, 2);
  pointLight.intensity = 50;
  scene.add(pointLight);

  const geometry = new SphereGeometry(1, 9, 9);
  const material = new MeshBasicMaterial({ color: "hotpink" });
  const cubeCenter = new Mesh(geometry, material);
  scene.add(cubeCenter);

  const cubeMoving = new Mesh(
    new TorusGeometry(0.3, 0.18, 7, 7),
    new MeshBasicMaterial({ color: "indigo" })
  );
  scene.add(cubeMoving);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;

  containerElement.appendChild(renderer.domElement);

  window.addEventListener("resize", () => {
    const { innerWidth: width, innerHeight: height } = window;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  const animation = (time: number) => {
    renderer.render(scene, camera);

    cubeMoving.position.x = Math.sin(time * 0.001) * 2;
    cubeMoving.position.y = Math.cos(time * 0.001);
    cubeMoving.position.z = Math.cos(time * 0.001);

    cubeMoving.rotation.x += 0.01;
    cubeMoving.rotation.y += 0.01;

    camera.lookAt(cubeMoving.position);

    camera.position.z = Math.cos(time * 0.001 * -1) + 5;

    requestAnimationFrame(animation);
  };

  animation(0);

  return renderer;
};

const Three1 = () => {
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

export default Three1;
