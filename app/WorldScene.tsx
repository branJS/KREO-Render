// @ts-nocheck
"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";

type Props = { sections: readonly string[] };

/* ---------------------------------------------------------------------- */
/* WORLD SCENE MAIN EXPORT */
export default function WorldScene({ sections }: Props) {
  return (
    <div className="canvas-stage">
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
        camera={{ position: [0, 3.5, 14], fov: 55, near: 0.1, far: 200 }}
      >
        <Suspense
          fallback={
            <Html center>
              <div style={{ letterSpacing: ".1em", opacity: 0.7 }}>loading…</div>
            </Html>
          }
        >
          <Scene sections={sections} />
        </Suspense>
      </Canvas>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* SCENE */
function Scene({ sections }: Props) {
  const mounted = typeof window !== "undefined"; // prevents SSR crash
  const points = useSectorPoints(sections.length);
  const group = useRef<THREE.Group>(null);
  const camera = mounted ? useThree().camera : null;
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const parallax = useRef({ x: 0, y: 0 });

  // Skip rendering during SSR
  if (!mounted) return null;

  /* ---- Smooth navigation transitions ---- */
  useEffect(() => {
    if (!camera) return;
    const onNav = (e: CustomEvent<{ section: string }>) => {
      const sec = e.detail.section;
      const idx = Math.max(0, sections.indexOf(sec));
      const p = points[idx] ?? points[0];
      const t = 1.2;

      gsap.to(camera.position, {
        x: p.x,
        y: p.y + 3.5,
        z: p.z + 14,
        duration: t,
        ease: "power2.inOut",
      });
      gsap.to(look.current, {
        x: p.x,
        y: p.y,
        z: p.z,
        duration: t,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(look.current),
      });
    };

    window.addEventListener("kreo:navigate", onNav as EventListener);
    return () => window.removeEventListener("kreo:navigate", onNav as EventListener);
  }, [camera, points, sections]);

  /* ---- Parallax animation ---- */
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const mx =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--mxp")
      ) || 0.5;
    const my =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--myp")
      ) || 0.5;

    parallax.current.x += ((mx - 0.5) * 0.3 - parallax.current.x) * 0.05;
    parallax.current.y += ((my - 0.5) * -0.3 - parallax.current.y) * 0.05;

    group.current.rotation.y = parallax.current.x;
    group.current.rotation.x = parallax.current.y;
    group.current.position.y = Math.sin(t * 0.6) * 0.12;
    group.current.position.x = parallax.current.x * 1.5;
    group.current.position.z = parallax.current.y * 1.5;
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 7, 6]} intensity={0.55} color={0xffffff} />
      <directionalLight position={[-6, 6, -6]} intensity={0.25} color={0x999999} />

      <group ref={group}>
        <BackdropPlane />
        {points.map((p, i) => (
          <Sector key={i} pos={p} index={i} />
        ))}
      </group>
    </>
  );
}

/* ---------------------------------------------------------------------- */
/* BACKDROP PLANE */
function BackdropPlane() {
  const uniforms = useMemo(
    () => ({ uC: new THREE.Color("#F2ECE3"), uTime: { value: 0 } }),
    []
  );
  useFrame((_, dt) => {
    (uniforms.uTime as { value: number }).value += dt;
  });

  return (
    <mesh rotation={[-Math.PI / 2.1, 0, 0]} position={[0, -3, -40]}>
      <planeGeometry args={[180, 180, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vs}
        fragmentShader={fs}
        transparent
      />
    </mesh>
  );
}

const vs = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fs = /* glsl */ `
precision highp float;
varying vec2 vUv;
void main() {
  vec2 uv = vUv - 0.5;
  float vign = smoothstep(1.0, 0.0, length(uv) * 1.2);
  vec3 base = vec3(0.949, 0.925, 0.89);
  gl_FragColor = vec4(base * (0.92 + 0.08 * vign), 1.0);
}
`;

/* ---------------------------------------------------------------------- */
/* SECTORS + GEOMETRY ELEMENTS */

function Sector({ pos, index }: { pos: THREE.Vector3; index: number }) {
  const colors = ["#F5C100", "#1E6FE0", "#2DBA72", "#00B6A3", "#E24C3A", "#E56BE3"];
  const c = new THREE.Color(colors[index % colors.length]);
  return (
    <group position={pos}>
      <Plate color={c} size={[5.6, 0.4, 3.2]} offset={[0, 0, 0]} />
      <Plate color={new THREE.Color("#ffffff")} size={[3.2, 0.3, 1.6]} offset={[-3.4, 0.15, -1.2]} />
      <Plate color={new THREE.Color("#ffffff")} size={[2.2, 0.3, 1.2]} offset={[3.2, 0.12, 1.0]} />
      <Node color={c} position={[-2.2, 0.35, 1.2]} label="●" />
      <Node color={new THREE.Color("#0D0D0D")} position={[2.4, 0.35, -1.0]} label="◆" dark />
      <Connector from={[-2.2, 0.35, 1.2]} to={[2.4, 0.35, -1.0]} color={new THREE.Color("#0D0D0D")} />
      <Html center position={[0, 0.55, 0]}>
        <div
          style={{
            fontFamily: "Space Grotesk, system-ui",
            fontWeight: 800,
            letterSpacing: "0.12em",
            fontSize: "12px",
            color: "#0D0D0D",
            background: "#fff",
            padding: "4px 8px",
            border: "3px solid #0D0D0D",
            boxShadow: "4px 4px 0 #0D0D0D",
          }}
        >
          {["HOME", "PROJECTS", "ABOUT", "CONTACT", "BLOG", "SHOP", "DOWNLOADS"][index]}
        </div>
      </Html>
    </group>
  );
}

function Plate({ color, size, offset }: { color: THREE.Color; size: [number, number, number]; offset: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.02;
    }
  });
  return (
    <mesh ref={ref} position={offset}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  );
}

function Node({ color, position, label, dark }: { color: THREE.Color; position: [number, number, number]; label: string; dark?: boolean }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.28, 0.28, 0.24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={dark ? new THREE.Color(0x111111) : new THREE.Color(0x000000)}
        roughness={0.4}
      />
      <Html center position={[0, 0.35, 0]}>
        <div
          style={{
            background: "#fff",
            color: "#0D0D0D",
            fontWeight: 800,
            fontSize: "12px",
            border: "3px solid #0D0D0D",
            padding: "2px 6px",
            boxShadow: "3px 3px 0 #0D0D0D",
          }}
        >
          {label}
        </div>
      </Html>
    </mesh>
  );
}

function Connector({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: THREE.Color }) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const mid = start.clone().lerp(end, 0.5);
  const dir = end.clone().sub(start);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );

  return (
    <mesh position={mid} quaternion={quat}>
      <cylinderGeometry args={[0.06, 0.06, len, 12]} />
      <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

/* ---------------------------------------------------------------------- */
/* UTIL */
function useSectorPoints(len: number): THREE.Vector3[] {
  return useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < len; i++) pts.push(new THREE.Vector3(0, 0, -i * 18));
    return pts;
  }, [len]);
}
