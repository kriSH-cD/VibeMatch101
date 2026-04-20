import React from 'react';

const AvatarCircle = ({ src, alt = 'Avatar', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  return (
    <div className={`overflow-hidden rounded-full flex-shrink-0 bg-[var(--surface-container-highest)] ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-[var(--on-surface-variant)]">
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default AvatarCircle;
