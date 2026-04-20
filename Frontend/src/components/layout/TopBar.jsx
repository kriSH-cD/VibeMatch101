import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const TopBar = ({ title, showBack = false, rightElement = null }) => {
  const navigate = useNavigate();
  
  return (
    <div className="sticky top-0 z-40 bg-[var(--surface-container-lowest)]/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-[var(--surface-container-high)]">
      <div className="flex items-center">
        {showBack && (
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 p-2 rounded-full hover:bg-[var(--surface-container-low)] transition-colors text-[var(--on-surface)]"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-xl font-bold text-[var(--on-surface)] m-0">{title}</h1>
      </div>
      {rightElement && (
        <div>{rightElement}</div>
      )}
    </div>
  );
};

export default TopBar;
