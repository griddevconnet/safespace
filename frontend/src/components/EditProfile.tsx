import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiPhone, FiImage, FiArrowLeft, FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface ProfileData {
  display_name: string;
  bio: string;
  avatar: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  phone_number: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const parseBirthDate = (dateStr: string) => {
  if (!dateStr) return { birth_day: '', birth_month: '', birth_year: '' };
  const [year, month, day] = dateStr.split('-');
  return {
    birth_day: day ? String(parseInt(day)) : '',
    birth_month: month || '',
    birth_year: year || '',
  };
};

const buildBirthDate = (day: string, month: string, year: string): string | null => {
  if (!day || !month || !year) return null;
  return `${year}-${month.padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: '',
    bio: '',
    avatar: '',
    birth_day: '',
    birth_month: '',
    birth_year: '',
    phone_number: '',
  });
  const [avatarError, setAvatarError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bioLength, setBioLength] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/users/me/');
      const { birth_day, birth_month, birth_year } = parseBirthDate(response.data.birth_date || '');
      setProfileData({
        display_name: response.data.display_name || '',
        bio: response.data.bio || '',
        avatar: response.data.avatar || '',
        birth_day,
        birth_month,
        birth_year,
        phone_number: response.data.phone_number || '',
      });
      setBioLength((response.data.bio || '').length);
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

    const { birth_day, birth_month, birth_year, ...rest } = profileData;
    const payload = {
      ...rest,
      birth_date: buildBirthDate(birth_day, birth_month, birth_year),
    };

    try {
      await api.put('/api/users/me/update/', payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 101 }, (_, i) => String(currentYear - i));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%)' }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .ep-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%);
          font-family: 'DM Sans', sans-serif;
          color: #1E3A5F;
          padding: 1.5rem 1rem;
          overflow-x: hidden;
        }

        .ep-card {
          max-width: 620px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 28px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          padding: 2rem 2rem;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.12);
        }

        .ep-back {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: 1px solid rgba(59, 130, 246, 0.25);
          background: rgba(255, 255, 255, 0.7);
          border-radius: 10px;
          color: #64748B;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 1.5rem;
        }
        .ep-back:hover {
          background: rgba(59, 130, 246, 0.08);
          color: #3B82F6;
          border-color: rgba(59, 130, 246, 0.4);
        }

        .ep-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }
        .ep-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          color: #1E3A5F;
          margin: 0 0 4px;
        }
        .ep-subtitle {
          font-size: 0.88rem;
          color: #64748B;
          font-style: italic;
          margin: 0;
        }

        .ep-avatar-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(239, 246, 255, 0.6);
          border: 1px solid rgba(59, 130, 246, 0.12);
          border-radius: 16px;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
        }
        .ep-avatar-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: #E6F1FB;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #185FA5;
          flex-shrink: 0;
          border: 2px solid #B5D4F4;
          overflow: hidden;
        }
        .ep-avatar-circle img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        .ep-avatar-info p { margin: 0; }
        .ep-avatar-label { font-size: 13px; font-weight: 500; color: #1E3A5F; margin-bottom: 2px !important; }
        .ep-avatar-hint { font-size: 12px; color: #64748B; }

        .ep-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .ep-full { grid-column: 1 / -1; }

        .ep-group label {
          display: block;
          font-size: 11px;
          font-weight: 500;
          color: #64748B;
          margin-bottom: 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Flex-based input wrapper — icon never overlaps text */
        .ep-input-wrap {
          display: flex;
          align-items: center;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.85);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ep-input-wrap:focus-within {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .ep-input-wrap .ep-icon {
          display: flex;
          align-items: center;
          padding: 0 10px 0 12px;
          color: #9CA3AF;
          flex-shrink: 0;
        }
        .ep-input-wrap input,
        .ep-input-wrap textarea {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.92rem;
          font-family: 'DM Sans', sans-serif;
          color: #1E3A5F;
          padding: 10px 12px 10px 0;
          outline: none;
          min-width: 0;
        }
        .ep-input-wrap textarea {
          padding: 10px 12px;
          resize: vertical;
          min-height: 90px;
          line-height: 1.5;
        }
        .ep-char {
          font-size: 11px;
          color: #94A3B8;
          text-align: right;
          margin-top: 4px;
        }

        /* Date dropdowns */
        .ep-date-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .ep-select-wrap {
          position: relative;
        }
        .ep-select-wrap select {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          font-size: 0.88rem;
          font-family: 'DM Sans', sans-serif;
          color: #1E3A5F;
          padding: 10px 28px 10px 10px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.85);
          cursor: pointer;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .ep-select-wrap select:focus {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .ep-select-wrap .ep-chevron {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: #9CA3AF;
        }

        .ep-success {
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid rgba(74, 222, 128, 0.3);
          color: #059669;
          padding: 10px 14px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.88rem;
        }
        .ep-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: #DC2626;
          padding: 10px 14px;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 0.88rem;
        }

        .ep-footer {
          margin-top: 1.75rem;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .ep-cancel {
          padding: 10px 20px;
          font-size: 0.9rem;
          font-family: 'DM Sans', sans-serif;
          border: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ep-cancel:hover {
          background: rgba(59, 130, 246, 0.06);
          color: #3B82F6;
        }
        .ep-save {
          padding: 10px 24px;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ep-save:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        .ep-save:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none;
        }

        /* placeholder color */
        .ep-input-wrap input::placeholder,
        .ep-input-wrap textarea::placeholder {
          color: #CBD5E1;
        }
        .ep-select-wrap select option[value=""] {
          color: #CBD5E1;
        }

        @media (max-width: 540px) {
          .ep-card { padding: 1.5rem 1rem; border-radius: 22px; }
          .ep-grid { grid-template-columns: 1fr; }
          .ep-full { grid-column: auto; }
          .ep-footer { flex-direction: column-reverse; }
          .ep-cancel, .ep-save { width: 100%; text-align: center; }
          .ep-date-row { grid-template-columns: 1fr 1fr 1fr; }
        }
      `}</style>

      <div className="ep-root">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="ep-card"
        >
          <button onClick={() => navigate('/settings')} className="ep-back">
            <FiArrowLeft size={14} /> Back to Settings
          </button>

          <div className="ep-header">
            <h1 className="ep-title">Edit Profile</h1>
            <p className="ep-subtitle">Update your personal information</p>
          </div>

          {/* Avatar preview strip */}
          <div className="ep-avatar-row">
            <div className="ep-avatar-circle">
              {profileData.avatar && !avatarError ? (
                <img
                  src={profileData.avatar}
                  alt="avatar preview"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <FiUser size={22} />
              )}
            </div>
            <div className="ep-avatar-info">
              <p className="ep-avatar-label">Profile photo</p>
              <p className="ep-avatar-hint">Paste an image URL below to update your avatar</p>
            </div>
          </div>

          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="ep-success">
              Profile updated successfully!
            </motion.div>
          )}
          {error && <div className="ep-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="ep-grid">

              {/* Display name — full width */}
              <div className="ep-group ep-full">
                <label>Display Name</label>
                <div className="ep-input-wrap">
                  <span className="ep-icon"><FiUser size={15} /></span>
                  <input
                    type="text"
                    value={profileData.display_name}
                    onChange={(e) => setProfileData({ ...profileData, display_name: e.target.value })}
                    placeholder="Your display name"
                  />
                </div>
              </div>

              {/* Bio — full width */}
              <div className="ep-group ep-full">
                <label>Bio</label>
                <div className="ep-input-wrap">
                  <textarea
                    value={profileData.bio}
                    maxLength={500}
                    onChange={(e) => {
                      setProfileData({ ...profileData, bio: e.target.value });
                      setBioLength(e.target.value.length);
                    }}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="ep-char">{bioLength} / 500</div>
              </div>

              {/* Avatar URL — full width */}
              <div className="ep-group ep-full">
                <label>Avatar URL</label>
                <div className="ep-input-wrap">
                  <span className="ep-icon"><FiImage size={15} /></span>
                  <input
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) => {
                      setAvatarError(false);
                      setProfileData({ ...profileData, avatar: e.target.value });
                    }}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              {/* Phone — left column */}
              <div className="ep-group">
                <label>Phone Number</label>
                <div className="ep-input-wrap">
                  <span className="ep-icon"><FiPhone size={15} /></span>
                  <input
                    type="tel"
                    value={profileData.phone_number}
                    onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              {/* Date of birth — right column */}
              <div className="ep-group">
                <label>Date of Birth</label>
                <div className="ep-date-row">
                  {/* Day */}
                  <div className="ep-select-wrap">
                    <select
                      value={profileData.birth_day}
                      onChange={(e) => setProfileData({ ...profileData, birth_day: e.target.value })}
                      aria-label="Day"
                    >
                      <option value="">Day</option>
                      {days.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <FiChevronDown size={13} className="ep-chevron" />
                  </div>

                  {/* Month */}
                  <div className="ep-select-wrap">
                    <select
                      value={profileData.birth_month}
                      onChange={(e) => setProfileData({ ...profileData, birth_month: e.target.value })}
                      aria-label="Month"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m, i) => (
                        <option key={m} value={String(i + 1).padStart(2, '0')}>{m}</option>
                      ))}
                    </select>
                    <FiChevronDown size={13} className="ep-chevron" />
                  </div>

                  {/* Year */}
                  <div className="ep-select-wrap">
                    <select
                      value={profileData.birth_year}
                      onChange={(e) => setProfileData({ ...profileData, birth_year: e.target.value })}
                      aria-label="Year"
                    >
                      <option value="">Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <FiChevronDown size={13} className="ep-chevron" />
                  </div>
                </div>
              </div>

            </div>

            <div className="ep-footer">
              <button type="button" className="ep-cancel" onClick={() => navigate('/settings')}>
                Cancel
              </button>
              <button type="submit" className="ep-save" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </>
  );
};

export default EditProfile;