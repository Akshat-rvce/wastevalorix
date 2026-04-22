import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

const RecommendationCard = ({ tips, fact }) => {
  if (!tips || !tips.length) return null;

  return (
    <div className="space-y-4 mt-6">
      <div className="space-y-3">
        {tips.map((tip, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + (idx * 0.1) }}
            className="flex items-start gap-3 bg-primary/40 p-4 rounded-xl border border-border"
          >
             <ArrowRight size={18} className="text-accent mt-0.5 flex-shrink-0" />
             <p className="text-sm text-text-primary leading-relaxed">{tip}</p>
          </motion.div>
        ))}
      </div>

      {fact && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 bg-amber-900/20 border border-amber-500/30 rounded-xl p-5 flex items-start gap-4"
        >
           <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500 flex-shrink-0">
             <Lightbulb size={24} />
           </div>
           <div>
             <h4 className="font-heading font-semibold text-amber-400 mb-1">Did You Know?</h4>
             <p className="text-sm text-amber-100/80 leading-relaxed">{fact}</p>
           </div>
        </motion.div>
      )}
    </div>
  );
};

export default RecommendationCard;
