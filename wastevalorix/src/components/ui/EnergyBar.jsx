import React from 'react';
import { motion } from 'framer-motion';

const EnergyBar = ({ label, percentage, color = '#00E676' }) => {
  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        <span className="text-xs text-text-soft">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-card rounded-full overflow-hidden border border-border">
        <motion.div 
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  );
};

export default EnergyBar;
