import React from 'react';
import { Plus } from 'lucide-react';

const FloatingActionButton = ({ onClick, icon = <Plus size={24} />, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center
        bg-[var(--primary)] text-[var(--on-primary)] shadow-lg glow-primary-interactive
        hover:scale-110 transition-all duration-200 z-30 ${className}`}
    >
      {icon}
    </button>
  );
};

export default FloatingActionButton;
