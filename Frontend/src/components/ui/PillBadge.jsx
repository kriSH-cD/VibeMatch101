import React from 'react';

const PillBadge = ({ children, active, className = '', onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap
        ${active ? 'bg-[var(--secondary-container)] text-[var(--on-secondary-container)]' : 'bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]'}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
};

export default PillBadge;
