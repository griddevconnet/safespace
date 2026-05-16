import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   Gentle Word Puzzle Data
───────────────────────────────────────────── */

const WORD_SETS = {
  reflection: [
    {
      word: 'BALANCE',
      message: 'Life feels lighter when things are balanced.',
    },
    {
      word: 'PURPOSE',
      message: 'Not every purpose reveals itself immediately.',
    },
    {
      word: 'JOURNEY',
      message: 'Growth happens during the process.',
    },
    {
      word: 'BECOME',
      message: 'You are always becoming someone new.',
    },
    {
      word: 'COURAGE',
      message: 'Being afraid and continuing anyway is courage.',
    },
    {
      word: 'PATIENCE',
      message: 'Some things bloom slowly.',
    },
    {
      word: 'CLARITY',
      message: 'Confusion does not last forever.',
    },
    {
      word: 'RESILIENT',
      message: 'You have survived difficult moments before.',
    },
    {
      word: 'PERSIST',
      message: 'Small steps still move you forward.',
    },
    {
      word: 'BREATHE',
      message: 'You do not need to carry everything at once.',
    },
  ],

  emotions: [
    {
      word: 'MELANCHOLY',
      message: 'A quiet sadness can still hold beauty.',
    },
    {
      word: 'SERENITY',
      message: 'Peace often arrives softly.',
    },
    {
      word: 'EUPHORIA',
      message: 'Joy can feel overwhelming in beautiful ways.',
    },
    {
      word: 'NOSTALGIA',
      message: 'Memories have a way of revisiting us.',
    },
    {
      word: 'EMPATHY',
      message: 'Understanding others is a powerful gift.',
    },
    {
      word: 'AFFECTION',
      message: 'Love can exist in small gestures.',
    },
    {
      word: 'VULNERABLE',
      message: 'Opening up is a form of strength.',
    },
    {
      word: 'TRANQUIL',
      message: 'Calmness is valuable.',
    },
    {
      word: 'TENDERNESS',
      message: 'Softness is not weakness.',
    },
    {
      word: 'COMPASSION',
      message: 'Kindness changes people quietly.',
    },
  ],

  wisdom: [
    {
      word: 'DISCIPLINE',
      message: 'Consistency builds powerful results.',
    },
    {
      word: 'PERSPECTIVE',
      message: 'Sometimes the view changes everything.',
    },
    {
      word: 'AMBITION',
      message: 'Dreams deserve effort.',
    },
    {
      word: 'GRATITUDE',
      message: 'Small blessings still matter.',
    },
    {
      word: 'MINDFULNESS',
      message: 'Being present is a skill.',
    },
    {
      word: 'INTENTION',
      message: 'Move through life deliberately.',
    },
    {
      word: 'FORESIGHT',
      message: 'Thinking ahead creates stability.',
    },
    {
      word: 'INTEGRITY',
      message: 'Character matters in quiet moments.',
    },
    {
      word: 'ADAPTABLE',
      message: 'Flexibility is strength too.',
    },
    {
      word: 'WISDOM',
      message: 'Experience teaches slowly.',
    },
  ],

  inspiration: [
    {
      word: 'RADIANT',
      message: 'Your energy can brighten spaces.',
    },
    {
      word: 'LIMITLESS',
      message: 'Growth rarely has a fixed ceiling.',
    },
    {
      word: 'CREATE',
      message: 'Your ideas deserve existence.',
    },
    {
      word: 'EXPLORE',
      message: 'Curiosity opens new worlds.',
    },
    {
      word: 'DISCOVER',
      message: 'There is always more to learn.',
    },
    {
      word: 'VISIONARY',
      message: 'Big ideas begin as small thoughts.',
    },
    {
      word: 'INSPIRE',
      message: 'People remember how you make them feel.',
    },
    {
      word: 'IMAGINE',
      message: 'Creativity expands possibilities.',
    },
    {
      word: 'ASCEND',
      message: 'Growth often feels uncomfortable first.',
    },
    {
      word: 'EVOLVE',
      message: 'You are not meant to stay the same forever.',
    },
  ],

  rareWords: [
    {
      word: 'EUNOIA',
      message: 'Beautiful thinking creates beautiful living.',
    },
    {
      word: 'SOLACE',
      message: 'Comfort can arrive quietly.',
    },
    {
      word: 'LIMERENCE',
      message: 'Some emotions feel consuming.',
    },
    {
      word: 'EPHEMERAL',
      message: 'Beautiful things are sometimes temporary.',
    },
    {
      word: 'LABYRINTH',
      message: 'Life can feel complex and winding.',
    },
    {
      word: 'AURORA',
      message: 'Light appears even after darkness.',
    },
    {
      word: 'ETHEREAL',
      message: 'Some moments feel almost unreal.',
    },
    {
      word: 'HALCYON',
      message: 'Peaceful times are worth remembering.',
    },
    {
      word: 'LUMINOUS',
      message: 'You carry your own light.',
    },
    {
      word: 'INEFFABLE',
      message: 'Some feelings are too deep for words.',
    },
  ],
};

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

const shuffleWord = (word) => {
  return word
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

const GentleWordsPuzzle = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState('calm');
  const [started, setStarted] = useState(false);

  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');

  const [message, setMessage] = useState('');
  const [completed, setCompleted] = useState(false);

  /* ─────────────────────────────────────────────
     Start Game
  ───────────────────────────────────────────── */

  const startGame = () => {
    const selectedWords = WORD_SETS[mood];

    setWords(selectedWords);
    setCurrentIndex(0);

    setScrambledWord(shuffleWord(selectedWords[0].word));

    setMessage('');
    setUserInput('');

    setCompleted(false);
    setStarted(true);
  };

  /* ─────────────────────────────────────────────
     Check Answer
  ───────────────────────────────────────────── */

  const checkAnswer = () => {
    const currentWord = words[currentIndex];

    if (
      userInput.trim().toUpperCase() === currentWord.word.toUpperCase()
    ) {
      setMessage(currentWord.message);

      setTimeout(() => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= words.length) {
          setCompleted(true);
          return;
        }

        setCurrentIndex(nextIndex);

        setScrambledWord(
          shuffleWord(words[nextIndex].word)
        );

        setUserInput('');
        setMessage('');
      }, 2500);
    }
  };

  /* ─────────────────────────────────────────────
     Styles
  ───────────────────────────────────────────── */

  const styles = {
    root: {
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%)',
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
      lineHeight: 1.6,
    },

    moodButton: (active) => ({
      padding: '0.8rem 1rem',
      borderRadius: 16,
      border: active
        ? '2px solid #3B82F6'
        : '1px solid rgba(59, 130, 246, 0.25)',
      background: active
        ? 'rgba(59, 130, 246, 0.1)'
        : 'rgba(255, 255, 255, 0.6)',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      color: active ? '#3B82F6' : '#64748B',
      fontWeight: 500,
    }),

    startButton: {
      width: '100%',
      marginTop: '1.5rem',
      padding: '1rem',
      borderRadius: 18,
      border: 'none',
      background:
        'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: 'white',
      fontSize: '1rem',
      cursor: 'pointer',
      fontWeight: 600,
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
    },

    wordBox: {
      background: 'rgba(255, 255, 255, 0.6)',
      borderRadius: 20,
      padding: '1.5rem',
      textAlign: 'center',
      marginBottom: '1.5rem',
      border: '1px solid rgba(59, 130, 246, 0.15)',
      backdropFilter: 'blur(8px)',
    },

    scrambledWord: {
      fontSize: '2rem',
      letterSpacing: '0.35rem',
      color: '#3B82F6',
      fontWeight: 700,
    },

    input: {
      width: '100%',
      padding: '1rem',
      borderRadius: 16,
      border: '1px solid rgba(59, 130, 246, 0.25)',
      outline: 'none',
      fontSize: '1rem',
      marginBottom: '1rem',
      boxSizing: 'border-box',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#1E3A5F',
    },

    solveButton: {
      width: '100%',
      padding: '1rem',
      borderRadius: 16,
      border: 'none',
      background:
        'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: 'white',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 600,
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
    },

    messageBox: {
      marginTop: '1.5rem',
      padding: '1rem',
      borderRadius: 18,
      background: 'rgba(59, 130, 246, 0.08)',
      textAlign: 'center',
      color: '#1E3A5F',
      lineHeight: 1.6,
      border: '1px solid rgba(59, 130, 246, 0.15)',
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
  };

  /* ─────────────────────────────────────────────
     MENU SCREEN
  ───────────────────────────────────────────── */

  if (!started) {
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
              Gentle Words ✨
            </h1>

            <p style={styles.subtitle}>
              Small calming puzzles made to feel soft,
              peaceful, and emotionally safe.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              {Object.keys(WORD_SETS).map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  style={styles.moodButton(mood === m)}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              style={styles.startButton}
            >
              Begin Gentle Puzzle 🌙
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────────────────────
     COMPLETE SCREEN
  ───────────────────────────────────────────── */

  if (completed) {
    return (
      <>
        <GoogleFonts />

        <div style={styles.root}>
          <motion.div
            style={styles.card}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: '4rem',
                marginBottom: '1rem',
              }}
            >
              🌷
            </div>

            <h1 style={styles.title}>
              A Gentle Moment Unlocked
            </h1>

            <p style={styles.subtitle}>
              Thank you for spending a quiet moment here.
            </p>

            <button
              onClick={() => {
                setStarted(false);
              }}
              style={styles.startButton}
            >
              Return Home
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  /* ─────────────────────────────────────────────
     GAME SCREEN
  ───────────────────────────────────────────── */

  return (
    <>
      <GoogleFonts />

      <div style={styles.root}>
        <motion.div
          style={styles.card}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => navigate('/')}
            style={styles.backButton}
          >
            ← Back to Dashboard
          </button>

          <div style={styles.wordBox}>
            <div style={styles.scrambledWord}>
              {scrambledWord}
            </div>
          </div>

          <input
            type="text"
            placeholder="Unscramble the word..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            style={styles.input}
          />

          <button
            onClick={checkAnswer}
            style={styles.solveButton}
          >
            Unlock Message ✨
          </button>

          <AnimatePresence>
            {message && (
              <motion.div
                style={styles.messageBox}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <div
            style={{
              marginTop: '1.5rem',
              textAlign: 'center',
              color: '#B194A0',
              fontSize: '0.85rem',
            }}
          >
            {currentIndex + 1} / {words.length}
          </div>
        </motion.div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   Google Fonts
───────────────────────────────────────────── */

const GoogleFonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap');
  `}</style>
);

export default GentleWordsPuzzle;