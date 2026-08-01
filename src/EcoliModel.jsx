import React, { useRef, useMemo } from 'react';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import partsData from './data/parts.json';

// Helper to get color by ID
const getColor = (id) => partsData.find(p => p.id === id)?.color || '#ffffff';

export default function EcoliModel({ selectedPartId, onSelectPart }) {
  const groupRef = useRef();
  const ribosomeMeshRef = useRef();

  const clipPlanes = useMemo(() => [
    new THREE.Plane(new THREE.Vector3(0.5, 0.2, -1).normalize(), 0.5)
  ], []);

  // 1. Procedural Supercoiled DNA (Nucleoid)
  const nucleoidCurve = useMemo(() => {
    const points = [];
    let currentPoint = new THREE.Vector3(0, 0, 0);
    // The cell is oriented along the Y axis (Capsule length=4, radius=1).
    // Let's spread the DNA throughout the long axis.
    const bounds = new THREE.Vector3(0.65, 2.2, 0.65); // Confinement bounding box
    for (let i = 0; i < 400; i++) {
      // Random walk within an ellipsoid bound
      const step = new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.6
      );
      currentPoint.add(step);
      
      // Constrain inside bounding ellipsoid
      if (Math.abs(currentPoint.x) > bounds.x) currentPoint.x = Math.sign(currentPoint.x) * bounds.x * Math.random();
      if (Math.abs(currentPoint.y) > bounds.y) currentPoint.y = Math.sign(currentPoint.y) * bounds.y * Math.random();
      if (Math.abs(currentPoint.z) > bounds.z) currentPoint.z = Math.sign(currentPoint.z) * bounds.z * Math.random();

      points.push(currentPoint.clone());
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  // 2. Macromolecular Crowding (Instanced Ribosomes)
  const ribosomeCount = 600;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useMemo(() => {
    if (ribosomeMeshRef.current) {
      for (let i = 0; i < ribosomeCount; i++) {
        // Distribute randomly inside the capsule but outside the dense center nucleoid
        let x, y, z;
        do {
          x = (Math.random() - 0.5) * 2;
          y = (Math.random() - 0.5) * 5;
          z = (Math.random() - 0.5) * 2;
        } while ((x*x)/1.0 + (y*y)/6.25 + (z*z)/1.0 > 1 || (x*x)/0.4 + (y*y)/4.8 + (z*z)/0.4 < 1); // Hollow ellipsoid distribution matching cell shape
        
        dummy.position.set(x, y, z);
        dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
        dummy.updateMatrix();
        ribosomeMeshRef.current.setMatrixAt(i, dummy.matrix);
      }
      ribosomeMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [dummy]);

  // 3. Helical Flagella
  const flagellaCurves = useMemo(() => {
    const curves = [];
    const numFlagella = 6; // Real E. coli have peritrichous flagella, but we cluster them at poles for clarity
    for (let f = 0; f < numFlagella; f++) {
      const points = [];
      const length = 6 + Math.random() * 3; // Longer flagella
      const radius = 0.35 + Math.random() * 0.1; // Wider coils
      const coils = 3 + Math.random() * 2;
      
      const baseY = f % 2 === 0 ? -3 : 3; // Attach to the top/bottom poles (Y axis)
      const baseX = (Math.random() - 0.5) * 0.8;
      const baseZ = (Math.random() - 0.5) * 0.8;
      
      const dirY = Math.sign(baseY);
      const spreadX = (Math.random() - 0.5) * 2;
      const spreadZ = (Math.random() - 0.5) * 2;
      
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const angle = t * Math.PI * 2 * coils;
        const y = baseY + (dirY * length * t);
        const x = baseX + (spreadX * t) + Math.cos(angle) * radius * (t + 0.2);
        const z = baseZ + (spreadZ * t) + Math.sin(angle) * radius * (t + 0.2);
        points.push(new THREE.Vector3(x, y, z));
      }
      curves.push(new THREE.CatmullRomCurve3(points));
    }
    return curves;
  }, []);

  // 4. Supercoiled Plasmids (Figure-8 / Twisted rings)
  const generatePlasmidCurve = (radius, twists) => {
    const points = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const angle = t * Math.PI * 2;
      // Lissajous-like twist
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.sin(angle * twists) * (radius * 0.3); 
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, true);
  };
  const reporterPlasmidCurve = useMemo(() => generatePlasmidCurve(0.2, 3), []);
  const fPlasmidCurve = useMemo(() => generatePlasmidCurve(0.35, 5), []);

  const getLabel = (id, labelPos, targetPos) => {
    const part = partsData.find(p => p.id === id);
    if (!part) return null;
    const isActive = selectedPartId === id;
    
    return (
      <group>
        {targetPos && (
          <Line 
            points={[targetPos, labelPos]} 
            color={part.color} 
            lineWidth={2}
            dashed={false}
            transparent
            opacity={0.7}
          />
        )}
        <Html position={labelPos} center zIndexRange={[100, 0]}>
          <div 
            className={`hotspot-label ${isActive ? 'active' : ''}`}
            style={isActive ? { 
              borderColor: part.color, 
              boxShadow: `0 0 15px ${part.color}80`,
              backgroundColor: 'rgba(30, 41, 59, 0.95)'
            } : {}}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPart(isActive ? null : part);
            }}
          >
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: part.color, marginRight: 6 }}></span>
            {part.name}
          </div>
        </Html>
      </group>
    );
  };

  const piliList = useMemo(() => {
    const list = [];
    const numPili = 250; // Increased count for "fuzz" look
    const piliLength = 0.2; // Slightly longer so they are recognizable
    const offsetRadius = 1.15 + (piliLength / 2); // Position so they stick out of the capsule

    for (let i = 0; i < numPili; i++) {
      const isCap = i > numPili * 0.6;
      let x, y, z, rotX, rotY, rotZ;

      if (!isCap) {
        const theta = Math.random() * Math.PI * 2;
        y = (Math.random() - 0.5) * 4;
        x = Math.sin(theta) * offsetRadius;
        z = Math.cos(theta) * offsetRadius;
        rotX = 0;
        rotY = theta;
        rotZ = Math.PI / 2;
      } else {
        const isTop = Math.random() > 0.5;
        const phi = Math.random() * (Math.PI / 2);
        const theta = Math.random() * Math.PI * 2;

        x = offsetRadius * Math.sin(phi) * Math.cos(theta);
        z = offsetRadius * Math.sin(phi) * Math.sin(theta);
        y = isTop ? 2 + offsetRadius * Math.cos(phi) : -2 - offsetRadius * Math.cos(phi);
        
        rotY = theta;
        rotZ = isTop ? Math.PI / 2 - phi : Math.PI / 2 + phi;
        rotX = 0;
      }
      list.push({ pos: [x, y, z], rot: [rotX, rotY, rotZ] });
    }
    return list;
  }, []);

  const geomArgs = [1, 4, 32, 32];

  return (
    <group ref={groupRef} dispose={null}>
      <group>
        
        {/* Envelopes (Organic texturing via roughness/metalness) */}
        <mesh scale={1.15} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'capsule')); }}>
          <capsuleGeometry args={geomArgs} />
          <meshStandardMaterial color={getColor('capsule')} transparent opacity={0.15} roughness={0.9} side={THREE.DoubleSide} clippingPlanes={clipPlanes} />
          {getLabel('capsule', [0, 3.5, 1.5], [0, 2, 1.15])}
        </mesh>
        
        <mesh scale={1.08} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'cell_wall')); }}>
          <capsuleGeometry args={geomArgs} />
          <meshStandardMaterial color={getColor('cell_wall')} transparent opacity={0.3} roughness={1} side={THREE.DoubleSide} clippingPlanes={clipPlanes} />
          {getLabel('cell_wall', [0, 2.5, 1.3], [0, 1.5, 1.08])}
        </mesh>
        
        <mesh scale={1.02} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'plasma_membrane')); }}>
          <capsuleGeometry args={geomArgs} />
          <meshStandardMaterial color={getColor('plasma_membrane')} transparent opacity={0.5} roughness={0.6} side={THREE.DoubleSide} clippingPlanes={clipPlanes} />
          {getLabel('plasma_membrane', [0, 1.5, 1.2], [0, 0.5, 1.02])}
        </mesh>
        
        <mesh scale={0.95} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'cytoplasm')); }}>
          <capsuleGeometry args={geomArgs} />
          <meshStandardMaterial color={getColor('cytoplasm')} roughness={0.8} transparent opacity={0.8} side={THREE.DoubleSide} clippingPlanes={clipPlanes} />
          {getLabel('cytoplasm', [0, -1, 1.2], [0, -0.5, 0.95])}
        </mesh>

        {/* Nucleoid (Supercoiled DNA mass) */}
        <group onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'nucleoid')); }}>
          <mesh>
            <tubeGeometry args={[nucleoidCurve, 400, 0.02, 6, false]} />
            <meshStandardMaterial color={getColor('nucleoid')} roughness={0.4} />
          </mesh>
          {getLabel('nucleoid', [0.5, 0.5, 1.5], [0.2, 0.2, 0.4])}
          
          {/* Double-Strand Break (DSB) Cut in Nucleoid */}
          <mesh position={[-0.4, -0.6, 0.5]} rotation={[0, 0, Math.PI / 4]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'dsb')); }}>
            <cylinderGeometry args={[0.2, 0.2, 0.3, 16]} />
            <meshStandardMaterial color={getColor('dsb')} />
            {getLabel('dsb', [-1.2, -0.5, 1.5], [-0.4, -0.6, 0.5])}
          </mesh>
        </group>

        {/* Instanced Ribosomes (Macromolecular Crowding) */}
        <instancedMesh ref={ribosomeMeshRef} args={[null, null, ribosomeCount]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'ribosomes')); }}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={getColor('ribosomes')} roughness={0.9} />
        </instancedMesh>
        {getLabel('ribosomes', [1.5, 0.5, 0.8], [0.8, 0, 0.2])}

        {/* GamGFP (Green DSB Sensor) */}
        <group position={[-0.4, -0.6, 0.5]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'gamgfp')); }}>
          {[[-0.1, 0.1, 0], [0.1, -0.1, 0.1], [0, 0.1, 0.1], [-0.1, -0.1, -0.1]].map((pos, idx) => (
            <mesh key={`gamgfp-${idx}`} position={pos}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color={getColor('gamgfp')} emissive={getColor('gamgfp')} emissiveIntensity={2} toneMapped={false} />
            </mesh>
          ))}
          {getLabel('gamgfp', [-1.5, -0.2, 0.8], [0, 0, 0])}
        </group>

        {/* I-SceI Endonuclease */}
        <group position={[-0.6, -0.8, 0.6]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'iscei')); }}>
          <mesh rotation={[Math.PI / 4, Math.PI / 3, 0]}>
            <octahedronGeometry args={[0.12]} />
            <meshStandardMaterial color={getColor('iscei')} roughness={0.5} />
          </mesh>
          {getLabel('iscei', [-1.6, -1.2, 1], [0, 0, 0])}
        </group>

        {/* RecBCD Enzyme */}
        <group position={[-0.2, -0.4, 0.4]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'recbcd')); }}>
          <mesh rotation={[0, Math.PI / 6, 0]}>
            <boxGeometry args={[0.2, 0.15, 0.15]} />
            <meshStandardMaterial color={getColor('recbcd')} roughness={0.7} />
          </mesh>
          {getLabel('recbcd', [0, -1.5, 1.5], [0, 0, 0])}
        </group>

        {/* TetR-mCherry Reporter (Red Locus) */}
        <group position={[0.4, 0.8, -0.3]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'tetr_mcherry')); }}>
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={getColor('tetr_mcherry')} emissive={getColor('tetr_mcherry')} emissiveIntensity={2} toneMapped={false} />
          </mesh>
          {getLabel('tetr_mcherry', [1.5, 1.5, 0.2], [0, 0, 0])}
        </group>

        {/* Co-localization (Yellow Foci) */}
        <group position={[0.6, -0.2, 0.2]} onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'coloc_yellow')); }}>
          <mesh position={[-0.05, 0, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={getColor('gamgfp')} emissive={getColor('gamgfp')} emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.05, 0.05, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={getColor('tetr_mcherry')} emissive={getColor('tetr_mcherry')} emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={getColor('coloc_yellow')} emissive={getColor('coloc_yellow')} emissiveIntensity={3} />
          </mesh>
          {getLabel('coloc_yellow', [2, -0.2, 0.5], [0, 0, 0])}
        </group>

        {/* Supercoiled Plasmids */}
        <group onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'plasmids')); }}>
          {/* Reporter Plasmid */}
          <mesh position={[-0.8, 1.2, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <tubeGeometry args={[reporterPlasmidCurve, 60, 0.015, 6, false]} />
            <meshStandardMaterial color={getColor('tetr_mcherry')} emissive={getColor('tetr_mcherry')} emissiveIntensity={0.5} />
          </mesh>
          
          {/* F Conjugative Plasmid */}
          <mesh position={[-0.5, 1.6, -0.3]} rotation={[Math.PI / 6, -Math.PI / 3, 0]}>
            <tubeGeometry args={[fPlasmidCurve, 60, 0.02, 6, false]} />
            <meshStandardMaterial color={getColor('plasmids')} />
          </mesh>
          {getLabel('plasmids', [-2, 1.8, 0.5], [-0.65, 1.4, -0.15])}
        </group>

        {/* Pili (Fimbriae) */}
        <group onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'pili')); }}>
          {piliList.map((pili, idx) => (
            <mesh key={`pili-${idx}`} position={pili.pos} rotation={pili.rot}>
              <cylinderGeometry args={[0.006, 0.006, 0.2, 5]} />
              <meshStandardMaterial color={getColor('pili')} roughness={0.9} clippingPlanes={clipPlanes} />
            </mesh>
          ))}
          {getLabel('pili', [2, 3, 1], [1.15, 2, 0])}
        </group>

        {/* Helical Flagella */}
        <group onClick={(e) => { e.stopPropagation(); onSelectPart(partsData.find(p => p.id === 'flagella')); }}>
          {flagellaCurves.map((curve, idx) => (
            <mesh key={`flag-${idx}`}>
              <tubeGeometry args={[curve, 60, 0.05, 8, false]} />
              <meshStandardMaterial color={getColor('flagella')} roughness={0.8} />
            </mesh>
          ))}
          {getLabel('flagella', [1, -5, 1], [0, -3.4, 0.5])}
        </group>

      </group>
    </group>
  );
}
