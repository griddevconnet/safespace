import React, { useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div
      style={{
        width: '20px',
        height: '20px',
        border: '2px solid rgba(255,255,255,0.4)',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  </div>
);

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await api.post('/api/users/login/', { username, password });
      } else {
        await api.post('/api/users/register/', { username, email, password });
        response = await api.post('/api/users/login/', { username, password });
      }
      login(
        response.data.token,
        String(response.data.user_id),
        response.data.username,
        response.data.partner_id ? String(response.data.partner_id) : undefined
      );
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        .auth-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%);
          font-family: 'DM Sans', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .blob {
          position: absolute;
          border-radius: 50%;
          opacity: 0.12;
          pointer-events: none;
        }
        .blob-1 {
          width: 340px;
          height: 340px;
          background: #3B82F6;
          top: -80px;
          left: -80px;
          animation: float 8s ease-in-out infinite;
        }
        .blob-2 {
          width: 280px;
          height: 280px;
          background: #60A5FA;
          bottom: -60px;
          right: -60px;
          animation: float 10s ease-in-out infinite reverse;
        }
        .auth-card {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 28px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          padding: 2.5rem 2rem;
          position: relative;
          z-index: 1;
          box-shadow: 0 8px 32px rgba(59, 130, 246, 0.12);
        }
        .auth-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem;
          color: #3B82F6;
          letter-spacing: 0.04em;
          text-align: center;
          margin-bottom: 0.4rem;
          font-style: italic;
        }
        .auth-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 7vw, 2.6rem);
          color: #1E3A5F;
          text-align: center;
          margin: 0 0 0.35rem;
          line-height: 1.1;
        }
        .auth-subtitle {
          font-size: 0.9rem;
          color: #64748B;
          text-align: center;
          margin-bottom: 2rem;
          font-weight: 300;
          letter-spacing: 0.01em;
        }
        .auth-error {
          background: rgba(220, 80, 80, 0.08);
          border: 1px solid rgba(220, 80, 80, 0.2);
          color: #DC2626;
          padding: 0.7rem 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          text-align: center;
          margin-bottom: 1.2rem;
        }
        .field-group {
          margin-bottom: 1.1rem;
        }
        .field-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #475569;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 0.45rem;
        }
        .field-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem;
          border-radius: 14px;
          border: 1.5px solid rgba(59, 130, 246, 0.25);
          background: rgba(255, 255, 255, 0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #1E3A5F;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .field-input:focus {
          border-color: #3B82F6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .field-input::placeholder {
          color: rgba(100, 116, 139, 0.5);
        }
        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          margin-top: 0.5rem;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }
        .divider {
          text-align: center;
          margin: 1.5rem 0 1.2rem;
          position: relative;
        }
        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(59, 130, 246, 0.15);
        }
        .divider span {
          position: relative;
          background: rgba(255,255,255,0.75);
          padding: 0 0.75rem;
          font-size: 0.8rem;
          color: #64748B;
        }
        .toggle-text {
          text-align: center;
          font-size: 0.88rem;
          color: #64748B;
        }
        .toggle-btn {
          background: none;
          border: none;
          color: #3B82F6;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
          transition: color 0.2s;
        }
        .toggle-btn:hover { color: #2563EB; }
        .hearts {
          text-align: center;
          font-size: 1.2rem;
          margin-bottom: 1.2rem;
          opacity: 0.6;
          letter-spacing: 0.3em;
        }
        @media (max-width: 480px) {
          .auth-card {
            padding: 2rem 1.4rem;
            border-radius: 22px;
          }
        }
      `}</style>

      <div className="auth-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />

        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="auth-card"
          >
            <p className="auth-logo">✦ SafeSpace ✦</p>
            <h1 className="auth-title">
              {isLogin ? 'Welcome back' : 'Join us'}
            </h1>
            <p className="auth-subtitle">
              {isLogin
                ? 'Your safe place is waiting for you'
                : 'A space made just for you'}
            </p>

            <div className="hearts">♥ ♥ ♥</div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="auth-error"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label" htmlFor="username">Username</label>
                <input
                  className="field-input"
                  type="text"
                  id="username"
                  placeholder="your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                    className="field-group"
                  >
                    <label className="field-label" htmlFor="email">Email <span style={{ fontWeight: 300, textTransform: 'none', fontSize: '0.75rem' }}>(optional)</span></label>
                    <input
                      className="field-input"
                      type="email"
                      id="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="field-group" style={{ marginBottom: '1.5rem' }}>
                <label className="field-label" htmlFor="password">Password</label>
                <input
                  className="field-input"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <Spinner /> : (isLogin ? 'Enter SafeSpace' : 'Create my space')}
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <p className="toggle-text">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                className="toggle-btn"
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                type="button"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default Auth;