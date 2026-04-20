import React from 'react';

const GlassCard = ({ children, className = '', onClick, ...props }) => {
  return (
    <div 
      className={`glass-effect rounded-2xl p-4 sm:p-6 ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:glow-primary' : ''} ${className}`}
      onClick={onClick}
      style={{ transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
