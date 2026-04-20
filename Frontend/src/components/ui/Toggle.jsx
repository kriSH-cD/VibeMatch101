import React from 'react';

const Toggle = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${className}`}>
      {label && <span className="text-[var(--on-surface)]">{label}</span>}
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <div className={`block w-14 h-8 rounded-full transition-colors ${
          checked ? 'bg-[var(--primary)]' : 'bg-[var(--surface-container-highest)]'
        }`}></div>
        <div className={`absolute left-1 top-1 bg-[var(--on-surface)] w-6 h-6 rounded-full transition-transform ${
          checked ? 'transform translate-x-6' : ''
        }`}></div>
      </div>
    </label>
  );
};

export default Toggle;
