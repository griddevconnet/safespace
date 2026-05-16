import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiPhone, FiImage, FiEdit2 } from 'react-icons/fi';
import api from '../api';

interface ProfileData {
  display_name: string;
  bio: string;
  avatar: string;
  birth_date: string;
  phone_number: string;
}

const EditProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: '',
    bio: '',
    avatar: '',
    birth_date: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/users/me/');
      setProfileData({
        display_name: response.data.display_name || '',
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
        birth_date: response.data.birth_date || '',
        phone_number: response.data.phone_number || ''
      });
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await api.put('/api/users/me/update/', profileData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to update profile');
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
        .edit-profile-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%);
          font-family: 'DM Sans', sans-serif;
          color: #1E3A5F;
          padding: 1rem;
          overflow-x: hidden;
          max-width: 100vw;
        }
        .profile-card {
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
        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .profile-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.8rem;
          color: #1E3A5F;
          margin: 0 0 0.5rem;
        }
        .profile-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          font-style: italic;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          color: #4A5568;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          padding: 0.8rem 1rem;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          font-size: 0.95rem;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .form-input:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        .submit-btn {
          width: 100%;
          padding: 0.9rem;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'DM Sans', sans-serif;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .input-wrapper {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          pointer-events: none;
        }
        .form-input.with-icon {
          padding-left: 2.8rem;
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
        @media (max-width: 480px) {
          .profile-card {
            padding: 1.5rem 1rem;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="edit-profile-root">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="profile-card"
        >
          <div className="profile-header">
            <h1 className="profile-title">Edit Profile</h1>
            <p className="profile-subtitle">Update your personal information</p>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="success-message"
            >
              Profile updated successfully!
            </motion.div>
          )}

          {error && (
            <div className="error-message">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <div className="input-wrapper">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  className="form-input with-icon"
                  value={profileData.display_name}
                  onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                  placeholder="Your display name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-input form-textarea"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Avatar URL</label>
              <div className="input-wrapper">
                <FiImage className="input-icon" />
                <input
                  type="url"
                  className="form-input with-icon"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Birth Date</label>
              <div className="input-wrapper">
                <FiCalendar className="input-icon" />
                <input
                  type="date"
                  className="form-input with-icon"
                  value={profileData.birth_date}
                  onChange={(e) => setProfileData({ ...profileData, birth_date: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div className="input-wrapper">
                <FiPhone className="input-icon" />
                <input
                  type="tel"
                  className="form-input with-icon"
                  value={profileData.phone_number}
                  onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default EditProfile;
