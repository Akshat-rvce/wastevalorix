import React from 'react';

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-card border-border text-text-primary',
    organic: 'bg-green-900/40 border-green-500/30 text-green-400',
    synthetic: 'bg-blue-900/40 border-blue-500/30 text-blue-400',
    inorganic: 'bg-slate-800 border-slate-500/30 text-slate-300',
    lignocellulosic: 'bg-amber-900/40 border-amber-500/30 text-amber-400',
    mixed: 'bg-orange-900/40 border-orange-500/30 text-orange-400',
    accent: 'bg-accent/10 border-accent/30 text-accent',
  };

  const selectedVariant = variants[variant] || variants.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedVariant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
