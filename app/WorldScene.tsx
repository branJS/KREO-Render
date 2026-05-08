"use client";

import React, { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import gsap from "gsap";

type Props = { sections: readonly string[] };

const SECTION_META: Record<string, { label: string; note: string; glyph: string; accent: string }> = {
  home: {
    label: "KREO",
    note: "Studio start",
    glyph: "K",
    accent: "#D7B96A",
  },
  projects: {
    label: "Projects",
    note: "Selected work",
    glyph: "P",
    accent: "#F5C100",
  },
  about: {
    label: "About",
    note: "Brandon + studio",
    glyph: "A",
    accent: "#8FB7FF",
  },
  "why-kreo": {
    label: "Why KREO",
    note: "Process + guarantee",
    glyph: "W",
    accent: "#D7B96A",
  },
  reviews: {
    label: "Reviews",
    note: "Client proof",
    glyph: "R",
    accent: "#91D7B4",
  },
  blog: {
    label: "Journal",
    note: "Ideas + notes",
    glyph: "J",
    accent: "#E8C877",
  },
  pricing: {
    label: "Pricing",
    note: "Project entry points",
    glyph: "GBP",
    accent: "#F2DFA8",
  },
  contact: {
    label: "Contact",
    note: "Start a brief",
    glyph: "C",
    accent: "#FFFFFF",
  },
};

function getSectionMeta(section: string, index: number) {
  return (
    SECTION_META[section] ?? {
      label: section.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      note: "KREO section",
      glyph: String(index + 1),
      accent: "#D7B96A",
    }
  );
}

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
              <div style={{ letterSpacing: ".1em", opacity: 0.7 }}>loading...</div>
            </Html>
          }
        >
          <Scene sections={sections} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene({ sections }: Props) {
  const points = useSectorPoints(sections.length);
  const group = useRef<THREE.Group>(null);
  const camera = useThree().camera;
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const parallax = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!camera) return;
    const onNav = (event: Event) => {
      const { section } = (event as CustomEvent<{ section: string }>).detail;
      const idx = Math.max(0, sections.indexOf(section));
      const p = points[idx] ?? points[0];

      gsap.to(camera.position, {
        x: p.x,
        y: p.y + 3.5,
        z: p.z + 14,
        duration: 1.2,
        ease: "power2.inOut",
      });
      gsap.to(look.current, {
        x: p.x,
        y: p.y,
        z: p.z,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => camera.lookAt(look.current),
      });
    };

    window.addEventListener("kreo:navigate", onNav as EventListener);
    return () => window.removeEventListener("kreo:navigate", onNav as EventListener);
  }, [camera, points, sections]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const mx =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mxp")) || 0.5;
    const my =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--myp")) || 0.5;

    parallax.current.x += ((mx - 0.5) * 0.28 - parallax.current.x) * 0.045;
    parallax.current.y += ((my - 0.5) * -0.25 - parallax.current.y) * 0.045;

    group.current.rotation.y = parallax.current.x;
    group.current.rotation.x = parallax.current.y;
    group.current.position.y = Math.sin(t * 0.52) * 0.1;
    group.current.position.x = parallax.current.x * 1.3;
    group.current.position.z = parallax.current.y * 1.3;
  });

  return (
    <>
      <ambientLight intensity={0.58} />
      <directionalLight position={[6, 7, 6]} intensity={0.6} color={0xffffff} />
      <directionalLight position={[-6, 6, -6]} intensity={0.2} color={0xd7b96a} />

      <group ref={group}>
        <BackdropPlane />
        <AmbientDust />
        <WorldPath points={points} />
        {points.map((p, i) => (
          <Sector key={sections[i] ?? i} pos={p} index={i} section={sections[i]} />
        ))}
      </group>
    </>
  );
}

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
      <shaderMaterial uniforms={uniforms} vertexShader={vs} fragmentShader={fs} transparent />
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
  float vign = smoothstep(1.0, 0.0, length(uv) * 1.25);
  float glow = smoothstep(0.62, 0.0, length(uv - vec2(-0.12, 0.08)));
  vec3 base = vec3(0.949, 0.925, 0.89);
  vec3 champagne = vec3(0.78, 0.66, 0.38);
  vec3 colour = mix(base * 0.92, base, vign);
  colour = mix(colour, champagne, glow * 0.08);
  gl_FragColor = vec4(colour, 1.0);
}
`;

function AmbientDust() {
  const positions = useMemo(() => {
    const arr = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 42;
      arr[i * 3 + 1] = Math.random() * 7 - 2.2;
      arr[i * 3 + 2] = -Math.random() * 135 + 8;
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#D7B96A" size={0.045} transparent opacity={0.26} depthWrite={false} />
    </points>
  );
}

function WorldPath({ points }: { points: THREE.Vector3[] }) {
  const geometry = useMemo(() => {
    const path = points.map((p, i) => new THREE.Vector3(p.x + Math.sin(i * 0.9) * 0.6, p.y + 0.18, p.z));
    return new THREE.BufferGeometry().setFromPoints(path);
  }, [points]);

  return (
    <line geometry={geometry}>
      <lineBasicMaterial color="#0D0D0D" transparent opacity={0.18} />
    </line>
  );
}

function Sector({ pos, index, section }: { pos: THREE.Vector3; index: number; section: string }) {
  const meta = getSectionMeta(section, index);
  const accent = new THREE.Color(meta.accent);

  return (
    <group position={pos}>
      <Plate color={new THREE.Color("#0D0D0D")} size={[5.9, 0.18, 3.1]} offset={[0, 0, 0]} metalness={0.24} roughness={0.42} />
      <Plate color={accent} size={[2.7, 0.12, 0.18]} offset={[0, 0.22, -1.5]} metalness={0.18} roughness={0.28} />
      <Plate color={new THREE.Color("#F8F4EA")} size={[2.7, 0.16, 1.35]} offset={[-3.0, 0.28, -0.72]} metalness={0.05} roughness={0.34} />
      <Plate color={new THREE.Color("#F8F4EA")} size={[1.85, 0.16, 1.05]} offset={[3.05, 0.26, 0.92]} metalness={0.05} roughness={0.34} />
      <Plate color={new THREE.Color("#151515")} size={[0.18, 0.18, 2.3]} offset={[0, 0.34, 0]} metalness={0.28} roughness={0.35} />
      <Node color={accent} position={[-2.35, 0.5, 1.1]} label={meta.glyph} />
      <Node color={new THREE.Color("#0D0D0D")} position={[2.45, 0.5, -1.0]} label={String(index + 1).padStart(2, "0")} dark />
      <Connector from={[-2.35, 0.5, 1.1]} to={[2.45, 0.5, -1.0]} color={accent} />
      <Html center position={[0, 0.58, 0]}>
        <div className="world-label">
          <span>{meta.glyph}</span>
          <strong>{meta.label}</strong>
          <small>{meta.note}</small>
        </div>
      </Html>
    </group>
  );
}

function Plate({
  color,
  size,
  offset,
  metalness = 0.1,
  roughness = 0.3,
}: {
  color: THREE.Color;
  size: [number, number, number];
  offset: [number, number, number];
  metalness?: number;
  roughness?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.02;
    }
  });

  return (
    <mesh ref={ref} position={offset}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function Node({
  color,
  position,
  label,
  dark,
}: {
  color: THREE.Color;
  position: [number, number, number];
  label: string;
  dark?: boolean;
}) {
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
            background: dark ? "#0D0D0D" : "#F8F4EA",
            color: dark ? "#F8F4EA" : "#0D0D0D",
            fontWeight: 800,
            fontSize: "10px",
            letterSpacing: "0.08em",
            border: "1px solid #0D0D0D",
            padding: "3px 6px",
            boxShadow: "0 8px 18px rgba(13,13,13,0.18)",
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
      <cylinderGeometry args={[0.035, 0.035, len, 12]} />
      <meshStandardMaterial color={color} roughness={0.32} metalness={0.18} />
    </mesh>
  );
}

function useSectorPoints(len: number): THREE.Vector3[] {
  return useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < len; i++) {
      pts.push(new THREE.Vector3(Math.sin(i * 0.82) * 0.5, 0, -i * 18));
    }
    return pts;
  }, [len]);
}
