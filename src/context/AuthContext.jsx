import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = '/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [readHistory, setReadHistory] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/me`);
      setUser(res.data.user);
      setBookmarks(new Set(res.data.bookmarks));
      setReadHistory(new Set(res.data.readHistory));
    } catch (error) {
      console.error('Failed to fetch user data', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { username, password });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    await fetchUserData();
  };

  const signup = async (username, password, provider = 'manual') => {
    const res = await axios.post(`${API_URL}/auth/signup`, { username, password, provider });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
  };

  const otpLogin = async (identifier, provider, username) => {
    const res = await axios.post(`${API_URL}/auth/otp-verify`, { identifier, provider, username });
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    setUser(res.data.user);
    await fetchUserData(); // fetch bookmarks etc
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setBookmarks(new Set());
    setReadHistory(new Set());
  };

  const toggleBookmark = async (theoryId, isBookmarked) => {
    try {
      // Optimistic update
      const newBookmarks = new Set(bookmarks);
      if (isBookmarked) newBookmarks.add(theoryId);
      else newBookmarks.delete(theoryId);
      setBookmarks(newBookmarks);

      await axios.post(`${API_URL}/user/bookmark`, { theoryId, bookmarked: isBookmarked });
    } catch (error) {
      console.error('Failed to toggle bookmark', error);
      // Revert on fail
      fetchUserData(); 
    }
  };

  const markAsRead = async (theoryId) => {
    if (readHistory.has(theoryId)) return; // Already read
    try {
      const res = await axios.post(`${API_URL}/user/read`, { theoryId });
      if (res.data.success) {
        setUser(prev => ({ ...prev, score: res.data.newScore }));
        setReadHistory(prev => new Set(prev).add(theoryId));
      }
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const syncTime = async (scrollingTimeDelta, readingTimeDelta) => {
    if (!user) return;
    try {
      const res = await axios.post(`${API_URL}/user/sync-time`, { scrollingTimeDelta, readingTimeDelta });
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error('Failed to sync time', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user, bookmarks, readHistory, loading,
      login, signup, otpLogin, logout, toggleBookmark, markAsRead, syncTime
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
