import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Clock, ScrollText, LogOut, Bookmark, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { THEORIES } from '../data';
import TheoryCard from './TheoryCard';

export default function UserProfile({ onClose }) {
  const { user, logout, bookmarks } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${s}s`;
  };

  // Find bookmarked theories
  const bookmarkedTheories = THEORIES.filter(t => bookmarks?.has(t.id));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-full flex flex-col bg-obsidian-900/90 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/5 shrink-0 bg-gradient-to-r from-obsidian-800 to-transparent">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-crimson-900/40 border border-crimson-neon/50 flex items-center justify-center">
                <User className="text-crimson-neon" size={24} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide">
                  Agent <span className="text-crimson-neon">{user.username}</span>
                </h2>
                <div className="text-xs text-white/50 font-sans tracking-widest uppercase mt-1">
                  Provider: {user.auth_provider || 'Manual'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-crimson-neon hover:text-crimson-neon text-white/60 transition-colors font-bold text-sm tracking-wider uppercase"
              >
                <LogOut size={16} /> Disconnect
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              
              {/* Stat Card 1 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity size={80} />
                </div>
                <div className="text-crimson-neon mb-2"><Activity size={24} /></div>
                <div className="text-4xl font-display font-bold text-white mb-1">{user.score}</div>
                <div className="text-xs font-sans text-white/50 uppercase tracking-widest">Total Archive Score</div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <ScrollText size={80} />
                </div>
                <div className="text-white/80 mb-2"><ScrollText size={24} /></div>
                <div className="text-4xl font-display font-bold text-white mb-1">{formatTime(user.reading_time_seconds)}</div>
                <div className="text-xs font-sans text-white/50 uppercase tracking-widest">Deep Reading Time</div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Clock size={80} />
                </div>
                <div className="text-white/50 mb-2"><Clock size={24} /></div>
                <div className="text-4xl font-display font-bold text-white mb-1">{formatTime(user.scrolling_time_seconds)}</div>
                <div className="text-xs font-sans text-white/50 uppercase tracking-widest">Scrolling Time</div>
              </div>

            </div>

            <div className="mb-6 flex items-center gap-3">
              <Bookmark className="text-crimson-neon" size={20} />
              <h3 className="text-xl font-display font-bold text-white tracking-wide">Saved Archives</h3>
              <div className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-white/10 to-transparent"></div>
            </div>

            {bookmarkedTheories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {bookmarkedTheories.map((theory, index) => (
                  <TheoryCard 
                    key={theory.id} 
                    theory={theory} 
                    index={index} 
                    onClick={() => {
                       // We could navigate to the theory or open modal here. 
                       // For simplicity, we just trigger the dash to handle it, but wait, the dash handles the modal.
                       // We can just show them visually, or trigger an event.
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5">
                <Bookmark className="mx-auto text-white/20 mb-4" size={48} />
                <p className="text-white/40 font-sans tracking-wide">No archives bookmarked yet.</p>
              </div>
            )}
          </div>
          
          {/* Mobile Logout Button */}
          <div className="sm:hidden p-6 border-t border-white/5 shrink-0">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-900/20 rounded-xl border border-red-500/30 hover:bg-red-900/40 text-red-400 transition-colors font-bold text-sm tracking-wider uppercase"
            >
              <LogOut size={16} /> Disconnect Account
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
