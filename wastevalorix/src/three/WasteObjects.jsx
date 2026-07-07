import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const geometries = [
  new THREE.BoxGeometry(1.5, 1.5, 1.5), // Cardboard box
  new THREE.CylinderGeometry(0.5, 0.5, 2, 16), // Plastic bottle
  new THREE.TorusGeometry(1, 0.3, 16, 32), // Tire/rubber
  new THREE.IcosahedronGeometry(1, 0), // Crushed metal
];

const materials = [
  new THREE.MeshStandardMaterial({ color: '#8B4513', roughness: 0.9 }), // Cardboard
  new THREE.MeshStandardMaterial({ color: '#00aaff', opacity: 0.7, transparent: true, roughness: 0.2 }), // Plastic
  new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.8 }), // Rubber
  new THREE.MeshStandardMaterial({ color: '#aaaaaa', metalness: 0.8, roughness: 0.4 }), // Metal
];

export function WasteObjects({ scrollProgress }) {
  const groupRef = useRef();
  
  // Create 8 waste objects
  const objects = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      geometry: geometries[i % geometries.length],
      material: materials[i % materials.length],
      // Starting positions (wide orbit)
      startRadius: 15 + Math.random() * 10,
      startAngle: (i / 8) * Math.PI * 2,
      startHeight: (Math.random() - 0.5) * 10,
      // Target positions (converging to center)
      targetRadius: 0,
      targetAngle: 0,
      targetHeight: 0,
      // Random rotation speeds
      rotX: Math.random() * 2 - 1,
      rotY: Math.random() * 2 - 1,
      rotZ: Math.random() * 2 - 1,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Map scroll progress to object phases
    // Phase 1 (0.2 to 0.5): Appear and orbit
    // Phase 2 (0.5 to 0.7): Converge to center
    // Phase 3 (> 0.7): Disappear (handled by scaling to 0)
    
    let appearProgress = (scrollProgress - 0.2) * 3.33; // 0 to 1 between 0.2 and 0.5
    appearProgress = Math.min(Math.max(appearProgress, 0), 1);

    let convergeProgress = (scrollProgress - 0.5) * 5; // 0 to 1 between 0.5 and 0.7
    convergeProgress = Math.min(Math.max(convergeProgress, 0), 1);
    const convergeEase = Math.pow(convergeProgress, 2); // easeInQuad

    let burstProgress = (scrollProgress - 0.7) * 5; // 0 to 1 between 0.7 and 0.9
    burstProgress = Math.min(Math.max(burstProgress, 0), 1);

    groupRef.current.children.forEach((child, i) => {
      const obj = objects[i];
      
      // Current orbit angle
      const currentAngle = obj.startAngle + time * 0.5 * (i % 2 === 0 ? 1 : -1); // alternate directions
      
      // Radius shrinks during converge
      const currentRadius = THREE.MathUtils.lerp(obj.startRadius, obj.targetRadius, convergeEase);
      
      // Height converges to center
      const currentHeight = THREE.MathUtils.lerp(obj.startHeight, obj.targetHeight, convergeEase);

      // Position
      const x = currentRadius * Math.cos(currentAngle);
      const z = currentRadius * Math.sin(currentAngle);
      
      // Add floating effect before convergence
      const floatY = (1 - convergeEase) * Math.sin(time * 2 + i) * 1.5;
      
      child.position.set(x, currentHeight + floatY, z);

      // Rotation
      child.rotation.x += obj.rotX * 0.01;
      child.rotation.y += obj.rotY * 0.01;
      child.rotation.z += obj.rotZ * 0.01;
      
      // Scale
      // Start small, grow to 1, then shrink to 0 during burst
      let scale = appearProgress; // 0 to 1
      if (burstProgress > 0) {
        scale = 1 - burstProgress; // 1 to 0
      }
      
      // Optional: slight pulsating before burst
      if (convergeProgress > 0 && burstProgress === 0) {
         scale += Math.sin(time * 10 + i) * 0.05 * convergeProgress;
      }

      child.scale.set(scale, scale, scale);
    });
    
    // Slowly rotate the whole group
    groupRef.current.rotation.y = time * 0.1;
  });

  return (
    <group ref={groupRef}>
      {objects.map((obj, index) => (
        <mesh 
          key={index} 
          geometry={obj.geometry} 
          material={obj.material}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}
