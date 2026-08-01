import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import EcoliModel from './EcoliModel';

function UVFlash({ active, onDone }) {
  const meshRef = useRef();
  const startTime = useRef(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    if (active && startTime.current === null) {
      startTime.current = clock.elapsedTime;
      meshRef.current.visible = true;
    }
    if (startTime.current !== null) {
      const elapsed = clock.elapsedTime - startTime.current;
      const opacity = Math.max(0, 1 - elapsed / 0.6);
      meshRef.current.material.opacity = opacity;
      if (elapsed > 0.6) {
        meshRef.current.visible = false;
        startTime.current = null;
        onDone();
      }
    }
  });

  return (
    <mesh ref={meshRef} visible={false} position={[0, 0, 0]} scale={30}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#a855f7" transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

function SimTicker({ simState, dispatch }) {
  useFrame((_, delta) => {
    if (simState.phase !== 'IDLE' && simState.phase !== 'RESOLVED' && simState.phase !== 'CELL_DEATH') {
      dispatch({ type: 'TICK', payload: delta * simState.timeScale });
    }
  });
  return null;
}

export default function Scene({ simState, dispatch, selectedPart, onSelectPart }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50 }}
      dpr={[1, 2]}
      gl={{ localClippingEnabled: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-10, 5, -5]} intensity={0.8} color="#ffffff" />
      <spotLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />

      <Environment preset="city" />

      <EcoliModel
        simState={simState}
        selectedPartId={selectedPart?.id}
        onSelectPart={onSelectPart}
      />

      <UVFlash
        active={simState.uvFlashActive}
        onDone={() => dispatch({ type: 'UV_FLASH_DONE' })}
      />

      <SimTicker simState={simState} dispatch={dispatch} />

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} />
      </EffectComposer>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        autoRotate={false}
        maxDistance={25}
        minDistance={4}
      />
    </Canvas>
  );
}
