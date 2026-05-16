import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiEye, FiBell, FiVolume2, FiLock, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface PrivacySettings {
  is_private: boolean;
  show_mood_to_partner: boolean;
  show_activity_status: boolean;
  notification_enabled: boolean;
  notification_sound: boolean;
}

const PrivacySettings: React.FC = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PrivacySettings>({
    is_private: false,
    show_mood_to_partner: true,
    show_activity_status: true,
    notification_enabled: true,
    notification_sound: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    permission: notificationPermission,
    subscribe: subscribeToPush,
    unsubscribe: unsubscribeFromPush,
    loading: pushLoading
  } = usePushNotifications();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/users/privacy/');
      setSettings(response.data);
    } catch {
      setError('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof PrivacySettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    
    // Handle push notification subscription
    if (key === 'notification_enabled' && newSettings.notification_enabled) {
      const subscribed = await subscribeToPush();
      if (!subscribed) {
        return; // Don't toggle if subscription failed
      }
    } else if (key === 'notification_enabled' && !newSettings.notification_enabled) {
      await unsubscribeFromPush();
    }
    
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  const saveSettings = async (newSettings: PrivacySettings) => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put('/api/users/privacy/', newSettings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to update privacy settings');
      // Revert on error
      setSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        .privacy-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%);
          font-family: 'DM Sans', sans-serif;
          color: #1E3A5F;
          padding: 1rem;
          overflow-x: hidden;
          max-width: 100vw;
        }
        .privacy-card {
          max-width: 500px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 28px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          padding: 2rem 1.5rem;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.12);
        }
        .privacy-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .privacy-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem;
          color: #1E3A5F;
          margin: 0 0 0.5rem;
        }
        .privacy-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          font-style: italic;
        }
        .setting-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.2rem;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.1);
          margin-bottom: 1rem;
          transition: all 0.2s;
        }
        .setting-item:hover {
          background: rgba(255, 255, 255, 0.8);
          border-color: rgba(59, 130, 246, 0.2);
        }
        .setting-left {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .setting-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(59, 130, 246, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3B82F6;
          flex-shrink: 0;
        }
        .setting-info {
          flex: 1;
        }
        .setting-label {
          font-size: 0.95rem;
          font-weight: 500;
          color: #1E3A5F;
          margin-bottom: 0.2rem;
        }
        .setting-description {
          font-size: 0.8rem;
          color: #64748B;
          line-height: 1.3;
        }
        .toggle-switch {
          position: relative;
          width: 52px;
          height: 28px;
          flex-shrink: 0;
        }
        .toggle-input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #CBD5E1;
          transition: 0.3s;
          border-radius: 28px;
        }
        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .toggle-input:checked + .toggle-slider {
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
        }
        .toggle-input:checked + .toggle-slider:before {
          transform: translateX(24px);
        }
        .toggle-input:disabled + .toggle-slider {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .success-message {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          color: #059669;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #DC2626;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border: 1px solid rgba(59, 130, 246, 0.25);
          background: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          color: #64748B;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 1.5rem;
        }
        .back-button:hover {
          background: rgba(59, 130, 246, 0.1);
          color: #3B82F6;
          border-color: rgba(59, 130, 246, 0.4);
        }
        @media (max-width: 480px) {
          .privacy-card {
            padding: 1.5rem 1rem;
            border-radius: 22px;
          }
          .setting-item {
            padding: 0.9rem 1rem;
          }
        }
      `}</style>

      <div className="privacy-root">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="privacy-card"
        >
          <button
            onClick={() => navigate('/settings')}
            className="back-button"
          >
            <FiArrowLeft size={16} /> Back to Settings
          </button>

          <div className="privacy-header">
            <h1 className="privacy-title">Privacy Settings</h1>
            <p className="privacy-subtitle">Control your privacy and notifications</p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="success-message"
            >
              Privacy settings updated successfully!
            </motion.div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          <div className="settings-list">
            {/* Private Profile */}
            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-icon">
                  <FiLock />
                </div>
                <div className="setting-info">
                  <div className="setting-label">Private Profile</div>
                  <div className="setting-description">Make your profile visible only to your partner</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.is_private}
                  onChange={() => handleToggle('is_private')}
                  disabled={saving}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Show Mood to Partner */}
            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-icon">
                  <FiEye />
                </div>
                <div className="setting-info">
                  <div className="setting-label">Show Mood to Partner</div>
                  <div className="setting-description">Allow your partner to see your mood updates</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.show_mood_to_partner}
                  onChange={() => handleToggle('show_mood_to_partner')}
                  disabled={saving}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Show Activity Status */}
            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-icon">
                  <FiShield />
                </div>
                <div className="setting-info">
                  <div className="setting-label">Show Activity Status</div>
                  <div className="setting-description">Show when you're online or last active</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.show_activity_status}
                  onChange={() => handleToggle('show_activity_status')}
                  disabled={saving}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Enable Notifications */}
            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-icon">
                  <FiBell />
                </div>
                <div className="setting-info">
                  <div className="setting-label">Enable Notifications</div>
                  <div className="setting-description">
                    Receive push notifications for mood updates
                    {notificationPermission === 'denied' && (
                      <span style={{ color: '#DC2626', marginLeft: '0.5rem' }}>(Blocked)</span>
                    )}
                  </div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.notification_enabled}
                  onChange={() => handleToggle('notification_enabled')}
                  disabled={saving || pushLoading || notificationPermission === 'denied'}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* Notification Sound */}
            <div className="setting-item">
              <div className="setting-left">
                <div className="setting-icon">
                  <FiVolume2 />
                </div>
                <div className="setting-info">
                  <div className="setting-label">Notification Sound</div>
                  <div className="setting-description">Play sound for notifications</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={settings.notification_sound}
                  onChange={() => handleToggle('notification_sound')}
                  disabled={saving || !settings.notification_enabled}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default PrivacySettings;
