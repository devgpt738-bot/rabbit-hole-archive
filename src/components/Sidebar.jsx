import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data';
import { ChevronLeft } from 'lucide-react';
import appLogo from '../assets/logo.png';

export default function Sidebar({ activeCategory, setActiveCategory, isSidebarOpen, setIsSidebarOpen }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && isMobile && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 z-40"
        />
      )}

      {/* Sidebar Panel */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isSidebarOpen ? 0 : -320,
          marginLeft: isMobile ? 0 : (isSidebarOpen ? 0 : -260)
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed md:relative top-0 left-0 h-[100dvh] w-[260px] z-50 flex flex-col
          bg-black/40 backdrop-blur-[20px] border-r border-white/20
          shadow-[20px_0_50px_rgba(0,0,0,0.7),inset_0_0_20px_rgba(255,255,255,0.05),inset_1px_1px_3px_rgba(255,255,255,0.3)]
          rounded-r-[40px] shrink-0`}
      >
        <div className="pt-6 px-6 pb-4 flex items-center justify-between min-h-[80px]">
          <Link to="/" className="flex items-center transition-transform hover:scale-105">
            {isSidebarOpen && (
              <motion.img layoutId="app-logo" src={appLogo} alt="Logo" className="w-[90px] -ml-2 drop-shadow-[0_0_15px_rgba(163,38,56,0.5)]" />
            )}
          </Link>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="w-10 h-10 mt-3 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] shrink-0"
            title="Close Sidebar"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-8 mt-4 space-y-2 custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-[24px] transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-crimson-700/30 to-transparent border border-crimson-600/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]' 
                    : 'hover:bg-white/5 border border-transparent'}
                `}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'text-crimson-neon' : 'text-white/40'}`} />
                <span className={`font-sans tracking-wide text-sm ${isActive ? 'text-white font-semibold' : 'text-white/60'}`}>
                  {cat.name}
                </span>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-8 bg-crimson-neon rounded-r-full shadow-[0_0_10px_#ff4d64]" />
                )}
              </button>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
