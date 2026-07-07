import React from 'react';
import { motion } from 'framer-motion';
import Badge from './Badge';

const WasteTypeCard = ({ waste, selected, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(waste.id)}
      className={`relative cursor-pointer transition-all duration-300 rounded-cards overflow-hidden p-4 ${
        selected 
          ? 'bg-accent/10 border-2 border-accent shadow-button-glow' 
          : 'glass-card'
      }`}
    >
      {selected && (
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
      )}
      
      <div className="flex items-start gap-4 reltive z-10">
        <div className="text-4xl filter drop-shadow-lg p-2 bg-black/20 rounded-xl">
          {waste.icon}
        </div>
        
        <div className="flex-1">
          <h3 className="font-heading font-bold text-white text-lg leading-tight mb-1">
            {waste.name}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant={waste.category.toLowerCase()}>
              {waste.category}
            </Badge>
          </div>
          <p className="text-accent font-medium text-sm flex items-center gap-1">
            ⚡ {waste.kwhPerKg} kWh/kg
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default WasteTypeCard;
