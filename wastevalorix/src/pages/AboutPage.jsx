import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BookOpen, Layers, Users, ShieldCheck, ExternalLink } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12">
      
      {/* College Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="w-24 h-24 mx-auto bg-green-900 border-4 border-accent rounded-full flex items-center justify-center mb-6 shadow-card-glow">
           <span className="text-accent font-heading font-black tracking-widest text-xl">RVCE</span>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">R.V. College of Engineering, Bengaluru</h1>
        <h2 className="text-lg md:text-xl text-accent font-medium mb-4">Valorization of Waste Matter into Viable Energy</h2>
        
        <div className="inline-block bg-card border border-border px-4 py-2 rounded-full text-sm font-semibold text-text-soft">
          Academic Research &amp; Development Project 2025
        </div>
        <p className="mt-4 text-text-primary px-4">Subject Theme: Valorization of waste matter into viable energy.</p>
      </motion.div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4 text-accent">
            <BookOpen size={24} />
            <h3 className="text-xl font-heading font-bold text-white">What is WasteValorix?</h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">
            WasteValorix is an interactive diagnostic platform built to calculate the exact energy potential embedded in standard municipal and industrial waste. By simulating industrial practices (like Pyrolysis and Anaerobic Digestion), the app predicts raw electricity outcomes and equivalent CO₂ savings for sustainability reporting.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6"
        >
          <div className="flex items-center gap-3 mb-4 text-teal">
            <Layers size={24} />
            <h3 className="text-xl font-heading font-bold text-white">Technology Stack</h3>
          </div>
          <p className="text-sm text-text-primary leading-relaxed">
            Built using modern web technologies prioritizing speed and mobile-first responsiveness. Note: The Anthropic API connection is offline for this demo build to provide independent standalone functionality.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {['React 18', 'TailwindCSS', 'Framer Motion', 'Recharts', 'Vite', 'Lucide'].map(tech => (
              <span key={tech} className="bg-primary border border-border px-2 py-1 rounded text-xs font-semibold text-text-soft">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Team */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
         <h3 className="text-2xl font-heading font-bold text-white text-center flex items-center justify-center gap-2 mb-8">
           <Users className="text-accent" /> Team Members
         </h3>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((member, idx) => (
               <div key={idx} className="bg-card border border-border rounded-xl p-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary mx-auto mb-3 border border-border flex items-center justify-center text-xl font-bold text-text-soft">
                     {idx + 1}
                  </div>
                  <div className="font-semibold text-white mb-1">Student {idx + 1}</div>
                  <div className="text-xs text-text-muted">1RV21CS0{idx}0</div>
               </div>
            ))}
         </div>
      </motion.div>

      {/* Acknowledgements */}
      <div className="text-center border-t border-border pt-12 pb-8">
        <ShieldCheck size={32} className="mx-auto text-text-muted mb-4" />
        <p className="text-sm text-text-soft max-w-2xl mx-auto">
          We express our sincere gratitude to our faculty guides and the department at RVCE for their support and guidance during the ideation and development of WasteValorix framework. Data parameters derived from international EPA and IPCC estimates on calorific biomass.
        </p>
      </div>

    </div>
  );
};

export default AboutPage;
