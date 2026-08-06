import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X, RefreshCw } from 'lucide-react';

const FEATURED = [
  {
    title: "The Chronos Paradigm",
    desc: "Declassified documents reveal a subterranean temporal engine discovered beneath the Antarctic ice shelf in 1964. The implications challenge our fundamental understanding of linear time."
  },
  {
    title: "Project Blue Beam",
    desc: "A massive, multi-stage covert operation aimed at staging an artificial Second Coming to establish a New World Order using advanced holographic projections."
  },
  {
    title: "The Agartha Network",
    desc: "Expedition logs from Admiral Richard E. Byrd describe a massive hollow earth civilization accessed via the polar openings, complete with its own internal sun."
  }
];

export default function HeroCard({ onDismiss }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCycle = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % FEATURED.length);
  };

  const handleDismiss = (e) => {
    e.stopPropagation();
    if (onDismiss) onDismiss();
  };

  const current = FEATURED[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      whileHover={{ y: -5, scale: 1.01 }}
      className="relative w-full rounded-[40px] overflow-hidden group cursor-pointer
        border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.2)]"
    >
      {/* Background Image / Gradient for Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-crimson-900 via-obsidian-900 to-black z-0">
        <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_10s_infinite]"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-crimson-600/20 blur-[100px] rounded-full mix-blend-screen transform translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:bg-crimson-neon/20 transition-all duration-700"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-10 md:p-16 flex flex-col items-start justify-between min-h-[300px] md:min-h-[400px]">
        
        {/* Top Right Controls */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 sm:gap-3 z-20">
          <button 
            onClick={handleCycle}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/40 flex items-center justify-center text-white/50 hover:text-white transition-all shadow-glass"
          >
            <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button 
            onClick={handleDismiss}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-crimson-600/40 border border-white/10 hover:border-crimson-neon flex items-center justify-center text-white/50 hover:text-white transition-all shadow-glass"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        <div className="max-w-2xl mt-12 sm:mt-0 relative z-10 w-full min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="px-3 py-1 sm:px-4 sm:py-1.5 text-[10px] sm:text-xs font-sans font-bold tracking-widest uppercase bg-crimson-neon text-black rounded-full shadow-[0_0_15px_#ff4d64]">
              Featured Anomaly
            </span>
            <span className="flex items-center gap-1 text-[10px] sm:text-xs font-sans text-white/50 uppercase tracking-widest">
              <Sparkles size={12} className="sm:w-3.5 sm:h-3.5 text-gold" /> Epic Tier
            </span>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full min-w-0"
            >
              <h1 className="font-display text-2xl sm:text-4xl md:text-6xl text-white font-bold leading-tight sm:leading-none mb-3 sm:mb-6 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] break-words hyphens-auto overflow-wrap-anywhere pr-2 sm:pr-0">
                {current.title}
              </h1>
              
              <p className="font-sans text-xs sm:text-lg text-white/70 leading-relaxed max-w-xl mb-6 sm:mb-8 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)] break-words hyphens-auto pr-2 sm:pr-0">
                {current.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          <button className="flex items-center gap-2 sm:gap-3 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-black font-sans font-bold tracking-wider uppercase text-[10px] sm:text-sm rounded-full
            shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] hover:scale-105 transition-all duration-300">
            Access Archive <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
