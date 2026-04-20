import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="relative flex justify-center items-center">
      <div className="w-12 h-12 rounded-full border-4 border-[var(--surface-container-high)] absolute"></div>
      <div className="w-12 h-12 rounded-full border-4 border-[var(--primary)] border-t-transparent animate-spin relative z-10 progress-glow"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen w-full bg-[var(--surface-container-lowest)] flex flex-col justify-center items-center">
        {spinner}
        <p className="mt-6 font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] animate-pulse tracking-widest text-sm uppercase">Loading Vibe...</p>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
