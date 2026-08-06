import React, { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import './SearchOverlay.css';

export default function SearchOverlay({ onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="search-overlay">
      <div className="search-backdrop" onClick={onClose}></div>
      <div className="search-modal">
        <button className="close-search" onClick={onClose}><X size={24}/></button>
        
        <div className="search-input-wrapper">
          <Search size={28} className="search-icon-large" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search the forbidden archives..." 
            className="forbidden-search-input"
          />
        </div>
        
        <div className="search-results-placeholder">
          <p className="hint">Begin typing to reveal hidden knowledge...</p>
          {/* Results would map here */}
        </div>
      </div>
    </div>
  );
}
