import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGrinStars, FaSmile, FaMeh, FaFrown, FaDizzy
} from 'react-icons/fa';

interface MoodEntry {
  id: number;
  user: { id: number; username: string };
  mood_value: number;
  mood_label: string;
  timestamp: string;
}

interface MoodCheckerProps {
  onMoodChange: (newMood: MoodEntry) => void;
  myMood: MoodEntry | null;
  partnerId?: string;
}

const moodScale = [
  { value: 0, label: 'Awful', icon: FaDizzy, emoji: '😞', color: '#E87070', bgColor: '#FDE8E8', tagline: 'That sounds really tough' },
  { value: 25, label: 'Bad', icon: FaFrown, emoji: '😔', color: '#E89470', bgColor: '#FEF0E8', tagline: "I hear you, you're not alone" },
  { value: 50, label: 'Okay', icon: FaMeh, emoji: '😐', color: '#D4A855', bgColor: '#FEF6E4', tagline: 'Just getting through it' },
  { value: 75, label: 'Good', icon: FaSmile, emoji: '🙂', color: '#6AAF80', bgColor: '#E8F5EE', tagline: "That's lovely to hear!" },
  { value: 100, label: 'Great', icon: FaGrinStars, emoji: '😄', color: '#9B7DC4', bgColor: '#F0EBF8', tagline: 'You radiate joy today ✨' },
];

const getMoodInfo = (value: number) => {
  if (value < 12.5) return moodScale[0];
  if (value < 37.5) return moodScale[1];
  if (value < 62.5) return moodScale[2];
  if (value < 87.5) return moodScale[3];
  return moodScale[4];
};

const MoodChecker: React.FC<MoodCheckerProps> = ({ onMoodChange, myMood }) => {
  const { username } = useAuth();
  const [sliderValue, setSliderValue] = useState(50);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (myMood) setSliderValue(myMood.mood_value);
  }, [myMood]);

  const handleSubmitMood = async () => {
    setError(null);
    setSaved(false);
    setLoading(true);
    try {
      const mood = getMoodInfo(sliderValue);
      const response = await api.post('/api/moods/', {
        mood_value: sliderValue,
        mood_label: mood.label,
      });
      onMoodChange(response.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Could not save your mood. Try again?');
    } finally {
      setLoading(false);
    }
  };

  const currentMood = getMoodInfo(sliderValue);
  const MoodIcon = currentMood.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-soft {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
        }
        .mood-checker-wrap {
          font-family: 'DM Sans', sans-serif;
          color: #1E3A5F;
          overflow-x: hidden;
          max-width: 100vw;
        }
        .mood-section-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem;
          color: #1E3A5F;
          text-align: center;
          margin: 0 0 0.3rem;
        }
        .mood-name-pill {
          display: inline-block;
          font-family: 'DM Serif Display', serif;
          font-style: italic;
          font-size: clamp(1rem, 4vw, 1.15rem);
          color: #3B82F6;
          background: rgba(59, 130, 246, 0.1);
          padding: 0.15rem 0.7rem;
          border-radius: 20px;
        }
        .mood-big-icon {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1.2rem auto;
          font-size: 2.6rem;
          transition: background 0.4s, color 0.4s;
          animation: pulse-soft 3s ease-in-out infinite;
          flex-shrink: 0;
        }
        .mood-tagline {
          text-align: center;
          font-size: 0.88rem;
          color: #64748B;
          font-style: italic;
          min-height: 1.3em;
          margin-bottom: 1.4rem;
          transition: opacity 0.3s;
        }
        .mood-slider-wrap {
          padding: 1rem 0.5rem;
          background: rgba(239, 246, 255, 0.6);
          border-radius: 18px;
          border: 1px solid rgba(59, 130, 246, 0.15);
          margin-bottom: 1.2rem;
          backdrop-filter: blur(8px);
        }
        .slider-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 0.7rem;
          padding: 0 2px;
        }
        .slider-label-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          font-size: 0.7rem;
          color: #64748B;
          cursor: pointer;
          transition: color 0.2s;
        }
        .slider-label-item.active {
          color: #3B82F6;
          font-weight: 500;
        }
        .slider-label-emoji {
          font-size: 1.1rem;
        }
        .mood-range-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 8px;
          outline: none;
          cursor: pointer;
          border: none;
          background: linear-gradient(to right, #EF4444 0%, #F59E0B 50%, #3B82F6 100%);
        }
        .mood-range-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid #3B82F6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);
          cursor: pointer;
          transition: border-color 0.2s, transform 0.15s;
        }
        .mood-range-input::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        .mood-range-input::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #fff;
          border: 2.5px solid #3B82F6;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.35);
          cursor: pointer;
        }
        .share-btn {
          width: 100%;
          padding: 0.8rem;
          border-radius: 16px;
          border: none;
          background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-height: 48px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
        }
        .share-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35); }
        .share-btn:active:not(:disabled) { transform: translateY(0); }
        .share-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .share-btn.saved-state {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        }
        .last-mood-note {
          text-align: center;
          font-size: 0.8rem;
          color: rgba(100, 116, 139, 0.7);
          margin-top: 0.8rem;
          font-style: italic;
        }
        .error-note {
          background: rgba(220, 80, 80, 0.08);
          border: 1px solid rgba(220, 80, 80, 0.18);
          color: #DC2626;
          padding: 0.6rem 0.9rem;
          border-radius: 10px;
          font-size: 0.83rem;
          text-align: center;
          margin-bottom: 0.8rem;
        }
        .mini-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .mood-value-display {
          text-align: center;
          font-size: 0.78rem;
          color: #64748B;
          margin-top: 0.4rem;
        }
      `}</style>

      <div className="mood-checker-wrap">
        <p className="mood-section-title">
          How are you feeling, <span className="mood-name-pill">{username}</span>?
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentMood.label}
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.75, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="mood-big-icon"
            style={{ background: currentMood.bgColor, color: currentMood.color }}
          >
            <MoodIcon />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={currentMood.tagline}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="mood-tagline"
          >
            {currentMood.tagline}
          </motion.p>
        </AnimatePresence>

        <div className="mood-slider-wrap">
          <input
            type="range"
            className="mood-range-input"
            min={0}
            max={100}
            step={1}
            value={sliderValue}
            onChange={(e) => setSliderValue(parseInt(e.target.value))}
            aria-label="Mood level"
          />
          <div className="slider-labels">
            {moodScale.map((m) => (
              <div
                key={m.label}
                className={`slider-label-item${currentMood.label === m.label ? ' active' : ''}`}
                onClick={() => setSliderValue(m.value)}
              >
                <span className="slider-label-emoji">{m.emoji}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
          <p className="mood-value-display">{sliderValue} / 100</p>
        </div>

        {error && <p className="error-note">{error}</p>}

        <button
          className={`share-btn${saved ? ' saved-state' : ''}`}
          onClick={handleSubmitMood}
          disabled={loading}
        >
          {loading ? (
            <span className="mini-spinner" />
          ) : saved ? (
            '✓ Mood shared!'
          ) : (
            <>❤ Share my mood</>
          )}
        </button>

        {myMood && (
          <p className="last-mood-note">
            Last shared: {myMood.mood_label} · {new Date(myMood.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        )}
      </div>
    </>
  );
};

export default MoodChecker;