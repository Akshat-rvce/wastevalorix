import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, BrainCircuit, Zap, Globe, ArrowRight, Focus, Store, Cpu, BarChart3, TreePine, ArrowDownToDot, LineChart as LineChartIcon, Recycle, Droplets, FlaskConical, Box, Package } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { WASTE_TYPES } from '../constants/wasteData';
import { CinematicHero } from '../components/CinematicHero';

// Reusable Counter Component triggered on scroll
const ScrollCounter = ({ end, duration = 2000, prefix = "", suffix = "", label, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    window.requestAnimationFrame(step);
  }, [isInView, end, duration]);

  const value = count.toFixed(decimals);
  // Re-format if needed (e.g., adding commas for large numbers like 2.4Cr)
  const displayValue = prefix === "₹" && end === 2.4 ? `${prefix}${value}Cr` : `${prefix}${value}${suffix}`;

  return (
    <div ref={ref} className="flex flex-col items-center gap-1 group">
      <span className="text-3xl md:text-5xl font-heading font-bold text-white group-hover:text-accent transition-colors drop-shadow-[0_0_15px_rgba(0,230,118,0.3)]">
        {displayValue}
      </span>
      <span className="text-sm text-text-soft text-center font-medium uppercase tracking-wider">{label}</span>
    </div>
  );
};



const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* ----------------- HERO SECTION ----------------- */}
      <CinematicHero />

      {/* ----------------- STATS BAR ----------------- */}
      <section className="py-12 border-b border-border/30 bg-card/10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="glass-card p-6 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,230,118,0.05)] rounded-2xl">
            <ScrollCounter end={8} suffix="+" label="Supported Types" />
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,230,118,0.05)] rounded-2xl">
            <ScrollCounter end={99} suffix="%" label="AI Precision" />
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,230,118,0.05)] rounded-2xl">
            <ScrollCounter end={3} prefix="~" suffix="s" label="Processing Time" />
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,230,118,0.05)] rounded-2xl">
            <ScrollCounter end={2.4} prefix="₹" decimals={1} label="Valorized Value" />
          </div>
        </div>
      </section>

      {/* ----------------- FEATURES SECTION ----------------- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto w-full">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Core Engine Features</h2>
           <p className="text-text-soft max-w-2xl mx-auto text-lg">Four interconnected systems operating flawlessly to assess your industrial waste stream energy potential.</p>
         </div>

         <div className="grid md:grid-cols-4 gap-6 auto-rows-[300px]">
           {/* Card 1: AI Vision */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="glass-card md:col-span-2 relative overflow-hidden group p-8 flex flex-col justify-between hover:border-accent/40 transition-colors"
           >
             <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 mb-4 z-10">
               <Camera size={28} className="text-accent" />
             </div>
             
             {/* Mini Illustration: Camera scan lines */}
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-full flex flex-col justify-center opacity-30 group-hover:opacity-100 transition-opacity pointer-events-none p-4">
               {[1,2,3,4,5].map(i => (
                 <motion.div key={i} className="h-[2px] bg-accent w-full mb-4" animate={{ x: [-20, 0, -20], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, delay: i*0.2, repeat: Infinity }} />
               ))}
               <div className="absolute inset-0 border-2 border-dashed border-accent/40 rounded-lg m-8"></div>
             </div>
             
             <div className="relative z-10 w-full md:w-3/4">
               <h3 className="text-2xl font-heading font-bold text-white mb-3">Next-Gen Vision Analysis</h3>
               <p className="text-text-soft leading-relaxed text-sm">Upload a photo or track live. Neural networks classify the material type seamlessly and estimate weight dynamically with extreme precision.</p>
             </div>
           </motion.div>

           {/* Card 2: Energy Calculator */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-50px" }}
             transition={{ delay: 0.1 }}
             className="glass-card relative overflow-hidden p-8 flex flex-col hover:border-accent/40 transition-colors"
           >
             <div className="w-12 h-12 bg-amber/10 rounded-xl flex items-center justify-center border border-amber/20 mb-4">
               <Zap size={20} className="text-amber" />
             </div>
             <h3 className="text-xl font-heading font-bold text-white mb-2">Energy Mapping</h3>
             <p className="text-text-soft text-sm mb-4">Calculates exact kWh yields.</p>
             
             {/* Mini bar chart */}
             <div className="mt-auto flex items-end gap-2 h-16 overflow-hidden">
               {[40, 70, 50, 100, 80].map((h, i) => (
                 <motion.div key={i} className="w-full bg-amber/80 rounded-t-sm" initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 1, delay: i*0.1 }} />
               ))}
             </div>
           </motion.div>

           {/* Card 3: CO2 Impact */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="glass-card relative overflow-hidden p-8 hover:border-accent/40 transition-colors flex flex-col"
           >
             <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center border border-teal/20 mb-4 z-10">
               <Globe size={20} className="text-teal" />
             </div>
             <h3 className="text-xl font-heading font-bold text-white mb-2 z-10">Carbon Tracking</h3>
             <p className="text-text-soft text-sm z-10">Measure your offset relative to landfilling.</p>
             
             {/* Animated Progress Ring */}
             <div className="absolute right-4 bottom-4 w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(0,188,212,0.1)" strokeWidth="8" fill="none" />
                  <motion.circle cx="50" cy="50" r="40" stroke="#00BCD4" strokeWidth="8" fill="none" strokeDasharray="251.2"
                    initial={{ strokeDashoffset: 251.2 }} whileInView={{ strokeDashoffset: 60 }} transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-teal text-sm">76%</div>
             </div>
           </motion.div>

           {/* Card 4: Engineering Specs */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className="glass-card md:col-span-4 lg:col-span-2 relative overflow-hidden p-8 flex items-center gap-6 hover:border-accent/40 transition-colors"
           >
             <div className="flex-1 z-10">
               <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 mb-4">
                 <Cpu size={24} className="text-blue-500" />
               </div>
               <h3 className="text-2xl font-heading font-bold text-white mb-2">Process Topologies</h3>
               <p className="text-text-soft leading-relaxed text-sm">Receive engineered data flows directing you to pyrolysis, biogas, mass-burn, or rendering based on complex chemical compositions.</p>
             </div>
             
             {/* Mini flow diagram */}
             <div className="hidden sm:flex items-center justify-center w-1/3 relative h-32 opacity-80">
               <div className="w-10 h-10 border border-blue-500 bg-card rounded-md flex items-center justify-center absolute left-0 text-xs">W</div>
               <motion.div className="h-0.5 bg-blue-500 absolute w-16 left-10" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5 }} />
               <div className="w-12 h-12 border-2 border-blue-500 bg-blue-500/20 rounded-full flex items-center justify-center absolute text-blue-500 z-10">AI</div>
               <motion.div className="h-0.5 bg-blue-500 absolute w-12 right-6 top-8 transform rotate-45" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} />
               <motion.div className="h-0.5 bg-blue-500 absolute w-12 right-6 bottom-8 transform -rotate-45" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} />
               <div className="w-8 h-8 border border-white/20 bg-card rounded absolute right-0 top-2 text-[10px] flex items-center justify-center text-teal">CO2</div>
               <div className="w-8 h-8 border border-white/20 bg-card rounded absolute right-0 bottom-2 text-[10px] flex items-center justify-center text-amber">KWH</div>
             </div>
           </motion.div>
         </div>
      </section>

      {/* ----------------- HOW IT WORKS TIMELINE ----------------- */}
      <section className="py-24 bg-card/20 px-6 border-y border-border/50 overflow-hidden relative">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
         
         <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">Pipeline Execution</h2>
              <p className="text-text-soft text-lg">Four steps from raw waste to actionable marketplace integration.</p>
            </div>
            
            <div className="relative">
               {/* Connecting Line (Horizontal on Desktop, Vertical on Mobile) */}
               <motion.div 
                 initial={{ width: 0 }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 viewport={{ once: true }}
                 className="hidden md:block absolute top-[36px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-accent/10 via-accent/60 to-accent/10 origin-left" 
               />
               
               <div className="md:hidden absolute top-0 bottom-0 left-[39px] w-[2px] bg-gradient-to-b from-accent/10 via-accent/50 to-accent/10" />

               <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-4 relative z-10">
                 {[
                   { id: 1, icon: <Camera size={28} />, title: "Capture Photo", desc: "Upload or use the live scanner API." },
                   { id: 2, icon: <BrainCircuit size={28} />, title: "Claude AI", desc: "Anthropic vision classifies material structure." },
                   { id: 3, icon: <Zap size={28} />, title: "Energy Compute", desc: "Thermodynamics calculate exact kWh equivalents." },
                   { id: 4, icon: <Store size={28} />, title: "Market Link", desc: "Connect with verified buyers for your waste type." },
                 ].map((step, idx) => (
                   <motion.div 
                     key={step.id} 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     transition={{ delay: idx * 0.2 }}
                     viewport={{ once: true }}
                     className="flex flex-row md:flex-col items-center flex-1 text-left md:text-center gap-6 md:gap-4 group relative"
                   >
                      <div className="w-[80px] h-[80px] shrink-0 rounded-full border-2 border-accent bg-bg-primary flex items-center justify-center text-accent shadow-[0_0_15px_rgba(0,230,118,0.1)] group-hover:shadow-[0_0_30px_rgba(0,230,118,0.4)] group-hover:scale-110 transition-all font-bold text-2xl relative z-20">
                         {step.icon}
                      </div>
                      
                      <div className="flex-1 mt-0 md:mt-4">
                         <h4 className="text-xl text-white font-heading font-bold mb-2 group-hover:text-accent transition-colors">{step.title}</h4>
                         <p className="text-sm text-text-soft leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
                      </div>
                   </motion.div>
                 ))}
               </div>
            </div>
         </div>
      </section>

      {/* ----------------- SUPPORTED CATEGORIES (SCROLLABLE ROW) ----------------- */}
      <section className="py-20 px-6 max-w-[100vw] overflow-hidden">
        <div className="max-w-7xl mx-auto mb-10 text-center">
           <span className="bg-accent/10 border border-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
             Over 15 categories detected
           </span>
           <h2 className="text-2xl mt-4 font-heading font-bold text-white">Supported Waste Streams</h2>
        </div>
        
        <div className="flex overflow-x-auto pb-8 pt-4 gap-4 px-6 md:px-12 custom-scrollbar mask-edges">
           {WASTE_TYPES.map((waste, i) => (
             <motion.div 
               key={waste.id}
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="min-w-[200px] bg-card border border-border/50 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-accent hover:shadow-[0_0_20px_rgba(0,230,118,0.2)] transition-all group shrink-0 relative py-8"
             >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{waste.icon}</div>
                <h4 className="text-white font-bold text-sm mb-1">{waste.name}</h4>
                <p className="text-xs text-text-soft">{waste.category}</p>
                
                {/* Hover Tooltip equivalent directly in card */}
                <div className="absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity bg-accent/10 text-accent text-[10px] font-bold px-2 py-1 rounded w-[90%] mx-auto">
                  Yield: {waste.kwhPerKg} kWh/kg
                </div>
             </motion.div>
           ))}
        </div>
      </section>

      {/* ----------------- LIVE IMPACT COUNTER ----------------- */}
      <section className="py-16 bg-[#03150A] border-y border-accent/20 relative overflow-hidden">
         {/* Particles */}
         <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,230,118,0.2)_1px,transparent_1px)] [background-size:40px_40px] opacity-40" />

         <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-center gap-12">
            
            <div className="max-w-md text-left text-center md:text-left">
               <h2 className="text-3xl font-heading font-bold text-white mb-2">Live Across India</h2>
               <p className="text-accent/80 text-sm tracking-wide">Real-time valorization metrics updating dynamically.</p>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
               <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-border/30 pb-6 sm:pb-0">
                  <span className="text-4xl md:text-5xl font-heading font-bold text-white tracking-widest drop-shadow-[0_0_10px_#00E676]">2,847</span>
                  <span className="text-text-soft text-xs uppercase font-semibold mt-2">kg Analyzed Today</span>
               </div>
               <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-border/30 pb-6 sm:pb-0">
                  <span className="text-4xl md:text-5xl font-heading font-bold text-white tracking-widest drop-shadow-[0_0_10px_#00BCD4] text-teal">1,203</span>
                  <span className="text-text-soft text-xs uppercase font-semibold mt-2">kWh Recovered</span>
               </div>
               <div className="flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-heading font-bold text-white tracking-widest drop-shadow-[0_0_10px_#FFC107] text-amber">₹84K+</span>
                  <span className="text-text-soft text-xs uppercase font-semibold mt-2">Market Value</span>
               </div>
            </div>
         </div>
      </section>

      {/* ----------------- FOOTER CTA ----------------- */}
      <section className="py-24 px-6 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 pointer-events-none" />
         
         <div className="max-w-3xl mx-auto text-center glass-card relative p-12 overflow-hidden border-accent/20 border-b-0 shadow-[0_0_50px_rgba(0,230,118,0.1)] rounded-[2rem]">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[60px]" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal/20 rounded-full blur-[60px]" />
            
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 relative z-10">Ready to valorize?</h2>
            <p className="text-text-soft mb-8 text-lg max-w-xl mx-auto relative z-10">Connect industrial waste to high-yield energy buyers in less than 30 seconds.</p>
            
            <button 
              onClick={() => navigate('/analyze')}
              className="btn-primary flex items-center justify-center gap-2 mx-auto px-10 py-5 text-xl font-bold shadow-button-glow hover:shadow-[0_0_50px_rgba(0,230,118,0.5)] transition-all relative z-10"
            >
              Start Free Scan <ArrowRight size={24} />
            </button>
         </div>
      </section>

    </div>
  );
};

export default HomePage;
