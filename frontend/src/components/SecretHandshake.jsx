import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   Fonts
───────────────────────────────────────────── */
const GoogleFonts = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');
    @keyframes ss-spin { to { transform: rotate(360deg); } }
    @keyframes ss-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
    @keyframes ss-pop { 0%{transform:scale(1)} 40%{transform:scale(1.22)} 100%{transform:scale(1)} }
    @keyframes ss-shake { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-8deg)} 60%{transform:rotate(8deg)} }
  `}</style>
);

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const EMOJI_CATEGORIES = [
  {
    label: 'Love',
    icon: '💕',
    emojis: ['💕','❤️','💖','💗','💓','💞','💘','💝','💌','🥰','😘','💋','🫀','♥️','🩷'],
  },
  {
    label: 'Nature',
    icon: '🌸',
    emojis: ['🌸','🌺','🌻','🌹','🌷','🍀','🌈','☀️','🌙','⭐','✨','💫','🦋','🌊','🔥'],
  },
  {
    label: 'Gestures',
    icon: '🤝',
    emojis: ['🤝','👋','🙌','🤲','👐','🙏','🫶','🤗','👏','✌️','🤞','🫂','💪','🤙','👌'],
  },
  {
    label: 'Animals',
    icon: '🦊',
    emojis: ['🦊','🐱','🐶','🐰','🐻','🐼','🐨','🦁','🐯','🦄','🐝','🦢','🦩','🐬','🦋'],
  },
  {
    label: 'Magic',
    icon: '✨',
    emojis: ['✨','⭐','🌟','💫','🎭','🎨','🎯','🎵','🎶','🎹','🪄','🔮','🌙','💎','🎀'],
  },
];


/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

/* Step dot indicator */
const StepDots = ({ total, max }) => (
  <div style={{ display: 'flex', gap: 6, justifyContent: 'center', margin: '0.5rem 0' }}>
    {Array.from({ length: max }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i < total ? 24 : 10,
          height: 10,
          borderRadius: 5,
          background: i < total
            ? 'linear-gradient(90deg, #D4849A, #B87090)'
            : 'rgba(196,150,160,0.2)',
          transition: 'all 0.3s ease',
        }}
      />
    ))}
  </div>
);

/* Animated sequence display */
const HandshakeDisplay = ({ steps, empty }) => {
  const [activeIdx, setActiveIdx] = useState(-1);

  const playSequence = () => {
    if (steps.length === 0) return;
    let i = 0;
    const tick = () => {
      setActiveIdx(i);
      i++;
      if (i < steps.length) setTimeout(tick, 600);
      else setTimeout(() => setActiveIdx(-1), 700);
    };
    tick();
  };

  if (steps.length === 0) {
    return (
      <div style={{
        minHeight: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(155,122,133,0.5)',
        fontSize: '0.9rem',
        fontStyle: 'italic',
      }}>
        {empty}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -20 }}
            animate={{
              scale: activeIdx === i ? 1.3 : 1,
              rotate: 0,
              filter: activeIdx >= 0 && activeIdx !== i ? 'brightness(0.6)' : 'brightness(1)',
            }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 22 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
          >
            <span style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)', lineHeight: 1 }}>{step.emoji}</span>
            {step.meaning && (
              <span style={{
                fontSize: '0.65rem',
                color: '#9B7A85',
                fontStyle: 'italic',
                maxWidth: 60,
                textAlign: 'center',
                lineHeight: 1.2,
              }}>
                {step.meaning}
              </span>
            )}
          </motion.div>
        ))}
      </div>
      {steps.length > 1 && (
        <button
          onClick={playSequence}
          style={{
            padding: '0.3rem 0.9rem',
            borderRadius: 16,
            border: '1.5px solid rgba(196,150,160,0.35)',
            background: 'transparent',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.75rem',
            color: '#C47A8A',
            cursor: 'pointer',
          }}
        >
          ▶ Replay sequence
        </button>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const SecretHandshake = () => {
  const navigate = useNavigate();
  const MAX_STEPS = 6;

  const [handshake, setHandshake] = useState([]);
  const [partnerHandshake] = useState([]); // populated via API/websocket
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [saved, setSaved] = useState(false);
  const [focusMeaningIdx, setFocusMeaningIdx] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('secretHandshake');
      if (raw) setHandshake(JSON.parse(raw));
    } catch { setHandshake([]); }
  }, []);

  const startEditing = () => {
    setDraft([...handshake]);
    setIsEditing(true);
    setSaved(false);
  };

  const addEmoji = (emoji) => {
    if (draft.length >= MAX_STEPS) return;
    setDraft(d => [...d, { emoji, meaning: '' }]);
  };

  const removeStep = (idx) => {
    setDraft(d => d.filter((_, i) => i !== idx));
  };

  const updateMeaning = (idx, meaning) => {
    setDraft(d => d.map((s, i) => i === idx ? { ...s, meaning } : s));
  };

  const handleSave = () => {
    localStorage.setItem('secretHandshake', JSON.stringify(draft));
    setHandshake(draft);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setDraft([]);
    setIsEditing(false);
  };

  /* ── Styles ─────────────────────────────── */
  const S = {
    root: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #F0F8FF 50%, #E0F2FE 100%)',
      fontFamily: '"DM Sans", sans-serif',
      color: '#1E3A5F',
      paddingBottom: '3rem',
    },
    topBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 1.25rem 0.8rem',
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      boxShadow: '0 4px 30px rgba(59, 130, 246, 0.08)',
    },
    backBtn: {
      padding: '0.35rem 0.8rem',
      borderRadius: 20,
      border: '1.5px solid rgba(59, 130, 246, 0.3)',
      background: 'transparent',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.82rem',
      color: '#64748B',
      cursor: 'pointer',
    },
    logo: {
      fontFamily: '"DM Serif Display", serif',
      fontStyle: 'italic',
      fontSize: '0.95rem',
      color: '#3B82F6',
    },
    inner: {
      maxWidth: 480,
      margin: '0 auto',
      padding: '1.5rem 1rem 0',
    },
    pageTitle: {
      fontFamily: '"DM Serif Display", serif',
      fontSize: 'clamp(1.7rem, 6vw, 2.3rem)',
      color: '#1E3A5F',
      margin: '0 0 0.3rem',
      textAlign: 'center',
    },
    pageSubtitle: {
      fontSize: '0.88rem',
      color: '#64748B',
      textAlign: 'center',
      fontStyle: 'italic',
      marginBottom: '1.5rem',
      lineHeight: 1.6,
    },
    card: {
      background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 24,
      border: '1px solid rgba(59, 130, 246, 0.15)',
      padding: '1.4rem 1.2rem',
      marginBottom: '1rem',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
    },
    sectionLabel: {
      fontSize: '0.7rem',
      fontWeight: 500,
      color: '#475569',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginBottom: '0.75rem',
    },
    primaryBtn: {
      width: '100%',
      padding: '0.82rem',
      borderRadius: 16,
      border: 'none',
      background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      color: '#fff',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.92rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)',
    },
    secondaryBtn: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: 16,
      border: '1.5px solid rgba(59, 130, 246, 0.3)',
      background: 'transparent',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.88rem',
      color: '#64748B',
      cursor: 'pointer',
    },
    catTab: (active) => ({
      padding: '0.35rem 0.75rem',
      borderRadius: 20,
      border: active ? '1.5px solid #3B82F6' : '1.5px solid rgba(59, 130, 246, 0.2)',
      background: active ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.6)',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.78rem',
      color: active ? '#3B82F6' : '#64748B',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    }),
    emojiBtn: (disabled) => ({
      fontSize: 'clamp(1.3rem, 5vw, 1.7rem)',
      padding: '0.45rem',
      borderRadius: 12,
      border: '1px solid rgba(59, 130, 246, 0.2)',
      background: 'rgba(255, 255, 255, 0.8)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'transform 0.15s, background 0.15s',
      opacity: disabled ? 0.4 : 1,
      lineHeight: 1,
    }),
    stepItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: '0.7rem 0.85rem',
      background: 'rgba(239, 246, 255, 0.6)',
      borderRadius: 14,
      border: '1px solid rgba(59, 130, 246, 0.15)',
      marginBottom: 8,
    },
    stepNumber: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      color: '#fff',
      fontSize: '0.65rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 3,
    },
    stepEmoji: {
      fontSize: '1.5rem',
      lineHeight: 1,
      flexShrink: 0,
    },
    stepMeaningInput: {
      flex: 1,
      border: 'none',
      background: 'transparent',
      fontFamily: '"DM Sans", sans-serif',
      fontSize: '0.83rem',
      color: '#1E3A5F',
      outline: 'none',
      padding: '0.1rem 0',
      borderBottom: '1px dashed rgba(59, 130, 246, 0.3)',
      width: '100%',
    },
    removeBtn: {
      width: 22,
      height: 22,
      borderRadius: '50%',
      background: 'rgba(220, 80, 80, 0.1)',
      border: 'none',
      color: '#DC2626',
      fontSize: '0.75rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: 3,
    },
  };

  return (
    <>
      <GoogleFonts />
      <div style={S.root}>
        {/* Top bar */}
        <div style={S.topBar}>
          <button onClick={() => navigate('/')} style={S.backBtn}>← Dashboard</button>
          <span style={S.logo}>✦ SafeSpace</span>
          <span style={{ fontSize: '0.8rem', color: '#9B7A85' }}>🤝</span>
        </div>

        <div style={S.inner}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '1.4rem' }}
          >
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ fontSize: '2.8rem', marginBottom: '0.4rem', display: 'inline-block' }}
            >
              🤝
            </motion.div>
            <h1 style={S.pageTitle}>Secret Handshake</h1>
            <p style={S.pageSubtitle}>
              Your private ritual — a sequence only the two of you share
            </p>
          </motion.div>

          {/* Saved notice */}
          <AnimatePresence>
            {saved && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  background: '#E8F5EE',
                  border: '1.5px solid rgba(106,175,128,0.35)',
                  color: '#3A7A55',
                  borderRadius: 14,
                  padding: '0.6rem 1rem',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  marginBottom: '0.9rem',
                }}
              >
                ✓ Your handshake is saved!
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── VIEW MODE ─────────────────── */}
          {!isEditing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* My handshake */}
              <div style={S.card}>
                <p style={S.sectionLabel}>My handshake</p>
                <div style={{
                  minHeight: 90,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,245,240,0.6)',
                  borderRadius: 16,
                  border: '1px dashed rgba(196,150,160,0.3)',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}>
                  <HandshakeDisplay steps={handshake} empty="No handshake created yet" />
                </div>
                {handshake.length > 0 && (
                  <StepDots total={handshake.length} max={MAX_STEPS} />
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                  <button
                    onClick={startEditing}
                    style={{ ...S.primaryBtn, flex: 1 }}
                  >
                    {handshake.length > 0 ? '✎ Edit handshake' : '+ Create handshake'}
                  </button>
                </div>
              </div>

              {/* Partner handshake */}
              <div style={S.card}>
                <p style={S.sectionLabel}>Partner's handshake</p>
                <div style={{
                  minHeight: 90,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(245,240,255,0.5)',
                  borderRadius: 16,
                  border: '1px dashed rgba(180,160,210,0.3)',
                  padding: '1rem',
                }}>
                  <HandshakeDisplay
                    steps={partnerHandshake}
                    empty="Waiting for your partner… 🕊️"
                  />
                </div>
              </div>

              {/* Tip card */}
              <div style={{
                background: 'rgba(255,255,255,0.6)',
                borderRadius: 16,
                border: '1px solid rgba(196,150,160,0.18)',
                padding: '0.9rem 1.1rem',
              }}>
                <p style={{ fontSize: '0.78rem', color: '#9B7A85', margin: 0, lineHeight: 1.65 }}>
                  <strong style={{ color: '#7A5565' }}>How it works:</strong> Build a secret emoji sequence — up to {MAX_STEPS} steps — with a meaning for each one. Use it as your special greeting ritual! ✨
                </p>
              </div>
            </motion.div>
          )}

          {/* ── EDIT MODE ─────────────────── */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Current steps */}
              <div style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                  <p style={{ ...S.sectionLabel, marginBottom: 0 }}>Your sequence</p>
                  <span style={{ fontSize: '0.75rem', color: '#9B7A85' }}>
                    {draft.length}/{MAX_STEPS} steps
                  </span>
                </div>

                <StepDots total={draft.length} max={MAX_STEPS} />

                <div style={{ marginTop: '0.8rem' }}>
                  <AnimatePresence>
                    {draft.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                          textAlign: 'center',
                          padding: '1.2rem',
                          color: 'rgba(155,122,133,0.5)',
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                        }}
                      >
                        Tap an emoji below to add your first step
                      </motion.div>
                    )}
                    {draft.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 12, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={S.stepItem}
                      >
                        <div style={S.stepNumber}>{i + 1}</div>
                        <span style={S.stepEmoji}>{step.emoji}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <input
                            type="text"
                            placeholder="What this step means…"
                            value={step.meaning}
                            onChange={e => updateMeaning(i, e.target.value)}
                            onFocus={() => setFocusMeaningIdx(i)}
                            onBlur={() => setFocusMeaningIdx(null)}
                            style={{
                              ...S.stepMeaningInput,
                              borderBottomColor: focusMeaningIdx === i ? '#C47A8A' : 'rgba(196,150,160,0.35)',
                            }}
                          />
                        </div>
                        <button onClick={() => removeStep(i)} style={S.removeBtn} aria-label="Remove step">×</button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Emoji picker */}
              <div style={S.card}>
                <p style={{ ...S.sectionLabel, marginBottom: '0.75rem' }}>Add an emoji step</p>

                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: '0.9rem', scrollbarWidth: 'none' }}>
                  {EMOJI_CATEGORIES.map((cat, i) => (
                    <button
                      key={cat.label}
                      onClick={() => setActiveCategory(i)}
                      style={S.catTab(activeCategory === i)}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Emoji grid */}
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: 8,
                  }}
                >
                  {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji, i) => (
                    <motion.button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      disabled={draft.length >= MAX_STEPS}
                      style={S.emojiBtn(draft.length >= MAX_STEPS)}
                      whileHover={draft.length < MAX_STEPS ? { scale: 1.15, background: 'rgba(255,235,225,0.95)' } : {}}
                      whileTap={draft.length < MAX_STEPS ? { scale: 0.9 } : {}}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </motion.div>

                {draft.length >= MAX_STEPS && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', fontSize: '0.78rem', color: '#C47A8A', marginTop: '0.7rem', fontStyle: 'italic' }}
                  >
                    Max {MAX_STEPS} steps reached ✦
                  </motion.p>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <motion.button
                  whileHover={{ opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={draft.length === 0}
                  style={{
                    ...S.primaryBtn,
                    flex: 2,
                    opacity: draft.length === 0 ? 0.5 : 1,
                    cursor: draft.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Save handshake ✦
                </motion.button>
                <button onClick={handleCancel} style={{ ...S.secondaryBtn, flex: 1 }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default SecretHandshake;