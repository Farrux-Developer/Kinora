"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Monochrome hero scene: a breathing dot grid + floating wireframe
 * "film frames" with gentle mouse parallax. Navy/slate on white only.
 */

const INK = "#0f1d33";
const MIST = "#94a3b8";
const ACCENT = "#1e4fd8";

function DotGrid({ compact }: { compact: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const cols = compact ? 40 : 70;
  const rows = compact ? 24 : 36;

  const { positions, basePositions } = useMemo(() => {
    const array = new Float32Array(cols * rows * 3);
    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        array[i++] = (x / (cols - 1) - 0.5) * 22;
        array[i++] = (y / (rows - 1) - 0.5) * 10;
        array[i++] = 0;
      }
    }
    return { positions: array, basePositions: array.slice() };
  }, [cols, rows]);

  useFrame(({ clock }) => {
    const points = pointsRef.current;
    if (!points) return;
    const time = clock.elapsedTime * 0.6;
    const attr = points.geometry.attributes.position as THREE.BufferAttribute;
    const array = attr.array as Float32Array;
    for (let i = 0; i < array.length; i += 3) {
      const x = basePositions[i];
      const y = basePositions[i + 1];
      array[i + 2] = Math.sin(x * 0.55 + time) * Math.cos(y * 0.5 + time * 0.8) * 0.35;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, -1, -3]} rotation={[-0.5, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={MIST} size={0.035} sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

function FilmFrame({
  position,
  rotation,
  scale = 1,
  color = INK,
  opacity = 0.35,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
      <group position={position} rotation={rotation} scale={scale}>
        <mesh>
          <planeGeometry args={[2.4, 1.35]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.06} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(2.4, 1.35)]} />
          <lineBasicMaterial color={color} transparent opacity={opacity} />
        </lineSegments>
      </group>
    </Float>
  );
}

function Parallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointer.x * 0.08, 0.05);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, -pointer.y * 0.05, 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function HeroScene({ compact }: { compact: boolean }) {
  return (
    <Canvas
      dpr={compact ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <Parallax>
        <DotGrid compact={compact} />
        {!compact && (
          <>
            <FilmFrame position={[4.4, 1.2, -1]} rotation={[0.1, -0.5, 0.05]} />
            <FilmFrame position={[5.6, -0.6, -2]} rotation={[-0.1, -0.35, -0.06]} scale={0.8} opacity={0.25} />
            <FilmFrame position={[3.4, -0.2, 0.4]} rotation={[0.05, -0.6, 0.02]} scale={0.55} color={ACCENT} opacity={0.5} />
          </>
        )}
      </Parallax>
    </Canvas>
  );
}
