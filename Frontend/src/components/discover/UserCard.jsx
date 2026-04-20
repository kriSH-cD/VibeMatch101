import React from 'react';

const UserCard = ({ user, onClick }) => {
  return (
    <div 
      className="group relative aspect-[3/4] rounded-lg overflow-hidden glass-card transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] cursor-pointer"
      onClick={onClick}
    >
      <img 
        alt={user.name} 
        className="absolute inset-0 w-full h-[65%] object-cover" 
        src={user.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAllP4zh37BkPDl5Q3Dncjw2tMaYTcSsk7I9aYsL8VH1eQ-UIW5gC8FrNuMzDvJ6uVRmf-7aUDldLcyE1mMC60RHs2w6NkiQ8Rk7nTKBKWwBd0PwxVH6FeALwd91k16GrNUJNk-Avssx6IEKzQLa2vcr46fdROy0KtbZBMGBKQgnSowm0RGQs0Kjv41SJC_tpHU6BhRpJhPAOyKFgKYNcwSSdyrkCA4Z34UFS6xTDZ40tEx-ieC5eHu-CxVD5zueQRzm0jz0Gd65kA'}
      />
      {user.hostelBadge && (
        <div className="absolute top-3 right-3 z-10 bg-[var(--tertiary)]/20 backdrop-blur-md px-2 py-1 rounded-full border border-[var(--tertiary)]/30">
          <span className="text-[10px] font-bold text-[var(--tertiary)] uppercase tracking-tighter">{user.hostelBadge}</span>
        </div>
      )}
      <div className="absolute bottom-0 w-full h-[35%] p-4 flex flex-col justify-center gap-1 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="font-headline font-bold text-lg leading-tight text-[var(--on-surface)]">{user.name}</span>
          <div className="px-2 py-0.5 rounded-full bg-[var(--primary-container)]/20 text-[var(--primary)] text-[10px] font-bold uppercase">{user.year}</div>
        </div>
        <span className="text-xs text-[var(--on-surface-variant)] font-medium">{user.major}</span>
      </div>
    </div>
  );
};

export default UserCard;
