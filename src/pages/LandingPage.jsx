import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingStyles.css';
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
        <div className="hero-branding">
          <div className="landing-logo-container">
            <div className="logo-optical-wrapper">
              <img src={appLogo} alt="Rabbit Logo" className="landing-logo-icon" />
            </div>
            <h1 className="cinematic-title">RABBIT HOLE</h1>
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
        <div className="about-modal-overlay fade-in" onClick={() => setIsAboutOpen(false)}>
          <div className="about-modal-content" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: "bold", letterSpacing: "0.5px" }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title" style={{ fontSize: "2rem" }}>The Archive</h2>
            <p className="modal-text" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: "bold" }}>
              The Rabbit Hole Archive is an independent research index dedicated to the objective analysis of classified documents, historical anomalies, and systemic conspiracy theories.
            </p>
            <p className="modal-text" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: "bold" }}>
              Our mission is to catalog suppressed information and evaluate speculative phenomena through a rigorous, analytical lens, free from sensationalism. Navigate the repository to explore the evidence.
            </p>
            <button className="glass-btn close-modal-btn" style={{ fontFamily: "'Fredoka', sans-serif", fontWeight: "bold" }} onClick={() => setIsAboutOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
