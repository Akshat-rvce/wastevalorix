import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function EnergyParticles({ scrollProgress }) {
  const meshRef = useRef();
  const particleCount = 3000;

  // Pre-calculate random directions and speeds for the burst
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#ffdd00'); // Yellow/Gold
    const color2 = new THREE.Color('#ff0055'); // Pink/Red
    const color3 = new THREE.Color('#00ffff'); // Cyan

    for (let i = 0; i < particleCount; i++) {
      // Start at center
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;

      // Random spherical directions
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      // Speed distribution: some fast, many slow
      const speed = Math.pow(Math.random(), 2) * 50 + 10; 

      vel[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      vel[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      vel[i * 3 + 2] = speed * Math.cos(phi);

      // Randomly assign one of 3 colors
      const colorChoice = Math.random();
      let c;
      if (colorChoice < 0.33) c = color1;
      else if (colorChoice < 0.66) c = color2;
      else c = color3;

      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, velocities: vel, colors: col };
  }, [particleCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame((state) => {
    if (!meshRef.current) return;

    // Energy burst only active during the final phase (0.7 to 1.0)
    if (scrollProgress < 0.7) {
      meshRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;
    
    // Map scrollProgress (0.7 to 1.0) to a local "time" value t (0.0 to 2.0 seconds)
    const t = ((scrollProgress - 0.7) / 0.3) * 2.0;

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Expand outward with deceleration (drag)
      // v = v0 * exp(-k*t) -> position = v0/k * (1 - exp(-k*t))
      const drag = 2.0; 
      const factor = (1 - Math.exp(-drag * t)) / drag;

      const x = positions[ix] + velocities[ix] * factor;
      const y = positions[iy] + velocities[iy] * factor;
      const z = positions[iz] + velocities[iz] * factor;

      dummy.position.set(x, y, z);
      
      // Calculate scale and fade based on scroll progress mapping
      // Fade out as it expands
      const scaleFade = Math.max(0, 1 - t * 0.5); 
      const scale = 0.1 * scaleFade;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, particleCount]}>
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      <sphereGeometry args={[1, 4, 4]} />
      {/* Additive blending for energy glow effect */}
      <meshBasicMaterial 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
