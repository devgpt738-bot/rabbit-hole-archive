import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TheoryCard({ theory, index, onClick }) {
  const { bookmarks, toggleBookmark } = useAuth();
  const isBookmarked = bookmarks?.has(theory.id);

  const handleBookmark = (e) => {
    e.stopPropagation();
    if (toggleBookmark) {
      toggleBookmark(theory.id, !isBookmarked);
    }
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative flex flex-col justify-between p-4 sm:p-6 min-h-[200px] sm:min-h-[260px]
        bg-obsidian-900/40 backdrop-blur-[30px] border border-white/10
        rounded-[20px] sm:rounded-[32px] cursor-pointer overflow-hidden
        shadow-bubble hover:shadow-glass-active hover:border-white/20 transition-all duration-300"
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-active-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Top Header */}
      <div className="relative flex justify-between items-start mb-6">
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {theory.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-xs font-sans tracking-wider uppercase bg-white/5 border border-white/10 rounded-full text-white/70 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              {tag}
            </span>
          ))}
        </div>
        <button 
          onClick={handleBookmark}
          className={`z-10 transition-colors ${isBookmarked ? 'text-crimson-neon' : 'text-white/30 hover:text-white/80'}`}
        >
          <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="relative flex-1 min-w-0">
        <h3 className="font-display text-sm sm:text-xl text-white font-bold leading-tight mb-2 sm:mb-3 group-hover:text-crimson-neon transition-colors line-clamp-2 break-words hyphens-auto">
          {theory.title}
        </h3>
        <p className="font-sans text-[11px] sm:text-sm text-white/50 leading-relaxed line-clamp-3 break-words hyphens-auto">
          {theory.description}
        </p>
      </div>

      {/* Footer */}
      <div className="relative mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-white/40 font-sans tracking-wide uppercase">
          <Clock size={12} className="sm:w-3.5 sm:h-3.5" />
          {theory.readTime}
        </div>
      </div>
    </motion.div>
  );
}
