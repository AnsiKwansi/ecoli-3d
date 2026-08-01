import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import partsData from './data/parts.json';

const getColor = (id) => partsData.find(p => p.id === id)?.color || '#ffffff';

export default function EcoliModel({ simState, onSelectPart, selectedPartId }) {
  const groupRef = useRef();
  const ribosomeMeshRef = useRef();

  const clipPlanes = useMemo(() => [
    new THREE.Plane(new THREE.Vector3(0.5, 0.2, -1).normalize(), 0.5)
  ], []);

  // Nucleoid: supercoiled DNA random walk
  const nucleoidCurve = useMemo(() => {
    const points = [];
    let pt = new THREE.Vector3(0, 0, 0);
    const bounds = new THREE.Vector3(0.65, 2.2, 0.65);
    for (let i = 0; i < 400; i++) {
      pt.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 0.6
      ));
      if (Math.abs(pt.x) > bounds.x) pt.x = Math.sign(pt.x) * bounds.x * Math.random();
      if (Math.abs(pt.y) > bounds.y) pt.y = Math.sign(pt.y) * bounds.y * Math.random();
      if (Math.abs(pt.z) > bounds.z) pt.z = Math.sign(pt.z) * bounds.z * Math.random();
      points.push(pt.clone());
    }
    return new THREE.CatmullRomCurve3(points, true);
  }, []);

  // Instanced ribosomes
  const ribosomeCount = 500;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useEffect(() => {
    if (!ribosomeMeshRef.current) return;
    for (let i = 0; i < ribosomeCount; i++) {
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 2;
        y = (Math.random() - 0.5) * 5;
        z = (Math.random() - 0.5) * 2;
      } while ((x*x)/1.0 + (y*y)/6.25 + (z*z)/1.0 > 1 || (x*x)/0.4 + (y*y)/4.8 + (z*z)/0.4 < 1);
      dummy.position.set(x, y, z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.scale.setScalar(Math.random() * 0.5 + 0.5);
      dummy.updateMatrix();
      ribosomeMeshRef.current.setMatrixAt(i, dummy.matrix);
    }
    ribosomeMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  // Helical flagella
  const flagellaCurves = useMemo(() => {
    const curves = [];
    for (let f = 0; f < 6; f++) {
      const points = [];
      const length = 6 + Math.random() * 3;
      const radius = 0.35 + Math.random() * 0.1;
      const coils = 3 + Math.random() * 2;
      const baseY = f % 2 === 0 ? -3 : 3;
      const baseX = (Math.random() - 0.5) * 0.8;
      const baseZ = (Math.random() - 0.5) * 0.8;
      const dirY = Math.sign(baseY);
      const spreadX = (Math.random() - 0.5) * 2;
      const spreadZ = (Math.random() - 0.5) * 2;
      for (let i = 0; i <= 60; i++) {
        const t = i / 60;
        const angle = t * Math.PI * 2 * coils;
        points.push(new THREE.Vector3(
          baseX + spreadX * t + Math.cos(angle) * radius * (t + 0.2),
          baseY + dirY * length * t,
          baseZ + spreadZ * t + Math.sin(angle) * radius * (t + 0.2)
        ));
      }
      curves.push(new THREE.CatmullRomCurve3(points));
    }
    return curves;
  }, []);

  // Supercoiled plasmids
  const makePlasmidCurve = (r, twists) => {
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60;
      const a = t * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r, Math.sin(a * twists) * r * 0.3));
    }
    return new THREE.CatmullRomCurve3(pts, true);
  };
  const reporterPlasmid = useMemo(() => makePlasmidCurve(0.2, 3), []);
  const fPlasmid = useMemo(() => makePlasmidCurve(0.35, 5), []);

  // Pili
  const piliList = useMemo(() => {
    const list = [];
    const num = 250;
    const len = 0.2;
    const oR = 1.15 + len / 2;
    for (let i = 0; i < num; i++) {
      const isCap = i > num * 0.6;
      let x, y, z, rotX, rotY, rotZ;
      if (!isCap) {
        const theta = Math.random() * Math.PI * 2;
        y = (Math.random() - 0.5) * 4;
        x = Math.sin(theta) * oR;
        z = Math.cos(theta) * oR;
        rotX = 0; rotY = theta; rotZ = Math.PI / 2;
      } else {
        const isTop = Math.random() > 0.5;
        const phi = Math.random() * (Math.PI / 2);
        const theta = Math.random() * Math.PI * 2;
        x = oR * Math.sin(phi) * Math.cos(theta);
        z = oR * Math.sin(phi) * Math.sin(theta);
        y = isTop ? 2 + oR * Math.cos(phi) : -2 - oR * Math.cos(phi);
        rotY = theta;
        rotZ = isTop ? Math.PI / 2 - phi : Math.PI / 2 + phi;
        rotX = 0;
      }
      list.push({ pos: [x, y, z], rot: [rotX, rotY, rotZ] });
    }
    return list;
  }, []);

  // Cell viability model: Default Natural Color (#60a5fa Capsule) vs Black = Dead (#09090b Pitch Black Envelope)
  const viability = simState?.cellViability ?? 100;
  const isDead = simState?.phase === 'CELL_DEATH' || viability <= 15;
  
  let capsuleColor = getColor('capsule'); // #60a5fa Default Natural Translucent Blue-Cyan
  let wallColor = getColor('cell_wall'); // #bef264 Lime Green Peptidoglycan
  let membraneColor = getColor('plasma_membrane'); // #fb923c Phospholipid Bilayer
  let capsuleOpacity = 0.25;

  if (isDead) {
    capsuleColor = '#09090b'; // Pitch Black Dead Lysed Cell Envelope
    wallColor = '#18181b';
    membraneColor = '#09090b';
    capsuleOpacity = 0.9;
  }

  const getLabel = (id, labelPos, targetPos) => {
    const part = partsData.find(p => p.id === id);
    if (!part) return null;
    const isActive = selectedPartId === id;
    return (
      <group>
        {targetPos && (
          <Line points={[targetPos, labelPos]} color={part.color} lineWidth={2} transparent opacity={0.7} />
        )}
        <Html position={labelPos} center zIndexRange={[100, 0]}>
          <div
            className={`hotspot-label ${isActive ? 'active' : ''}`}
            style={isActive ? { borderColor: part.color, boxShadow: `0 0 15px ${part.color}80`, backgroundColor: 'rgba(30,41,59,0.95)' } : {}}
            onClick={(e) => { e.stopPropagation(); onSelectPart(isActive ? null : part); }}
          >
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', backgroundColor: part.color, marginRight: 6 }} />
            {part.name}
          </div>
        </Html>
      </group>
    );
  };

  const geomArgs = [1, 4, 32, 32];

  return (
    <group ref={groupRef}>
      <group>
        {/* Outer Capsule Envelope — Natural Blue-Cyan (#60a5fa) Default, Pitch Black (#09090b) Dead */}
        <mesh scale={1.15}>
          <capsuleGeometry args={geomArgs} />
          <meshStandardMaterial
            color={capsuleColor}
            transparent
            opacity={capsuleOpacity}
            roughness={0.5}
            side={THREE.DoubleSide}
            clippingPlanes={clipPlanes}
          />
          {getLabel('capsule', [0, 3.5, 1.5], [0, 2, 1.15])}
        </mesh>
        
        {/* Cell Wall Layer */}
        <mesh scale={1.08}>
          <capsuleGeometry args={geomArgs} />
          <meshStandardMaterial
            color={wallColor}
            transparent
            opacity={isDead ? 0.8 : 0.35}
            roughness={0.8}
            side={THREE.DoubleSide}
            clippingPlanes={clipPlanes}
          />
        </mesh>

        {/* Inner Plasma Membrane */}
        <mesh scale={1.02}>
          <capsuleGeometry args={geomArgs} />
          <meshStandardMaterial
            color={membraneColor}
            transparent
            opacity={isDead ? 0.9 : 0.5}
            roughness={0.6}
            side={THREE.DoubleSide}
            clippingPlanes={clipPlanes}
          />
        </mesh>

        {/* Nucleoid DNA */}
        <group>
          <mesh>
            <tubeGeometry args={[nucleoidCurve, 400, 0.02, 6, false]} />
            <meshStandardMaterial color={isDead ? '#27272a' : getColor('nucleoid')} roughness={0.4} />
          </mesh>
          {getLabel('nucleoid', [1.8, 0.5, 0.5], [0.2, 0.2, 0.4])}
        </group>

        {/* Dynamic DSB Sites from simulation */}
        {simState?.dsbSites?.map((dsb) => (
          <group key={dsb.id} position={dsb.position}>
            {/* Dark break point */}
            <mesh>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#000" />
            </mesh>
            {/* Red pulsing halo for fresh DSB */}
            {dsb.state === 'FRESH' && (
              <mesh>
                <sphereGeometry args={[0.15, 12, 12]} />
                <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={3} toneMapped={false} transparent opacity={0.6} />
              </mesh>
            )}
            {/* GamGFP bound (green glow) */}
            {(dsb.state === 'GAMGFP_BOUND' || dsb.state === 'REPAIRING') && (
              <mesh>
                <sphereGeometry args={[0.12, 12, 12]} />
                <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={3} toneMapped={false} transparent opacity={0.8} />
              </mesh>
            )}
            {/* RecA filament (orange tube near break) */}
            {dsb.state === 'REPAIRING' && (
              <mesh position={[0.1, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
                <meshStandardMaterial color="#fb923c" emissive="#fb923c" emissiveIntensity={1} />
              </mesh>
            )}
            {/* Repaired — fading green */}
            {dsb.state === 'REPAIRED' && (
              <mesh>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial color="#22c55e" transparent opacity={0.2} />
              </mesh>
            )}
            {/* Mutated - bright yellow glowing */}
            {dsb.state === 'MUTATED' && (
              <mesh>
                <sphereGeometry args={[0.1, 12, 12]} />
                <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={2} toneMapped={false} transparent opacity={0.8} />
              </mesh>
            )}
          </group>
        ))}

        {/* Dynamic Thymine Dimers (UV Damage - NER Pathway) */}
        {simState?.dimerSites?.map((dimer) => (
          <group key={dimer.id} position={dimer.position}>
            {dimer.state === 'FRESH' && (
              <mesh>
                <sphereGeometry args={[0.09, 10, 10]} />
                <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} toneMapped={false} />
              </mesh>
            )}
            {dimer.state === 'UVRABC_BOUND' && (
              <group>
                <mesh>
                  <sphereGeometry args={[0.09, 10, 10]} />
                  <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={1} />
                </mesh>
                {/* UvrABC Excinuclease Complex bound mesh */}
                <mesh position={[0.06, 0.06, 0]}>
                  <octahedronGeometry args={[0.1, 0]} />
                  <meshStandardMaterial color="#0284c7" emissive="#0ea5e9" emissiveIntensity={0.8} />
                </mesh>
              </group>
            )}
            {dimer.state === 'REPAIRED' && (
              <mesh>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial color="#38bdf8" transparent opacity={0.2} />
              </mesh>
            )}
          </group>
        ))}

        {/* Dynamic Oxidative DNA Damage (H2O2 - BER Pathway) */}
        {simState?.oxDamageSites?.map((ox) => (
          <group key={ox.id} position={ox.position}>
            {ox.state === 'FRESH' && (
              <mesh>
                <sphereGeometry args={[0.08, 10, 10]} />
                <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={2.5} toneMapped={false} />
              </mesh>
            )}
            {ox.state === 'GLYCOSYLASE_BOUND' && (
              <group>
                <mesh>
                  <sphereGeometry args={[0.08, 10, 10]} />
                  <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={1} />
                </mesh>
                {/* DNA Glycosylase mesh bound */}
                <mesh position={[-0.05, 0.05, 0]}>
                  <dodecahedronGeometry args={[0.09, 0]} />
                  <meshStandardMaterial color="#ca8a04" emissive="#facc15" emissiveIntensity={0.6} />
                </mesh>
              </group>
            )}
            {ox.state === 'REPAIRED' && (
              <mesh>
                <sphereGeometry args={[0.04, 8, 8]} />
                <meshStandardMaterial color="#eab308" transparent opacity={0.2} />
              </mesh>
            )}
          </group>
        ))}

        {/* Hotspot Labels for NER & BER Repair Complexes when active */}
        {simState?.uvrabcBound > 0 && simState?.dimerSites?.find(d => d.state === 'UVRABC_BOUND') && (
          getLabel('uvrabc', [-1.8, 1.0, 1.2], simState.dimerSites.find(d => d.state === 'UVRABC_BOUND').position)
        )}
        {simState?.glycosylaseBound > 0 && simState?.oxDamageSites?.find(o => o.state === 'GLYCOSYLASE_BOUND') && (
          getLabel('glycosylase', [1.8, -1.0, 1.2], simState.oxDamageSites.find(o => o.state === 'GLYCOSYLASE_BOUND').position)
        )}
        {simState?.gamgfpBound > 0 && simState?.dsbSites?.find(d => d.state === 'GAMGFP_BOUND') && (
          getLabel('gamgfp', [-1.8, -1.2, 1.2], simState.dsbSites.find(d => d.state === 'GAMGFP_BOUND').position)
        )}

        {/* RecBCD and Pol IV near active DSBs */}
        {simState?.phase === 'REPAIRING' && simState.dsbSites.filter(d => d.state === 'REPAIRING').slice(0, 3).map((dsb, idx) => (
          <group key={`enzymes-${idx}`} position={[dsb.position[0] + 0.2, dsb.position[1] - 0.1, dsb.position[2]]}>
            <mesh position={[0,0,0]}>
              <boxGeometry args={[0.12, 0.08, 0.08]} />
              <meshStandardMaterial color={getColor('recbcd')} roughness={0.7} />
            </mesh>
            {simState.maxDsbs >= 5 && (
              <mesh position={[0.15,0,0]}>
                <boxGeometry args={[0.08, 0.08, 0.08]} />
                <meshStandardMaterial color={getColor('pol4')} roughness={0.5} />
              </mesh>
            )}
          </group>
        ))}

        {/* Instanced Ribosomes */}
        <instancedMesh ref={ribosomeMeshRef} args={[null, null, ribosomeCount]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial color={isDead ? '#3f3f46' : getColor('ribosomes')} roughness={0.9} />
        </instancedMesh>

        {/* Supercoiled Plasmids */}
        <group>
          <mesh position={[-0.8, 1.2, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <tubeGeometry args={[reporterPlasmid, 60, 0.015, 6, false]} />
            <meshStandardMaterial color={isDead ? '#52525b' : '#ef4444'} emissive={isDead ? '#000000' : '#ef4444'} emissiveIntensity={isDead ? 0 : 0.3} />
          </mesh>
          <mesh position={[-0.5, 1.6, -0.3]} rotation={[Math.PI / 6, -Math.PI / 3, 0]}>
            <tubeGeometry args={[fPlasmid, 60, 0.02, 6, false]} />
            <meshStandardMaterial color={isDead ? '#3f3f46' : getColor('plasmids')} />
          </mesh>
          {getLabel('plasmids', [-2, 1.8, 0.5], [-0.65, 1.4, -0.15])}
        </group>

        {/* Pili */}
        <group>
          {piliList.map((p, i) => (
            <mesh key={`pili-${i}`} position={p.pos} rotation={p.rot}>
              <cylinderGeometry args={[0.006, 0.006, 0.2, 5]} />
              <meshStandardMaterial color={isDead ? '#27272a' : getColor('pili')} roughness={0.9} clippingPlanes={clipPlanes} />
            </mesh>
          ))}
        </group>

        {/* Helical Flagella */}
        <group>
          {flagellaCurves.map((c, i) => (
            <mesh key={`flag-${i}`}>
              <tubeGeometry args={[c, 60, 0.05, 8, false]} />
              <meshStandardMaterial color={isDead ? '#18181b' : getColor('flagella')} roughness={0.8} />
            </mesh>
          ))}
          {getLabel('flagella', [1, -5, 1], [0, -3.4, 0.5])}
        </group>
      </group>
    </group>
  );
}
