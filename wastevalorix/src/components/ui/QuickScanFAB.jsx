import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Focus, Crosshair } from 'lucide-react';

const QuickScanFAB = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show FAB on Analyze page or Results page where scanning is already prominent
  if (location.pathname === '/analyze' || location.pathname === '/results') return null;

  return (
    <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-50">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-card border border-border px-4 py-2 rounded-xl shadow-lg whitespace-nowrap text-sm font-bold text-white flex items-center gap-2"
          >
            <Crosshair size={16} className="text-accent" /> Quick Scan
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/analyze')}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-accent text-bg-primary rounded-full shadow-[0_0_20px_rgba(0,230,118,0.4)] hover:shadow-[0_0_30px_rgba(0,230,118,0.6)] focus:outline-none"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-bg-primary/30 rounded-full group-hover:border-bg-primary/50"
        />
        <Focus size={28} className="md:w-8 md:h-8" />
        <Camera size={14} className="absolute bottom-3 right-3 text-bg-primary/80" />
      </motion.button>
    </div>
  );
};

export default QuickScanFAB;
