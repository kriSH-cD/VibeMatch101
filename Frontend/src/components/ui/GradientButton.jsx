import React from 'react';

const GradientButton = ({ children, onClick, className = '', type = 'button', disabled = false, ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`gradient-primary text-[var(--on-primary)] font-bold py-3 px-6 rounded-full w-full 
        hover:scale-[1.05] hover:glow-primary-interactive disabled:opacity-50 disabled:hover:scale-100 disabled:hover:box-shadow-none
        transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default GradientButton;
