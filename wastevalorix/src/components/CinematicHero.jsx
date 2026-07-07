import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Focus } from 'lucide-react';
import { HeroCanvas } from '../three/HeroCanvas';
import { useScrollProgress } from '../hooks/useScrollProgress';

export function CinematicHero() {
  const globalScrollProgress = useScrollProgress();
  const navigate = useNavigate();
  
  // Since the cinematic section is at the top of the page and 400vh tall,
  // we want to map the global scroll progress (which is over the whole document)
  // to a local progress (0 to 1) just for this 400vh section.
  
  const [localProgress, setLocalProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 400vh is 4 times the window height
      // The scrollable distance for this section is 300vh (400vh total height - 100vh viewport)
      const sectionHeight = window.innerHeight * 4;
      const scrollDistance = sectionHeight - window.innerHeight;
      
      const scrollY = window.scrollY;
      const progress = scrollDistance > 0 ? Math.min(Math.max(scrollY / scrollDistance, 0), 1) : 0;
      
      setLocalProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    // We use a relative container of height 400vh to allow scrolling
    <section className="relative w-full h-[400vh] cinematic-container bg-black">
      {/* Sticky container that holds the canvas and UI, keeping it in view while scrolling */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        <HeroCanvas scrollProgress={localProgress} />

        {/* HTML UI Overlays */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 text-white z-10 md:pt-16">
          
          {/* Title - fades out as scroll progresses */}
          <div 
            className="text-center transition-opacity duration-500 pointer-events-auto"
            style={{ opacity: localProgress < 0.2 ? 1 : 0, transform: `translateY(${localProgress * -100}px)` }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
              Waste<span className="text-green-400">Valorix</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-8">
              Transforming waste into tomorrow's resources.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <button 
                 onClick={() => navigate('/analyze')}
                 className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2 text-lg px-8 shadow-[0_0_30px_rgba(0,230,118,0.2)] hover:shadow-[0_0_40px_rgba(0,230,118,0.4)]"
               >
                 <Focus size={20} className="text-black" /> Scan Now
               </button>
               <button 
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto btn-ghost text-lg px-8 flex items-center justify-center gap-2 border-border/50 hover:bg-white/5"
               >
                 See How <ArrowRight size={18} />
               </button>
            </div>
          </div>

          {/* Phase 2 Text: The Problem */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-700"
            style={{ 
              opacity: localProgress >= 0.25 && localProgress < 0.55 ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${localProgress >= 0.25 && localProgress < 0.55 ? 1 : 0.9})`
            }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">The Global Challenge</h2>
            <p className="text-xl text-gray-300">Millions of tons of potential value discarded daily.</p>
          </div>

          {/* Phase 3 Text: The Solution (Burst) */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-700"
            style={{ 
              opacity: localProgress >= 0.7 ? 1 : 0,
              transform: `translate(-50%, -50%) scale(${localProgress >= 0.7 ? 1 : 1.1})`
            }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-green-400 drop-shadow-[0_0_15px_rgba(0,255,136,0.5)]">
              Energy Unleashed
            </h2>
            <p className="text-2xl text-white font-medium">Discover the hidden value in every item.</p>
          </div>

          {/* Scroll Indicator */}
          <div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center transition-opacity duration-300"
            style={{ opacity: localProgress > 0.9 ? 0 : 1 }}
          >
            <span className="text-sm uppercase tracking-widest text-gray-400 mb-2">Scroll to explore</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-green-500 to-transparent animate-pulse" />
          </div>
          
          {/* Progress indicators */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            {[0, 0.33, 0.66, 1].map((step, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  Math.abs(localProgress - step) < 0.2 ? 'bg-green-400 scale-150 shadow-[0_0_10px_#00ff88]' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
