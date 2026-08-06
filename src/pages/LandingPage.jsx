import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import appLogo from '../assets/logo.png';
import bgVideo from '../assets/da.mp4';

export default function LandingPage() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Cinematic fade in
    setTimeout(() => setLoaded(true), 100);
    
    // Smoothly slow down the video playback
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <div className={`landing-container ${loaded ? 'fade-in' : ''}`}>
      {/* 3D Video Background */}
      <div className="bg-video-container">
        <video ref={videoRef} autoPlay loop muted playsInline className="bg-video">
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="video-overlay"></div>
      </div>
      
      {/* Static UI Container */}
      <div className="floating-ui-wrapper">
        <div className="flex flex-col items-center mt-[15vh] mb-[80px]">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0" style={{ transform: 'translateZ(60px)', transformStyle: 'preserve-3d' }}>
            <div className="flex items-center justify-center md:mr-[-1.8em] md:-translate-y-1/4">
              <img src={appLogo} alt="Rabbit Logo" className="w-24 md:w-[7.8em]" style={{ filter: 'drop-shadow(0 0 15px rgba(163,38,56,0.5))', animation: 'floatLogo 6s infinite alternate ease-in-out' }} />
            </div>
            <h1 className="cinematic-title text-center text-3xl md:text-5xl whitespace-normal md:whitespace-nowrap mt-2 md:mt-0">RABBIT HOLE</h1>
          </div>
        </div>
        
        <div className="hero-actions">
          <button className="glass-btn primary-btn enter-btn" onClick={() => navigate('/archive')}>
            ENTER
          </button>
          <span className="text-link about-link" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: "bold" }} onClick={() => setIsAboutOpen(true)}>
            ABOUT US
          </span>
        </div>
      </div>

      {/* About Us Modal */}
      {isAboutOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center z-[100] p-4 fade-in" onClick={() => setIsAboutOpen(false)}>
          <div className="relative bg-[#0a0505]/60 backdrop-blur-[30px] border border-white/15 p-6 md:p-12 rounded-[25px] w-full max-w-[600px] text-center shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_2px_2px_rgba(255,255,255,0.2),inset_0_-2px_5px_rgba(163,38,56,0.2)]" 
               style={{ maxHeight: '75vh', overflowY: 'auto', fontFamily: "'Fredoka', sans-serif", fontWeight: "bold", letterSpacing: "0.5px" }} 
               onClick={e => e.stopPropagation()}>
            <h2 className="text-white text-2xl md:text-[2.5rem] tracking-[4px] mb-4 drop-shadow-[0_0_20px_rgba(196,56,70,0.6)]" style={{ fontFamily: 'var(--font-primary)' }}>The Archive</h2>
            <p className="text-[#F5F2EE] text-sm md:text-[1.15rem] leading-[1.7] mb-6">
              The Rabbit Hole Archive is an independent research index dedicated to the objective analysis of classified documents, historical anomalies, and systemic conspiracy theories.
            </p>
            <p className="text-[#F5F2EE] text-sm md:text-[1.15rem] leading-[1.7] mb-8">
              Our mission is to catalog suppressed information and evaluate speculative phenomena through a rigorous, analytical lens, free from sensationalism. Navigate the repository to explore the evidence.
            </p>
            <button className="glass-btn px-8 py-2 md:py-3 text-sm md:text-[1.1rem] mt-2 w-full md:w-auto" onClick={() => setIsAboutOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
