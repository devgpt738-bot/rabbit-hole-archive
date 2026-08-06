import React, { useState } from 'react';
import { Menu, Search, User, Bell, ChevronRight, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data';
import { useAuth } from '../context/AuthContext';
import appLogo from '../assets/logo.png';

export default function Header({ setIsSidebarOpen, activeCategory, isSidebarOpen, searchQuery, setSearchQuery, onProfileClick }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  // Auth state
  const { user, otpLogin } = useAuth();
  
  // OTP Flow state
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState(''); // 'instagram' | 'telegram'
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [authError, setAuthError] = useState('');

  const handleOtpFlow = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (step === 2) {
        if (!identifier) return setAuthError('Enter your ID');
        setStep(3);
      } else if (step === 3) {
        if (otp.length < 4) return setAuthError('Invalid OTP');
        setStep(4);
      } else if (step === 4) {
        if (!username) return setAuthError('Enter a unique username');
        await otpLogin(identifier, provider, username);
        setShowLogin(false);
        setStep(1);
      }
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Authentication failed');
    }
  };
  
  const categoryName = activeCategory === 'all' ? 'Global Discovery' : CATEGORIES.find(c => c.id === activeCategory)?.name;

  return (
    <>
      <header className="h-[90px] flex items-center justify-between px-3 sm:px-6 md:px-12 bg-obsidian-900/30 backdrop-blur-[40px] border-b border-white/10 shrink-0 z-20">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <Link to="/" className="flex items-center justify-center -ml-5 sm:-ml-10 shrink-0 -mt-3 sm:-mt-5">
            <motion.img layoutId="app-logo" src={appLogo} alt="Logo" className="w-[70px] sm:w-[90px] drop-shadow-[0_0_15px_rgba(163,38,56,0.5)]" />
          </Link>
        )}

        {!isSidebarOpen && (
          <button 
            className="text-white/80 p-2 hover:bg-white/10 rounded-full transition-colors flex shrink-0 -ml-2 sm:-ml-4"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        )}
        
        <div className="hidden md:flex items-center gap-3 text-sm font-sans tracking-widest text-white/50 uppercase">
          <span>Core</span>
          <span className="text-white/20">/</span>
          <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] font-semibold">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-1 justify-end ml-2 sm:ml-4">

        {/* Glass Search Pill */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-2 sm:py-2.5
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] hover:bg-white/10 hover:border-white/20 transition-all cursor-text group flex-1 max-w-[300px] min-w-0">
          <Search size={16} className="text-white/50 group-hover:text-white transition-colors shrink-0" />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white text-xs sm:text-sm font-sans placeholder-white/30 w-full"
          />
          <div className="hidden md:flex items-center gap-1 text-[10px] text-white/30 bg-black/40 px-2 py-1 rounded-md">
            <span>Ctrl</span><span>K</span>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-white/50 hover:text-white transition-colors"
          >
            <Bell size={20} />
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-4 w-72 bg-obsidian-800/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50"
              >
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3 border-b border-white/10 pb-2">Notifications</h4>
                <div className="flex items-center justify-center py-4">
                  <p className="text-sm font-sans text-white/40">
                    No new notifications
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end cursor-pointer" onClick={onProfileClick}>
              <span className="text-white text-sm font-bold font-display">{user.username}</span>
              <span className="text-crimson-neon text-xs font-bold tracking-widest uppercase">Score: {user.score}</span>
            </div>
            <button 
              onClick={onProfileClick}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-crimson-neon hover:border-white transition-colors shrink-0 flex items-center justify-center bg-obsidian-800"
              title="Profile"
            >
              <User size={16} className="text-crimson-neon" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLogin(true)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 hover:border-white/50 transition-colors shrink-0"
          >
            <div className="w-full h-full bg-gradient-to-tr from-crimson-800 to-obsidian-800 flex items-center justify-center">
              <User size={16} className="text-white/80" />
            </div>
          </button>
        )}
      </div>
    </header>

    {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm p-8 bg-obsidian-900/80 backdrop-blur-3xl border border-white/20 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] text-center"
            >
              <button 
                onClick={() => setShowLogin(false)}
                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-white/10 to-transparent rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                <Lock size={28} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-display font-bold text-white mb-3">
                User Registration Locked
              </h3>
              <p className="text-sm text-white/60 mb-6 leading-relaxed font-sans">
                The user account and sign-up features are currently offline for maintenance. Access will be opening soon.
              </p>

              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 font-bold uppercase tracking-widest text-sm">Coming Soon</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
