import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import HeroCard from '../components/HeroCard';
import TheoryCard from '../components/TheoryCard';
import TheoryModal from '../components/TheoryModal';
import UserProfile from '../components/UserProfile';
import { THEORIES, CATEGORIES } from '../data';
import { useAuth } from '../context/AuthContext';
import bgVideo from '../assets/da.mp4';

export default function Dashboard({ onOpenSearch }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTheory, setSelectedTheory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userScore, setUserScore] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isHeroDismissed, setIsHeroDismissed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const videoRef = useRef(null);
  const mainRef = useRef(null);
  const { syncTime, user } = useAuth();
  
  // Time tracking refs
  const timeRef = useRef({ scrollingDelta: 0, readingDelta: 0 });

  // Play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Video play failed:", e));
    }
  }, []);

  // Background Time Tracking Engine
  useEffect(() => {
    if (!user) return; // Only track for logged in users

    const interval = setInterval(() => {
      // 1 second passed
      if (selectedTheory) {
        timeRef.current.readingDelta += 1;
      } else {
        timeRef.current.scrollingDelta += 1;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTheory, user]);

  // Telemetry Sync Engine (every 10 seconds)
  useEffect(() => {
    if (!user) return;

    const syncInterval = setInterval(() => {
      const { scrollingDelta, readingDelta } = timeRef.current;
      if (scrollingDelta > 0 || readingDelta > 0) {
        syncTime(scrollingDelta, readingDelta);
        timeRef.current = { scrollingDelta: 0, readingDelta: 0 }; // Reset after sync
      }
    }, 10000);

    return () => clearInterval(syncInterval);
  }, [user, syncTime]);

  // Automatically adjust sidebar open state when crossing the mobile breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaChange = (e) => {
      setIsSidebarOpen(!e.matches);
    };
    
    // Add listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, []);

  // Scroll to top when category changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeCategory]);

  const filteredTheories = THEORIES.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex font-sans text-white">
      
      {/* Immersive Background Environment */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.video 
          ref={videoRef}
          src={bgVideo} 
          autoPlay 
          loop 
          muted 
          playsInline
          animate={{ filter: selectedTheory ? 'blur(12px)' : 'blur(4px)' }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover scale-110 opacity-60"
        />
        {/* Ambient Dark Red Fog Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(163,38,56,0.15)_0%,rgba(0,0,0,0.8)_100%)]"></div>
        {/* Animated Noise Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[pulse_8s_infinite]"></div>
      </div>

      {/* Cinematic Layout */}
      <motion.div 
        animate={{ 
          opacity: selectedTheory ? 0 : 1, 
          filter: selectedTheory ? 'blur(10px)' : 'blur(0px)',
          scale: selectedTheory ? 0.95 : 1
        }}
        transition={{ duration: 0.6 }}
        className={`relative z-10 flex w-full h-full max-w-[1920px] mx-auto bg-black/20 ${selectedTheory ? 'pointer-events-none' : ''}`}
      >
        
        <Sidebar 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <Header 
            setIsSidebarOpen={setIsSidebarOpen} 
            activeCategory={activeCategory} 
            isSidebarOpen={isSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onProfileClick={() => setShowProfile(true)}
          />

          {/* Main Discovery Feed */}
          <main ref={mainRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-12 space-y-12 scroll-smooth">
            
            {activeCategory === 'all' && !searchQuery && !isHeroDismissed && (
              <HeroCard onDismiss={() => setIsHeroDismissed(true)} onSelect={(theory) => setSelectedTheory(theory)} />
            )}

              {/* Main Feed Content */}
              {activeCategory === 'all' && !searchQuery ? (
                // Grouped by Category View
                <div className="space-y-16">
                  {CATEGORIES.filter(c => c.id !== 'all').map(category => {
                    const categoryTheories = THEORIES.filter(t => t.category === category.id);
                    if (categoryTheories.length === 0) return null;

                    const CategoryIcon = category.icon;

                    return (
                      <div key={category.id} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-crimson-900/30 border border-crimson-600/30 flex items-center justify-center text-crimson-neon shadow-[0_0_15px_rgba(255,77,100,0.2)]">
                            <CategoryIcon size={20} />
                          </div>
                          <h2 className="font-display text-2xl text-white/90 font-semibold tracking-wide">
                            {category.name}
                          </h2>
                          <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>

                        <motion.div 
                          layout
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8"
                        >
                          <AnimatePresence mode="popLayout">
                            {categoryTheories.map((theory, index) => (
                              <TheoryCard 
                                key={theory.id} 
                                theory={theory} 
                                index={index} 
                                onClick={() => setSelectedTheory(theory)} 
                              />
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Single Category Grid
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl text-white/90 font-semibold tracking-wide">
                      {CATEGORIES.find(c => c.id === activeCategory)?.name || 'Discovery Grid'}
                    </h2>
                    <div className="h-[1px] flex-1 mx-6 bg-gradient-to-r from-white/10 to-transparent"></div>
                  </div>

                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredTheories.map((theory, index) => (
                        <TheoryCard 
                          key={theory.id} 
                          theory={theory} 
                          index={index} 
                          onClick={() => setSelectedTheory(theory)} 
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </div>
              )}
            
            {/* Bottom spacer */}
            <div className="h-12"></div>
          </main>
        </div>
      </motion.div>
      
      {/* Cinematic Reader Modal */}
      <TheoryModal 
        theory={selectedTheory} 
        onClose={() => setSelectedTheory(null)} 
      />

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile onClose={() => setShowProfile(false)} />
      )}
    </div>
  );
}
