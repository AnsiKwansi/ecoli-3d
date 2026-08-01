import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float } from '@react-three/drei';
import partsData from './data/parts.json';

export default function EcoliModel({ selectedPartId, onSelectPart }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const getLabel = (id, position) => {
    const part = partsData.find(p => p.id === id);
    const isActive = selectedPartId === id;
    
    return (
      <Html position={position} center zIndexRange={[100, 0]}>
        <div 
          className={`hotspot-label ${isActive ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelectPart(isActive ? null : part);
          }}
        >
          {part?.name}
        </div>
      </Html>
    );
  };

  return (
    <group ref={groupRef} dispose={null}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* Cell Wall / Capsule */}
        <mesh position={[0, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'capsule')); }}>
          <capsuleGeometry args={[1.5, 4, 32, 32]} />
          <meshPhysicalMaterial 
            color="#2563eb" 
            transparent 
            opacity={0.3} 
            roughness={0.1}
            transmission={0.9}
            thickness={0.5}
            clearcoat={1}
            side={2}
          />
          {getLabel('capsule', [0, 2, 1.5])}
        </mesh>

        {/* Cytoplasm */}
        <mesh position={[0, 0, 0]} scale={0.95} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'cytoplasm')); }}>
          <capsuleGeometry args={[1.5, 4, 32, 32]} />
          <meshPhysicalMaterial 
            color="#1e3a8a" 
            transparent 
            opacity={0.6}
            roughness={0.5}
          />
          {getLabel('cytoplasm', [0, -1, 1.2])}
        </mesh>

        {/* Nucleoid (DNA) */}
        <mesh position={[0, 0, 0]} scale={0.4} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'nucleoid')); }}>
          <torusKnotGeometry args={[1, 0.3, 100, 16, 2, 5]} />
          <meshStandardMaterial color="#fcd34d" emissive="#b45309" roughness={0.2} />
          {getLabel('nucleoid', [0, 0.5, 0.8])}
        </mesh>

        {/* Ribosomes */}
        {[
          [1, 1, 0.5], [-1, -1.5, 0.2], [0.5, -2, -0.5], [-0.8, 2, 0.4], [0, -1, -0.8]
        ].map((pos, idx) => (
          <mesh key={`ribo-${idx}`} position={pos} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'ribosomes')); }}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ef4444" roughness={0.8} />
          </mesh>
        ))}
        {getLabel('ribosomes', [1, 1.2, 0.6])}

        {/* Flagella */}
        {[
          [-2.8, -1.5, 0], [-3, 1.5, 0.5], [-3.2, 0, -0.5],
          [2.8, 1, 0], [3.1, -1, 0.5]
        ].map((pos, idx) => (
          <mesh key={`flag-${idx}`} position={pos} rotation={[0, 0, idx % 2 === 0 ? Math.PI/2.5 : -Math.PI/2.5]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'flagella')); }}>
            <cylinderGeometry args={[0.05, 0.05, 4, 8]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        ))}
        {getLabel('flagella', [-3.5, 2, 0])}

      </Float>
    </group>
  );
}
