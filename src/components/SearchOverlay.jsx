import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import DOMPurify from 'dompurify';
import './SearchOverlay.css';

export default function SearchOverlay({ onClose }) {
  const inputRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Ref to hold the debounce timeout ID
  const debounceTimer = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleInputChange = (e) => {
    // 1. Instantly sanitize the raw input to strip any malicious HTML/scripts
    const rawValue = e.target.value;
    const sanitizedValue = DOMPurify.sanitize(rawValue);
    
    // 2. Clear any pending debounced execution
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // 3. Set a new debounce timer (e.g., wait 300ms after user stops typing before processing)
    debounceTimer.current = setTimeout(() => {
      setSearchTerm(sanitizedValue);
      // If we had a backend search endpoint, we would call it here
      if (sanitizedValue.length > 0) {
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }
    }, 300);
  };

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
            onChange={handleInputChange}
          />
        </div>
        
        <div className="search-results-placeholder">
          {searchTerm ? (
            <p className="hint">Searching for: "{searchTerm}"...</p>
          ) : (
            <p className="hint">Begin typing to reveal hidden knowledge...</p>
          )}
          {/* Real API results would map here in the future */}
        </div>
      </div>
    </div>
  );
}
