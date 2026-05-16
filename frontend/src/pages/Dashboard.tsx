import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import MoodChecker from '../components/MoodChecker';
import useWebSocket from '../hooks/useWebSocket';
import { motion } from 'framer-motion';
import { FiLogOut, FiSettings } from 'react-icons/fi';

interface MoodEntry {
  id: number;
  user: { id: number; username: string };
  mood_value: number;
  mood_label: string;
  timestamp: string;
}


const getMoodStyle = (value: number) => {
  if (value < 30) return { color: '#E87070', bg: '#FDE8E8', emoji: '😞' };
  if (value < 60) return { color: '#D4A855', bg: '#FEF6E4', emoji: '😐' };
  if (value < 80) return { color: '#6AAF80', bg: '#E8F5EE', emoji: '🙂' };
  return { color: '#9B7DC4', bg: '#F0EBF8', emoji: '😄' };
};

const comingSoonFeatures = [
  { icon: '🧩', label: 'Emotion Puzzles', desc: 'Solve puzzles together', available: true, route: '/puzzle' },
  { icon: '🤝', label: 'Secret Handshake', desc: 'Your private ritual', available: true, route: '/handshake' },
  { icon: '🎵', label: 'Shared Playlist', desc: 'Music for two', available: false },
  { icon: '💌', label: 'Love Notes', desc: 'Little surprises', available: false },
  { icon: '📓', label: 'Shared Journal', desc: 'Write your story', available: false },
  { icon: '🌙', label: 'Night Check-in', desc: 'End each day together', available: false },
];

const Dashboard: React.FC = () => {
  const { isAuthenticated, logout, username, userId, partnerId, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [myLatestMood, setMyLatestMood] = useState<MoodEntry | null>(null);
  const [partnerLatestMood, setPartnerLatestMood] = useState<MoodEntry | null>(null);

  const handleWebSocketMessage = useCallback((message: any) => {
    if (message.type === 'mood_message') {
      const moodData = message.message;
      const currentUserId = localStorage.getItem('userId');
      const currentPartnerId = localStorage.getItem('partnerId');
      if (String(moodData.user.id) === currentUserId) {
        setMyLatestMood(moodData);
      } else if (currentPartnerId && String(moodData.user.id) === currentPartnerId) {
        setPartnerLatestMood(moodData);
      }
    }
  }, []);

  const { isConnected, error: wsError } = useWebSocket('/ws/moods/', handleWebSocketMessage);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && userId) {
      const fetchPartnerInfo = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/users/partner-code/`, {
            headers: {
              'Authorization': `Token ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (data.partner && data.partner.id) {
            localStorage.setItem('partnerId', String(data.partner.id));
          }
        } catch (error) {
          console.error('Error fetching partner info:', error);
        }
      };
      fetchPartnerInfo();
    }
  }, [isAuthenticated, userId]);

  const handleMoodUpdateFromChecker = useCallback((newMood: MoodEntry) => {
    setMyLatestMood(newMood);
  }, []);

  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FDF6F0',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          style={{ fontSize: '2.5rem' }}
        >
          ♥
        </motion.div>
      </div>
    );
  }

  const partnerMoodStyle = partnerLatestMood ? getMoodStyle(partnerLatestMood.mood_value) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .dashboard-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%);
          font-family: 'DM Sans', sans-serif;
          color: #1E3A5F;
        }
        .nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.2rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(59, 130, 246, 0.15);
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 10;
          box-shadow: 0 4px 30px rgba(59, 130, 246, 0.08);
        }
        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #1E3A5F;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          text-decoration: none;
        }
        .nav-logo span {
          color: #3B82F6;
          font-style: italic;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .nav-greeting {
          font-size: 0.85rem;
          color: #64748B;
          display: none;
        }
        @media (min-width: 480px) {
          .nav-greeting { display: block; }
        }
        .icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(59, 130, 246, 0.25);
          background: rgba(255, 255, 255, 0.8);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748B;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }
        .icon-btn:hover { 
          background: rgba(59, 130, 246, 0.1); 
          color: #3B82F6;
          border-color: rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          border-radius: 20px;
          border: 1.5px solid rgba(59, 130, 246, 0.3);
          background: rgba(255, 255, 255, 0.7);
          color: #64748B;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .logout-btn:hover {
          background: rgba(220, 80, 80, 0.1);
          border-color: rgba(220, 80, 80, 0.4);
          color: #DC2626;
        }
        .main-content {
          max-width: 860px;
          margin: 0 auto;
          padding: 1.5rem 1rem 3rem;
        }
        .welcome-banner {
          text-align: center;
          padding: 1.5rem 1rem 0.5rem;
          margin-bottom: 1.5rem;
        }
        .welcome-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.6rem, 5vw, 2.2rem);
          color: #1E3A5F;
          margin: 0 0 0.3rem;
          line-height: 1.2;
        }
        .welcome-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          font-style: italic;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .cards-grid { grid-template-columns: 1fr 1fr; }
        }
        .card {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 24px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          padding: 1.5rem;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.1);
        }
        .partner-card-header {
          font-family: 'DM Serif Display', serif;
          font-size: 1.25rem;
          color: #1E3A5F;
          text-align: center;
          margin: 0 0 1rem;
        }
        .connection-notice {
          padding: 0.55rem 0.9rem;
          border-radius: 12px;
          font-size: 0.82rem;
          text-align: center;
          margin-bottom: 0.8rem;
        }
        .partner-mood-display {
          text-align: center;
          padding: 1rem 0;
        }
        .partner-mood-emoji {
          font-size: 3.2rem;
          display: block;
          margin-bottom: 0.6rem;
          animation: float 4s ease-in-out infinite;
        }
        .partner-mood-name-label {
          font-size: 0.82rem;
          color: #64748B;
          margin-bottom: 0.3rem;
        }
        .partner-mood-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          color: #1E3A5F;
          margin: 0 0 0.6rem;
        }
        .partner-mood-badge {
          display: inline-block;
          padding: 0.35rem 1.1rem;
          border-radius: 20px;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.6rem;
        }
        .partner-mood-time {
          font-size: 0.78rem;
          color: rgba(100, 116, 139, 0.6);
          font-style: italic;
        }
        .partner-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem 0;
          gap: 0.7rem;
          color: #64748B;
        }
        .partner-empty-icon {
          font-size: 2.5rem;
          opacity: 0.5;
        }
        .partner-empty-text {
          font-size: 0.9rem;
          font-style: italic;
          text-align: center;
          max-width: 200px;
          line-height: 1.5;
        }
        .coming-soon-section {
          margin-top: 1.5rem;
        }
        .coming-soon-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #1E3A5F;
          text-align: center;
          margin-bottom: 1rem;
        }
        .coming-soon-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }
        @media (min-width: 500px) {
          .coming-soon-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .coming-soon-item {
          background: rgba(255, 255, 255, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.12);
          border-radius: 16px;
          padding: 1rem 0.75rem;
          text-align: center;
          cursor: default;
          transition: all 0.2s;
          backdrop-filter: blur(8px);
        }
        .coming-soon-item:hover {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.25);
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.12);
        }
        .coming-soon-emoji {
          font-size: 1.6rem;
          display: block;
          margin-bottom: 0.4rem;
        }
        .coming-soon-label {
          font-size: 0.82rem;
          font-weight: 500;
          color: #1E3A5F;
          display: block;
          margin-bottom: 0.15rem;
        }
        .coming-soon-desc {
          font-size: 0.72rem;
          color: #64748B;
          font-style: italic;
        }
        .coming-soon-badge {
          display: inline-block;
          font-size: 0.65rem;
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          margin-top: 0.3rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .ws-error {
          background: rgba(220, 80, 80, 0.08);
          border: 1px solid rgba(220, 80, 80, 0.18);
          color: #DC2626;
        }
        .ws-connecting {
          background: rgba(212, 168, 85, 0.1);
          border: 1px solid rgba(212, 168, 85, 0.2);
          color: #B45309;
        }
      `}</style>

      <div className="dashboard-root">
        <motion.nav
          className="nav-bar"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="nav-logo">
            ♥ <span>SafeSpace</span>
          </div>
          <div className="nav-right">
            <span className="nav-greeting">Hi, {username} ✨</span>
            <button className="icon-btn" title="Settings" aria-label="Settings" onClick={() => navigate('/settings')}>
              <FiSettings size={17} />
            </button>
            <button className="logout-btn" onClick={logout}>
              <FiLogOut size={15} /> Leave
            </button>
          </div>
        </motion.nav>

        <div className="main-content">
          <motion.div
            className="welcome-banner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="welcome-title">Your safe space awaits 🌸</h1>
            <p className="welcome-subtitle">Check in, share your heart, feel connected</p>
          </motion.div>

          <div className="cards-grid">
            <motion.div
              className="card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MoodChecker
                onMoodChange={handleMoodUpdateFromChecker}
                myMood={myLatestMood}
                partnerId={partnerId || undefined}
              />
            </motion.div>

            <motion.div
              className="card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="partner-card-header">Partner's Mood 💞</h3>

              {wsError && (
                <div className="connection-notice ws-error">
                  Connection issue — data may be delayed
                </div>
              )}
              {!isConnected && !wsError && (
                <div className="connection-notice ws-connecting">
                  Connecting for live updates…
                </div>
              )}

              {partnerLatestMood && partnerMoodStyle ? (
                <motion.div
                  className="partner-mood-display"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <span className="partner-mood-emoji">{partnerMoodStyle.emoji}</span>
                  <p className="partner-mood-name-label">{partnerLatestMood.user.username} is feeling</p>
                  <p className="partner-mood-name">{partnerLatestMood.mood_label}</p>
                  <span
                    className="partner-mood-badge"
                    style={{
                      background: partnerMoodStyle.bg,
                      color: partnerMoodStyle.color,
                    }}
                  >
                    {partnerLatestMood.mood_value} / 100
                  </span>
                  <p className="partner-mood-time">
                    {new Date(partnerLatestMood.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </motion.div>
              ) : (
                <div className="partner-empty-state">
                  <span className="partner-empty-icon">🕊️</span>
                  <p className="partner-empty-text">
                    Waiting for your partner to share their mood…
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            className="coming-soon-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="coming-soon-title">More ways to connect ✨</h3>
            <div className="coming-soon-grid">
              {comingSoonFeatures.map((f, i) => (
                <motion.div
                  key={f.label}
                  className="coming-soon-item"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.55 + i * 0.07 }}
                  onClick={f.available && f.route ? () => navigate(f.route) : undefined}
                  style={{ cursor: f.available ? 'pointer' : 'default' }}
                >
                  <span className="coming-soon-emoji">{f.icon}</span>
                  <span className="coming-soon-label">{f.label}</span>
                  <span className="coming-soon-desc">{f.desc}</span>
                  <span className="coming-soon-badge" style={{ 
                    background: f.available ? 'rgba(107, 175, 128, 0.15)' : 'rgba(196, 150, 160, 0.15)',
                    color: f.available ? '#6AAF80' : '#9B7A85'
                  }}>
                    {f.available ? 'Available' : 'soon'}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;