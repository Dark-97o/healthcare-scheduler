import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const WORDS = [
  'Neurology', 'Cardiology', 'Orthopedics', 'Pediatrics', 
  'Oncology', 'Dermatology', 'Endocrinology', 'Psychiatry', 
  'Urology', 'Radiology', 'Pathology', 'Surgery', 
  'Gastroenterology', 'Pulmonology', 'Rheumatology', 'Nephrology'
];

export default function WordSphere({ radius = 3.5 }: { radius?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Distribute words over a sphere using Fibonacci lattice
  const words = useMemo(() => {
    const list = [];
    const count = WORDS.length;
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
      const r = Math.sqrt(1 - y * y); // radius at y
      const theta = phi * i; // golden angle increment
      
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      
      list.push({
        position: new THREE.Vector3(x * radius, y * radius, z * radius),
        word: WORDS[i]
      });
    }
    return list;
  }, [radius]);

  // Rotate the entire sphere
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {words.map((item, i) => (
        <Word key={i} position={item.position} children={item.word} />
      ))}
    </group>
  );
}

function Word({ position, children }: { position: THREE.Vector3, children: string }) {
  const ref = useRef<any>(null);
  const color = new THREE.Color();
  
  // Make words always face the camera
  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.quaternion.copy(camera.quaternion);
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      color="#00e5ff"
      fontSize={0.45}
      font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf"
      anchorX="center"
      anchorY="middle"
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
        if (ref.current) ref.current.color = color.set('#7c3aed');
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        if (ref.current) ref.current.color = color.set('#00e5ff');
      }}
    >
      {children}
    </Text>
  );
}
