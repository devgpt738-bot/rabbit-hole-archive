import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TheoryPage from './pages/TheoryPage';
import ProfilePage from './pages/ProfilePage';
import SearchOverlay from './components/SearchOverlay';
import { AuthProvider } from './context/AuthContext';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [securityAlert, setSecurityAlert] = useState(null);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const res = await axios.post('http://localhost:3001/api/analytics/track');
        if (res.data.threatScore >= 5) {
          setSecurityAlert(`SECURITY THREAT DETECTED [Level ${res.data.threatScore}/10] - Unusual Operating System (${res.data.os}) recognized. Your connection is being monitored.`);
        }
      } catch (err) {
        console.error("Tracking failed", err);
      }
    };
    trackVisitor();
  }, []);

  return (
    <AuthProvider>
      <div className="app-wrapper">
        <div className="ambient-fog"></div>
        
        <Router>
          {isSearchOpen && <SearchOverlay onClose={() => setIsSearchOpen(false)} />}
          
          {/* Security Alert Modal */}
          <AnimatePresence>
            {securityAlert && (
              <motion.div 
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-[999] w-[90%] max-w-lg bg-red-900/90 border-2 border-red-500 rounded-xl p-4 shadow-[0_0_50px_rgba(255,0,0,0.5)] flex items-start gap-4 backdrop-blur-xl"
              >
                <AlertTriangle className="text-red-400 shrink-0 mt-1" size={24} />
                <div className="flex-1">
                  <h3 className="text-white font-display font-bold text-lg mb-1 tracking-widest uppercase text-red-500">Security Alert</h3>
                  <p className="text-red-200 text-sm font-sans">{securityAlert}</p>
                </div>
                <button onClick={() => setSecurityAlert(null)} className="text-red-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/archive" element={<Dashboard onOpenSearch={() => setIsSearchOpen(true)} />} />
            <Route path="/theory/:id" element={<TheoryPage onOpenSearch={() => setIsSearchOpen(true)} />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
