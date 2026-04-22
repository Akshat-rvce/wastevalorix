import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MetricCard = ({ title, value, unit, icon: Icon, color = '#00E676', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const isNumber = !isNaN(numericValue);

  useEffect(() => {
    if (!isNumber) return;
    
    let start = 0;
    const duration = 1500;
    const increment = numericValue / (duration / 16); // 60fps
    
    const countUp = () => {
      start += increment;
      if (start < numericValue) {
        setDisplayValue(start);
        requestAnimationFrame(countUp);
      } else {
        setDisplayValue(numericValue);
      }
    };
    
    // allow initial mount animation first
    setTimeout(() => {
      requestAnimationFrame(countUp);
    }, 300);
    
  }, [numericValue, isNumber]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.4 }}
      className="glass-card p-5 flex flex-col justify-between"
      style={{ borderTop: `2px solid ${color}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-text-soft text-sm font-medium">{title}</span>
        {Icon && <Icon size={20} style={{ color }} />}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-heading font-bold text-white tracking-tight">
          {isNumber ? (displayValue % 1 !== 0 ? displayValue.toFixed(1) : Math.round(displayValue)) : value}
        </span>
        <span className="text-text-muted text-sm font-medium">{unit}</span>
      </div>
    </motion.div>
  );
};

export default MetricCard;
