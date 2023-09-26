"use client";

import React, { useEffect, useRef } from "react";
import {
  AmbientLight,
  AxesHelper,
  Color,
  GridHelper,
  PerspectiveCamera,
  PointLight,
  PointLightHelper,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Entity, Rock, Paper, Scisors } from "./Entity";

const createRenderer = (containerElement: HTMLDivElement) => {
  const { innerWidth: width, innerHeight: height } = window;
  const aspect = width / height;
  const camera = new PerspectiveCamera(30, aspect, 0.01, 1000);
  camera.position.set(10, 10, 10);

  const scene = new Scene();
  scene.background = new Color(0xcccccc);

  const ambient = new AmbientLight(0xffffff, 1.5);
  const sun = new PointLight(0xffffff, 100);
  sun.position.set(5, 5, 5);
  const sunHelper = new PointLightHelper(sun, 1);
  scene.add(ambient, sun, sunHelper);

  const renderList: Array<Entity> = [];
  const rock = new Rock(new Vector3(10, 0, 2));
  scene.add(rock);
  renderList.push(rock);

  const paper = new Paper(new Vector3(-5, 0, 5));
  scene.add(paper);
  renderList.push(paper);

  const scisors = new Scisors(new Vector3(-4, 0, -7));
  scene.add(scisors);
  renderList.push(scisors);

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);

  const grid = new GridHelper(50, 50);
  const axes = new AxesHelper(25);
  scene.add(grid, axes);

  const controls = new OrbitControls(camera, renderer.domElement);

  containerElement.appendChild(renderer.domElement);

  const animation = (time: number) => {
    requestAnimationFrame(animation);

    renderList.forEach((el, index) =>
      el.update(renderList.filter((_, elIndex) => index !== elIndex))
    );

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
