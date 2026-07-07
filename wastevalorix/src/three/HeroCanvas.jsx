import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { LogoParticles } from './LogoParticles';
import { WasteObjects } from './WasteObjects';
import { EnergyParticles } from './EnergyParticles';
import { ScrollCamera } from './ScrollCamera';
import { Suspense } from 'react';

export function HeroCanvas({ scrollProgress }) {
  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none bg-black">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={[1, 2]} // Support retina displays
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={['#050505']} />
        
        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ff88" />
        
        <Suspense fallback={null}>
          <ScrollCamera scrollProgress={scrollProgress} />
          
          <group position={[0, 0, 0]}>
            <LogoParticles scrollProgress={scrollProgress} />
            <WasteObjects scrollProgress={scrollProgress} />
            <EnergyParticles scrollProgress={scrollProgress} />
          </group>
        </Suspense>
      </Canvas>
      
      {/* Optional: Add a subtle overlay gradient to blend with HTML content */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />
    </div>
  );
}
