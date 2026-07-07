import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ScrollCamera({ scrollProgress }) {
  useFrame((state) => {
    const p = Math.min(Math.max(scrollProgress, 0), 1);

    // Initial position: close up, slightly tilted
    const startPos = new THREE.Vector3(0, 0, 15);
    const startTarget = new THREE.Vector3(0, 0, 0);

    // Final position: zoomed out, looking straight on
    const endPos = new THREE.Vector3(0, -2, 25);
    const endTarget = new THREE.Vector3(0, 0, 0);

    // Interpolate position
    state.camera.position.lerpVectors(startPos, endPos, p);
    
    // Smooth lookat
    const currentTarget = new THREE.Vector3().lerpVectors(startTarget, endTarget, p);
    state.camera.lookAt(currentTarget);
  });

  return null; // Camera component doesn't render anything visible
}
