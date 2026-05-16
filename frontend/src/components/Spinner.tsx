import React from 'react';

const Spinner: React.FC<{ size?: number; color?: string }> = ({
  size = 36,
  color = '#C47A8A',
}) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
    }}
  >
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: `2.5px solid rgba(196, 122, 138, 0.2)`,
        borderTopColor: color,
        animation: 'safespace-spin 0.75s linear infinite',
      }}
    />
    <style>{`
      @keyframes safespace-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Spinner;