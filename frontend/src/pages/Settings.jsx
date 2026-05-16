import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion } from 'framer-motion';
import { FiLogOut, FiSettings, FiUser, FiBell } from 'react-icons/fi';

const GoogleFonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap');
  `}</style>
);

const Settings = () => {
  const navigate = useNavigate();
  const { username, userId, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const styles = {
    root: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      fontFamily: "'DM Sans', sans-serif",
    },
    card: {
      width: '100%',
      maxWidth: 420,
      background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 28,
      padding: '2rem',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.12)',
    },
    backButton: {
      padding: '0.5rem 1rem',
      borderRadius: 12,
      border: '1px solid rgba(59, 130, 246, 0.25)',
      background: 'rgba(255, 255, 255, 0.7)',
      cursor: 'pointer',
      fontSize: '0.85rem',
      color: '#64748B',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '2rem',
      textAlign: 'center',
      marginBottom: '0.5rem',
      color: '#1E3A5F',
      fontFamily: "'DM Serif Display', serif",
    },
    subtitle: {
      textAlign: 'center',
      color: '#64748B',
      marginBottom: '2rem',
      fontSize: '0.95rem',
    },
    section: {
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '0.85rem',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '1rem',
    },
    settingItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem',
      borderRadius: 16,
      background: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      marginBottom: '0.75rem',
    },
    settingLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.95rem',
      color: '#1E3A5F',
    },
    settingIcon: {
      fontSize: '1.1rem',
      color: '#3B82F6',
    },
    toggle: {
      width: '48px',
      height: '26px',
      borderRadius: '13px',
      background: notifications ? '#3B82F6' : 'rgba(59, 130, 246, 0.2)',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.3s',
    },
    toggleCircle: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'white',
      position: 'absolute',
      top: '3px',
      left: notifications ? '25px' : '3px',
      transition: 'left 0.3s',
    },
    button: {
      width: '100%',
      padding: '1rem',
      borderRadius: 16,
      border: '1px solid rgba(59, 130, 246, 0.25)',
      background: 'rgba(255, 255, 255, 0.7)',
      cursor: 'pointer',
      fontSize: '0.95rem',
      color: '#64748B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    logoutButton: {
      border: '1.5px solid rgba(59, 130, 246, 0.3)',
      color: '#3B82F6',
      marginTop: '1rem',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '1rem',
      borderRadius: 16,
      background: 'rgba(255, 255, 255, 0.6)',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      marginBottom: '2rem',
    },
    avatar: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#fff',
    },
    userDetails: {
      flex: 1,
    },
    userName: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1E3A5F',
    },
    userId: {
      fontSize: '0.8rem',
      color: '#64748B',
    },
  };

  return (
    <>
      <GoogleFonts />
      <div style={styles.root}>
        <motion.div
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate('/')}
            style={styles.backButton}
          >
            ← Back to Dashboard
          </button>

          <h1 style={styles.title}>
            Settings ⚙️
          </h1>

          <p style={styles.subtitle}>
            Manage your SafeSpace preferences
          </p>

          {/* User Info */}
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {username?.charAt(0).toUpperCase()}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{username}</div>
              <div style={styles.userId}>ID: {userId}</div>
            </div>
          </div>

          {/* App Settings */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>App Settings</div>
          </div>

          {/* Account Settings */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Account</div>

            <button style={styles.button} onClick={() => navigate('/partner')}>
              <FiUser style={styles.settingIcon} />
              Partner Connection
            </button>

            <button style={styles.button} onClick={() => navigate('/profile')}>
              <FiUser style={styles.settingIcon} />
              Edit Profile
            </button>

            <button style={styles.button} onClick={() => navigate('/privacy')}>
              <FiSettings style={styles.settingIcon} />
              Privacy Settings
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{ ...styles.button, ...styles.logoutButton }}
          >
            <FiLogOut style={styles.settingIcon} />
            Log Out
          </button>
        </motion.div>
      </div>
    </>
  );
};

export default Settings;
