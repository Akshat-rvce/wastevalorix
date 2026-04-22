import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings2, Clock, Info, Store } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/analyze', label: 'Analyze', icon: Settings2 },
  { path: '/history', label: 'History', icon: Clock },
  { path: '/marketplace', label: 'Market', icon: Store },
  { path: '/about', label: 'About', icon: Info }
];

const BottomNav = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-[72px] pb-safe">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative ${
                  isActive ? 'text-accent' : 'text-text-soft hover:text-text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} className={isActive ? "fill-accent/10 drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]" : ""} />
                  <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-bold' : ''}`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <div className="absolute -top-[1.5px] w-8 h-[3px] bg-accent rounded-b-full shadow-[0_2px_10px_#00E676]" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
