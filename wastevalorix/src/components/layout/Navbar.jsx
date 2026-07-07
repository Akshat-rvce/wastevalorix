import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, Home, Settings2, Clock, Info, Store, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/analyze', label: 'Analyze', icon: Settings2 },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/marketplace', label: 'Market', icon: Store },
  { path: '/methodology', label: '🔬 How It Works', icon: Microscope },
  { path: '/about', label: 'About', icon: Info }
];

const Navbar = () => {
  return (
    <header className="hidden md:block sticky top-0 z-40 bg-primary/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-2">
          <div className="bg-accent/10 p-1.5 rounded-lg border border-accent/20">
            <Zap size={24} className="text-accent fill-accent/20" />
          </div>
          <h1 className="font-heading text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Waste<span className="text-gradient">Valorix</span>
          </h1>
          <span className="ml-4 text-xs font-medium text-text-soft bg-card px-2 py-1 rounded-full border border-border">
            RVCE EEE
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isActive ? 'text-accent' : 'text-text-soft hover:text-white hover:bg-card z-10'
                  }`
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-2 relative z-10">
                    <Icon size={16} />
                    {link.label}
                    {isActive && (
                       <motion.div 
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-accent/10 rounded-full border border-accent/20 -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                       />
                    )}
                  </div>
                )}
              </NavLink>
            )
          })}
        </nav>
        
      </div>
    </header>
  );
};

export default Navbar;
