import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Key, BookOpen, Compass, Bookmark } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <nav className="profile-nav">
        <button className="back-btn" onClick={() => navigate('/archive')}>
          <ChevronLeft size={24} /> Return to Archive
        </button>
      </nav>

      <main className="profile-main">
        <header className="profile-header">
          <div className="avatar-ring">
            <div className="avatar-inner"></div>
          </div>
          <h1 className="profile-title">Their Archive Journey</h1>
          <p className="profile-level">Archivist Level 7</p>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <BookOpen size={30} className="stat-icon" />
            <div className="stat-value">23</div>
            <div className="stat-label">Theories Discovered</div>
          </div>
          
          <div className="stat-card">
            <Key size={30} className="stat-icon" />
            <div className="stat-value">5</div>
            <div className="stat-label">Rabbit Holes Completed</div>
          </div>
          
          <div className="stat-card">
            <Compass size={30} className="stat-icon" />
            <div className="stat-value">2</div>
            <div className="stat-label">Current Investigations</div>
          </div>
          
          <div className="stat-card">
            <Bookmark size={30} className="stat-icon" />
            <div className="stat-value">14</div>
            <div className="stat-label">Saved Mysteries</div>
          </div>
        </div>

        <section className="recent-activity">
          <h2>Recent Investigations</h2>
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-date">Today</span>
              <p>Entered the <strong>Simulation Hypothesis</strong> rabbit hole.</p>
            </div>
            <div className="activity-item">
              <span className="activity-date">Yesterday</span>
              <p>Completed the <strong>Eye of the Sahara</strong> investigation.</p>
            </div>
            <div className="activity-item">
              <span className="activity-date">3 days ago</span>
              <p>Saved <strong>The Voynich Manuscript</strong> to archives.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
