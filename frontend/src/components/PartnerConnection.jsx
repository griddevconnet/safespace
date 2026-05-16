import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { FiLink, FiCopy, FiCheck, FiUserPlus, FiUserMinus, FiX } from 'react-icons/fi';

const GoogleFonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap');
  `}</style>
);

const PartnerConnection = () => {
  const navigate = useNavigate();
  const [myCode, setMyCode] = useState('');
  const [hasPartner, setHasPartner] = useState(false);
  const [partner, setPartner] = useState(null);
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchPartnerInfo();
  }, []);

  const fetchPartnerInfo = async () => {
    try {
      const response = await api.get('/api/users/partner-code/');
      setMyCode(response.data.partner_code);
      setHasPartner(response.data.has_partner);
      setPartner(response.data.partner);
    } catch (err) {
      console.error('Failed to fetch partner info:', err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(myCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await api.post('/api/users/connect/', { partner_code: inputCode });
      setSuccessMsg(response.data.message);
      setInputCode('');
      await fetchPartnerInfo();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to connect with partner');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect from your partner?')) {
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/users/disconnect/');
      setSuccessMsg('Successfully disconnected from partner');
      await fetchPartnerInfo();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to disconnect from partner');
    } finally {
      setLoading(false);
    }
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
      maxWidth: 450,
      background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 28,
      padding: '2.5rem',
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
      marginBottom: '2rem',
    },
    sectionTitle: {
      fontSize: '0.85rem',
      color: '#475569',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '1rem',
    },
    codeDisplay: {
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      padding: '1.5rem',
      borderRadius: 16,
      textAlign: 'center',
      marginBottom: '1rem',
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
    },
    codeText: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: 'white',
      letterSpacing: '0.1em',
      marginBottom: '0.5rem',
    },
    codeLabel: {
      fontSize: '0.85rem',
      color: 'rgba(255,255,255,0.9)',
    },
    copyButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      borderRadius: 12,
      border: '1px solid rgba(59, 130, 246, 0.25)',
      background: 'rgba(255, 255, 255, 0.8)',
      cursor: 'pointer',
      fontSize: '0.9rem',
      color: '#1E3A5F',
      width: '100%',
    },
    input: {
      width: '100%',
      padding: '1rem',
      borderRadius: 16,
      border: '1.5px solid rgba(59, 130, 246, 0.25)',
      background: 'rgba(255, 255, 255, 0.8)',
      fontSize: '1.1rem',
      textAlign: 'center',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: '#1E3A5F',
      outline: 'none',
      marginBottom: '1rem',
    },
    button: {
      width: '100%',
      padding: '1rem',
      borderRadius: 16,
      border: 'none',
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: 'white',
      fontSize: '1rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
    },
    disconnectButton: {
      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
    },
    partnerCard: {
      background: 'rgba(255, 255, 255, 0.8)',
      padding: '1.5rem',
      borderRadius: 16,
      border: '1px solid rgba(59, 130, 246, 0.15)',
      textAlign: 'center',
    },
    partnerName: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#1E3A5F',
      marginBottom: '0.5rem',
    },
    partnerCode: {
      fontSize: '0.9rem',
      color: '#64748B',
    },
    error: {
      background: 'rgba(220,80,80,0.1)',
      border: '1px solid rgba(220,80,80,0.3)',
      color: '#DC2626',
      padding: '0.75rem',
      borderRadius: 12,
      fontSize: '0.85rem',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    success: {
      background: 'rgba(16,185,129,0.1)',
      border: '1px solid rgba(16,185,129,0.3)',
      color: '#059669',
      padding: '0.75rem',
      borderRadius: 12,
      fontSize: '0.85rem',
      textAlign: 'center',
      marginBottom: '1rem',
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
            onClick={() => navigate('/settings')}
            style={styles.backButton}
          >
            ← Back to Settings
          </button>

          <h1 style={styles.title}>
            Partner Connection 💕
          </h1>

          <p style={styles.subtitle}>
            Connect with your partner to share your SafeSpace
          </p>

          {errorMsg && <div style={styles.error}>{errorMsg}</div>}
          {successMsg && <div style={styles.success}>{successMsg}</div>}

          {/* Your Partner Code */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Your Partner Code</div>
            <div style={styles.codeDisplay}>
              <div style={styles.codeText}>{myCode}</div>
              <div style={styles.codeLabel}>Share this code with your partner</div>
            </div>
            <button onClick={handleCopyCode} style={styles.copyButton}>
              {copied ? <FiCheck /> : <FiCopy />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>

          {/* Connect with Partner */}
          {!hasPartner ? (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Connect with Partner</div>
              <form onSubmit={handleConnect}>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(59, 130, 246, 0.25)'}
                  placeholder="ENTER PARTNER CODE"
                  maxLength={8}
                  style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                  <FiUserPlus />
                  {loading ? 'Connecting...' : 'Connect'}
                </button>
              </form>
            </div>
          ) : (
            <div style={styles.section}>
              <div style={styles.sectionTitle}>Your Partner</div>
              <div style={styles.partnerCard}>
                <div style={styles.partnerName}>{partner?.username}</div>
                <div style={styles.partnerCode}>Code: {partner?.partner_code}</div>
              </div>
              <button
                onClick={handleDisconnect}
                style={{ ...styles.button, ...styles.disconnectButton }}
                disabled={loading}
              >
                <FiUserMinus />
                {loading ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default PartnerConnection;
