import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function LogoParticles({ scrollProgress }) {
  const meshRef = useRef();
  const particleCount = 2000;

  // We define two sets of positions for each particle: chaotic and organized (the "W")
  const { positions, targets, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const tar = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const colorStart = new THREE.Color('#ffffff'); // White
    const colorEnd = new THREE.Color('#00ff88');   // Neon green

    for (let i = 0; i < particleCount; i++) {
      // Chaotic starting positions (a large sphere)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 20 + Math.random() * 30; // Radius between 20 and 50

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Target positions for the "W"
      // A simple W shape consists of 4 line segments
      const segment = Math.floor(Math.random() * 4);
      let t = Math.random();
      
      let x = 0, y = 0;
      
      // Basic W coordinates
      // P1: (-4, 4), P2: (-2, -4), P3: (0, 1), P4: (2, -4), P5: (4, 4)
      if (segment === 0) { // P1 to P2
        x = -4 + t * 2; y = 4 - t * 8;
      } else if (segment === 1) { // P2 to P3
        x = -2 + t * 2; y = -4 + t * 5;
      } else if (segment === 2) { // P3 to P4
        x = 0 + t * 2; y = 1 - t * 5;
      } else { // P4 to P5
        x = 2 + t * 2; y = -4 + t * 8;
      }

      // Add slight randomness to the W shape to make it less rigid
      tar[i * 3] = x + (Math.random() - 0.5) * 0.5;
      tar[i * 3 + 1] = y + (Math.random() - 0.5) * 0.5;
      tar[i * 3 + 2] = (Math.random() - 0.5) * 1.0;

      // Assign color (mix based on vertical position in the W)
      const mixedColor = colorStart.clone().lerp(colorEnd, (y + 4) / 8);
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }

    return { positions: pos, targets: tar, colors: col };
  }, [particleCount]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Animation progress 0 to 1 based on scroll (e.g., logo forms early on)
    // Map scrollProgress (0 to 1 overall) to a local phase (e.g., 0 to 0.3)
    let p = scrollProgress * 3; // 0 to 1 when overall scroll is 0 to 0.33
    p = Math.min(Math.max(p, 0), 1);
    
    // Use an easing function for smoother assembly
    const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic

    // Also add a continuous gentle wave
    const time = state.clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Base interpolation between start and target
      let x = THREE.MathUtils.lerp(positions[ix], targets[ix], ease);
      let y = THREE.MathUtils.lerp(positions[iy], targets[iy], ease);
      let z = THREE.MathUtils.lerp(positions[iz], targets[iz], ease);

      // Add gentle floating motion when formed
      if (ease > 0.8) {
        const floatAmt = (ease - 0.8) * 5; // scales from 0 to 1
        x += Math.sin(time * 2 + i) * 0.05 * floatAmt;
        y += Math.cos(time * 1.5 + i) * 0.05 * floatAmt;
        z += Math.sin(time * 1.8 + i) * 0.05 * floatAmt;
      }

      dummy.position.set(x, y, z);
      
      // Calculate scale based on progress (start small, grow, then slightly pulse)
      let scalePhase = ease;
      if (ease > 0.9) {
          scalePhase = 0.9 + Math.sin(time * 3 + i * 0.1) * 0.1;
      }
      
      const scale = 0.05 + 0.15 * scalePhase; // Base particle size
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Rotate the whole logo slowly
    meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.2;
    meshRef.current.rotation.x = Math.cos(time * 0.15) * 0.1;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, particleCount]}>
      <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.8} />
    </instancedMesh>
  );
}
