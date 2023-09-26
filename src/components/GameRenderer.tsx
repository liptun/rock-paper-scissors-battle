"use client";

import React, { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  SRGBColorSpace,
  AmbientLight,
  Color,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
  CircleGeometry,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Entity, EntityType } from "./Entity";

const createRenderer = (containerElement: HTMLDivElement) => {
  const { innerWidth: width, innerHeight: height } = window;
  const aspect = width / height;
  const camera = new PerspectiveCamera(30, aspect, 0.01, 1000);
  camera.position.set(30, 30, 30);

  const scene = new Scene();
  scene.background = new Color(0xcccccc);

  const ambient = new AmbientLight(0xffffff, 0.3);

  const sunRed = new PointLight(0xff0000, 100);
  const sunBlue = new PointLight(0x0000ff, 100);
  sunRed.castShadow = true;
  sunRed.position.set(-10, 10, 0);
  sunBlue.castShadow = true;
  sunBlue.position.set(10, 10, 0);
  scene.add(ambient, sunRed, sunBlue);

  const renderList: Array<Entity> = [];

  const objectsCount = 64;

  for (let i = 0; i < objectsCount; i++) {
    const entityType: EntityType =
      i < (objectsCount / 3) * 2
        ? i < objectsCount / 3
          ? "Rock"
          : "Paper"
        : "Scissors";
    const entity = new Entity(
      new Vector3(
        MathUtils.randFloatSpread(50),
        0,
        MathUtils.randFloatSpread(50)
      ),
      entityType
    );
    scene.add(entity);
    renderList.push(entity);
  }

  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  scene.background = new Color(0x666666);

  const plane = new Mesh(new CircleGeometry(25), new MeshStandardMaterial());
  plane.receiveShadow = true;
  plane.castShadow = true;
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  const controls = new OrbitControls(camera, renderer.domElement);

  containerElement.appendChild(renderer.domElement);

  const animation = (time: number) => {
    requestAnimationFrame(() => animation(time + 1));

    renderList.forEach((el) => el.update(renderList));

    controls.update();
    renderer.render(scene, camera);
  };

  animation(0);

  window.addEventListener("resize", () => {
    const { innerWidth: width, innerHeight: height } = window;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  });

  return renderer;
};

const GameRenderer = () => {
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

export default GameRenderer;
