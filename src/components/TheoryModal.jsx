import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ChevronRight, CheckCircle2, Share2, ShieldAlert, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TheoryModal({ theory, onClose, onScoreIncrease }) {
  const [readComplete, setReadComplete] = useState(false);
  const { markAsRead, readHistory } = useAuth();

  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!theory) {
      setReadComplete(false);
      return;
    }

    // 5 second timer for testing (can revert to 40 later)
    const timer = setTimeout(() => {
      setReadComplete(true);
      if (theory?.id && markAsRead) {
        markAsRead(theory.id);
      }
      if (onScoreIncrease) onScoreIncrease();
    }, 5000);

    return () => clearTimeout(timer);
  }, [theory, onScoreIncrease]);

  if (!theory) return null;

  return (
    <AnimatePresence>
      {/* Transparent Full-Screen Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/50 overflow-y-auto custom-scrollbar flex flex-col items-center p-4 md:p-12"
      >
        <div className="min-h-[100dvh] w-full flex flex-col items-center pt-8 pb-32">
          {/* Story Container (No fixed background, just floating text) */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.2 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="relative w-full max-w-4xl flex flex-col"
          >
            {/* Close Button floating top right */}
            <button
              onClick={onClose}
              className="fixed right-6 top-6 w-12 h-12 rounded-full flex items-center justify-center 
                bg-white/5 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 
                hover:border-white/50 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] 
                transition-all duration-300 z-[110] backdrop-blur-md"
            >
              <X size={24} />
            </button>

            {/* Header Text */}
            <div className="mb-12">
              <div className="flex flex-wrap gap-2 mb-6">
                {theory.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-sans tracking-wider uppercase bg-white/5 border border-white/10 rounded-full text-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white/90 font-bold leading-snug drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] py-2 break-words">
                {theory.title}
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-crimson-neon to-transparent mt-8 mb-4 rounded-full shadow-[0_0_20px_#ff4d64]"></div>
            </div>

          {/* Story Content Region */}
          <div className="relative z-10 w-full">
            {/* Reading Progress Indicator */}
            {(readComplete || readHistory?.has(theory.id)) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-10 flex items-center gap-3 text-crimson-neon font-display font-bold tracking-widest uppercase bg-crimson-900/30 backdrop-blur-md inline-flex px-6 py-3 rounded-full border border-crimson-neon/40 shadow-[0_0_20px_rgba(255,77,100,0.3)]"
              >
                <CheckCircle2 size={18} /> Data Assimilated (+10 Score)
              </motion.div>
            )}
            <div className="prose prose-invert max-w-none">
              {theory.content ? (
                // Split by double newline to render paragraphs
                theory.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className={`font-serif text-xl md:text-2xl text-white/90 leading-relaxed mb-8 tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
                    ${idx === 0 ? 'first-letter:text-5xl md:first-letter:text-6xl first-letter:font-display first-letter:text-crimson-neon first-letter:float-left first-letter:mr-3 md:first-letter:mr-4 first-letter:-mt-1 first-letter:drop-shadow-[0_0_20px_rgba(255,77,100,0.8)] first-line:tracking-widest first-line:text-white' : ''}`}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="font-serif text-lg text-white/70 leading-relaxed italic text-center opacity-50 mt-10">
                  No deeply classified data available for this anomaly yet.
                </p>
              )}
            </div>
            <div className="mt-16 flex items-center gap-6 text-sm text-white/50 font-display font-bold tracking-widest uppercase">
              <span className="flex items-center gap-2 text-white/70">
                <Clock size={18} />
                {theory.readTime}
              </span>
            </div>
          </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
