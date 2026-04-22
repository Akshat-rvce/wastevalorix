import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ScrollCamera({ scrollProgress }) {
  const cameraRef = useRef();

  useFrame((state) => {
    // Scroll progress maps from 0 to 1 over the full height of the document
    // However, our cinematic container is 400vh
    // We want the 3D cinematic section to end at roughly scrollProgress = 0.5 (or whatever mapping we use)
    // Actually, let's keep it simple: we use a specific multiplier in the main component.
    // For now, let's just animate the camera based on `scrollProgress` from 0 to 1 representing the cinematic section.

    // Calculate a local progress for just the camera animation (0 to 1)
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
