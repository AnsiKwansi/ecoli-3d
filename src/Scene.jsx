import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import EcoliModel from './EcoliModel';

// Simple camera controller to jump to specific points
function CameraController({ selectedPart }) {
  const { camera } = useThree();

  useEffect(() => {
    if (selectedPart && selectedPart.cameraPos) {
      // In a more complex app, use @react-spring/three for smooth animation
      // Here we just set position
      camera.position.set(...selectedPart.cameraPos);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 0, 10);
      camera.lookAt(0, 0, 0);
    }
  }, [selectedPart, camera]);

  return null;
}

export default function Scene({ selectedPart, onSelectPart }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 45 }}
      dpr={[1, 2]}
      gl={{ localClippingEnabled: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} color="#ffffff" />
      <spotLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
      
      <EcoliModel selectedPartId={selectedPart?.id} onSelectPart={onSelectPart} />
      
      <Environment preset="city" />
      
      <ContactShadows position={[0, -4, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
      
      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
      </EffectComposer>

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={!selectedPart}
        autoRotateSpeed={0.5}
        makeDefault
      />
      
      <CameraController selectedPart={selectedPart} />
    </Canvas>
  );
}
