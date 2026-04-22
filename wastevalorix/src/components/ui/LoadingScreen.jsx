import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Recycle } from 'lucide-react';

const messages = [
  "Scanning waste characteristics...",
  "Calculating energy potential...",
  "Analyzing conversion methods...",
  "Estimating CO₂ impact...",
  "Preparing your report..."
];

const LoadingScreen = ({ inline = false }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const layoutClasses = inline 
    ? "w-full h-64 flex flex-col items-center justify-center" 
    : "fixed inset-0 z-50 bg-primary/95 backdrop-blur-md flex flex-col items-center justify-center";

  return (
    <div className={layoutClasses}>
      <div className="relative flex items-center justify-center w-32 h-32 mb-8 border border-accent/30 rounded-full bg-accent/5 overflow-hidden shadow-[0_0_30px_rgba(0,230,118,0.2)]">
        {/* Radar Crosshairs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-0 w-full h-px bg-accent/20" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-accent/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-accent/20" />
        </div>

        {/* Radar Sweep */}
        <motion.div 
          className="absolute top-0 right-0 w-[50%] h-[50%] origin-bottom-left bg-gradient-to-tr from-accent/0 via-accent/20 to-accent/80 z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0% 100%" }}
        />
        
        <div className="text-accent relative z-20 bg-primary/80 p-2 rounded-full border border-accent/30">
          <Recycle size={32} strokeWidth={2} />
        </div>
      </div>

      <motion.p
        key={msgIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-lg text-text-primary mb-6 font-medium text-center px-4"
      >
        {messages[msgIndex]}
      </motion.p>
      
      {!inline && (
        <div className="w-64 h-2 bg-card rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
