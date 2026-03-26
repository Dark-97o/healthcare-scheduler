import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// An abstract futuristic medical cross
function MedicalCross() {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.15;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 3.5, 1]} />
          <meshStandardMaterial color="#5a7d65" roughness={0.1} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.5, 1, 1]} />
          <meshStandardMaterial color="#8aab95" roughness={0.1} metalness={0.8} />
        </mesh>
        <Sphere args={[0.7, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#b8924a" emissive="#b8924a" emissiveIntensity={0.5} />
        </Sphere>
      </Float>
    </group>
  );
}

// Data dust particles for background depth
function Particles() {
  const particlesCount = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
    }
    return pos;
  }, [particlesCount]);

  const points = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#d4a85c" size={0.05} sizeAttenuation={true} depthWrite={false} />
    </Points>
  );
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 w-full h-[120vh]">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ede7d9" />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#5a7d65" />
        <pointLight position={[0, 0, 0]} intensity={1} color="#b8924a" />
        
        <MedicalCross />
        <Particles />
        <Environment preset="city" />
      </Canvas>
      {/* Light gradient overlay to blend 3D canvas with the page content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-(--color-cream)/50 to-(--color-cream) pointer-events-none" />
    </div>
  );
}
