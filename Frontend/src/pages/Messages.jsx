import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/layout/BottomNav';
import { useMessages } from '../hooks/useMessages';

const Messages = () => {
  const navigate = useNavigate();
  const { messages, loading } = useMessages();

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] pb-32 overflow-x-hidden">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-950/40 backdrop-blur-xl border-none shadow-[0_0_20px_rgba(233,30,140,0.1)]">
        <div className="flex items-center gap-4">
          <span className="font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 text-2xl tracking-tighter">CampusMatch</span>
        </div>
        <div className="flex items-center gap-6 text-slate-400">
          <button className="hover:scale-105 transition-transform active:scale-95 duration-200">
            <span className="material-symbols-outlined">favorite</span>
          </button>
          <button className="hover:scale-105 transition-transform active:scale-95 duration-200 relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--primary)] rounded-full"></span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <div className="mb-10 mt-6 space-y-2">
          <div className="flex justify-between items-end">
            <h1 className="font-headline text-5xl font-bold tracking-tight text-[var(--on-surface)] editorial-shadow italic">Messages</h1>
            <button className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-[var(--primary)] shadow-[0_0_15px_rgba(233,30,140,0.2)] hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
          <p className="font-body text-[var(--on-surface-variant)]/70 text-lg ml-1">Spark connections through conversation.</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            messages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => navigate(`/chat/${msg.id}`)}
              className={msg.hasRead 
                ? "p-4 rounded-lg flex items-center gap-4 transition-all hover:bg-[var(--surface-container-high)] group cursor-pointer" 
                : "glass-card p-4 rounded-lg flex items-center gap-4 transition-all hover:bg-[var(--surface-variant)]/60 group cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
              }
            >
              <div className="relative">
                {msg.avatar ? (
                   <img 
                    alt={msg.name} 
                    className={`w-12 h-12 rounded-full object-cover ${!msg.hasRead ? 'outline outline-2 outline-[var(--primary)]/30' : ''}`} 
                    src={msg.avatar}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[var(--secondary-container)] flex items-center justify-center text-[var(--secondary)] font-bold text-xl">
                    {msg.initial}
                  </div>
                )}
                
                {msg.isActive && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[var(--tertiary)] border-2 border-[var(--surface-container-lowest)] rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-headline font-bold text-lg truncate ${msg.hasRead ? 'text-[var(--on-surface)]/80' : 'text-[var(--on-surface)]'}`}>
                    {msg.name}
                  </span>
                  <span className={`text-[10px] uppercase tracking-widest ${msg.hasRead ? 'font-medium text-[var(--on-surface-variant)]/40' : 'font-bold text-[var(--primary)]'}`}>
                    {msg.time}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className={`text-sm truncate ${msg.hasRead ? 'text-[var(--on-surface-variant)]/60' : 'text-[var(--on-surface-variant)] font-medium'} ${msg.preview.startsWith('You:') ? 'italic' : ''}`}>
                    {msg.preview}
                  </p>
                  {msg.unreadCount > 0 && (
                    <div className="bg-[var(--primary-container)] text-[var(--on-primary-container)] text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(255,70,160,0.5)] flex-shrink-0">
                      {msg.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )))}
        </div>

        <div className="h-10"></div>
        <p className="text-center font-label text-[10px] uppercase tracking-[0.3em] text-[var(--on-surface-variant)]/30">End of conversations</p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Messages;
