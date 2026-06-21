'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'var(--amber)',
  text 
}) => {
  const sizeMap = {
    sm: '16px',
    md: '24px',
    lg: '32px'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem'
    }}>
      <div 
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          border: `2px solid var(--cream-deeper)`,
          borderTop: `2px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}
      />
      {text && (
        <span style={{
          fontSize: '0.875rem',
          color: 'var(--muted)',
          textAlign: 'center'
        }}>
          {text}
        </span>
      )}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;