import React from 'react';
import { motion } from 'framer-motion';
import { Car, Smartphone, TreePine, Flame } from 'lucide-react';

const CO2Impact = ({ co2Saved }) => {
  
  // Real world equivalents
  const kmNotDriven = (co2Saved / 0.192).toFixed(1); // avg car emits ~192g CO2/km
  const phonesCharged = (co2Saved / 0.008).toFixed(0); // ~8g per charge
  const treesPlanted = (co2Saved / 21).toFixed(1); // 21kg absorbed per tree per year
  const coalNotBurned = (co2Saved / 2.86).toFixed(1); // ~2.86kg CO2 per kg coal

  const impacts = [
    { icon: Car, val: kmNotDriven, label: 'km not driven', color: 'text-blue-400' },
    { icon: Smartphone, val: phonesCharged, label: 'phones charged', color: 'text-purple-400' },
    { icon: TreePine, val: treesPlanted, label: 'trees planted (1yr)', color: 'text-green-400' },
    { icon: Flame, val: coalNotBurned, label: 'kg coal saved', color: 'text-gray-400' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {impacts.map((imp, idx) => (
        <motion.div 
           key={idx}
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.6 + (idx * 0.1) }}
           className="bg-primary/50 rounded-xl p-4 border border-border text-center"
        >
          <div className={`mx-auto w-10 h-10 rounded-full bg-card flex items-center justify-center mb-3 ${imp.color}`}>
            <imp.icon size={20} />
          </div>
          <div className="text-xl font-bold text-white mb-1">{imp.val}</div>
          <div className="text-xs text-text-soft leading-tight">{imp.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default CO2Impact;
