import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';

const ParticleGlobe = () => {
  const ref = useRef();
  
  // Generate random points on a sphere
  const count = 300;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 2.2; // radius
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  const lines = useMemo(() => {
    const lineIndices = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = positions[i*3] - positions[j*3];
        const dy = positions[i*3+1] - positions[j*3+1];
        const dz = positions[i*3+2] - positions[j*3+2];
        const distSq = dx*dx + dy*dy + dz*dz;
        if (distSq < 1.5) { // connect close nodes
          lineIndices.push(i, j);
        }
      }
    }
    return new Uint16Array(lineIndices);
  }, [positions, count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.1;
      ref.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group ref={ref}>
      <Points positions={positions}>
        <PointMaterial
          transparent
          color="#00E676"
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="index"
            count={lines.length}
            array={lines}
            itemSize={1}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00E676" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {/* Inner glowing sphere */}
      <Sphere args={[2.0, 32, 32]}>
        <meshBasicMaterial color="#00E676" transparent opacity={0.02} blending={THREE.AdditiveBlending} />
      </Sphere>
    </group>
  );
};

export default function ThreeGlobe() {
  return (
    <div className="absolute inset-0 -z-10 bg-primary overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <color attach="background" args={['#030A05']} />
        <ambientLight intensity={0.5} />
        <ParticleGlobe />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
