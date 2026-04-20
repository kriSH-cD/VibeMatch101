import React from 'react';
import BottomNav from '../components/layout/BottomNav';
import { useProfile } from '../hooks/useProfile';

const UserProfile = () => {
  const { profile, posts, loading } = useProfile();

  if (loading || !profile) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--surface-container-lowest)]"><div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div></div>;
  }
  return (
    <div className="min-h-screen pb-24">
      {/* TopNavBar Shell */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl flex justify-between items-center px-6 py-4 shadow-[0_0_20px_rgba(233,30,140,0.1)]">
        <div className="font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 text-2xl tracking-tighter">
          VibeMatch101
        </div>
        <div className="flex items-center gap-6">
          <div className="material-symbols-outlined text-slate-400 hover:scale-105 transition-transform active:scale-95 duration-200 cursor-pointer">notifications</div>
          <div className="material-symbols-outlined text-slate-400 hover:scale-105 transition-transform active:scale-95 duration-200 cursor-pointer">favorite</div>
        </div>
      </header>
      
      {/* Main Content Canvas */}
      <main className="pt-16">
        {/* Profile Banner Section */}
        <section className="relative">
          <div className="h-[130px] w-full bg-gradient-to-r from-[var(--primary-container)] to-[var(--secondary-container)] opacity-80"></div>
          {/* Profile Info Container */}
          <div className="px-6 flex flex-col items-center -mt-12 mb-8 relative z-10">
            <div className="w-[84px] h-[84px] rounded-full ring-4 ring-white shadow-xl overflow-hidden mb-4 bg-[var(--surface-container)]">
              <img alt="Profile" className="w-full h-full object-cover" src={profile.avatarUrl}/>
            </div>
            <h1 className="font-headline font-bold text-[22px] text-white tracking-tight mb-2">{profile.name}</h1>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {profile.tags.map((tag, i) => (
                <span key={i} className="bg-[var(--surface-container-highest)] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] border border-[var(--outline-variant)]/10">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-center italic text-[var(--on-surface-variant)] font-body leading-relaxed max-w-xs mb-6 opacity-80">
              "{profile.bio}"
            </p>
            <button className="w-full py-3 rounded-full border-2 border-[var(--primary)] text-[var(--primary)] font-bold tracking-wide hover:bg-[var(--primary)]/10 transition-all active:scale-95 duration-200 cursor-pointer">
              Message
            </button>
          </div>
        </section>
        
        {/* Divider Logic (Tonal shift instead of border) */}
        <div className="h-12 bg-[var(--surface-container-low)]/30 mb-8"></div>
        
        {/* Posts Section */}
        <section className="px-6 space-y-6">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-headline text-2xl font-bold text-white tracking-tight">Posts by {profile.name.split(' ')[0]}</h2>
            <div className="h-1 w-12 bg-[var(--primary)] rounded-full"></div>
          </div>
          
          {/* Posts List */}
          <div className="grid gap-6">
            {posts.map(post => (
              <article key={post.id} className="glass-panel p-5 rounded-lg border border-[var(--outline-variant)]/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${post.time.includes('ago') ? 'bg-[var(--tertiary-container)]' : 'bg-[var(--on-surface-variant)]'}`}></div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--on-surface-variant)]">{post.time}</span>
                  </div>
                  <span className="material-symbols-outlined text-[var(--on-surface-variant)] cursor-pointer hover:text-white transition-colors">more_horiz</span>
                </div>
                <p className="font-body text-[var(--on-surface)] mb-4 leading-relaxed">
                  {post.content}
                </p>
                {post.imageUrl && (
                  <div className="w-full h-48 rounded-md overflow-hidden mb-4">
                    <img alt="Post content" className="w-full h-full object-cover" src={post.imageUrl}/>
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <div className={`flex items-center gap-2 cursor-pointer transition-transform hover:scale-110 active:scale-95 ${post.isLiked ? 'text-[var(--primary)]' : 'text-slate-400'}`}>
                    <span className="material-symbols-outlined" style={{fontVariationSettings: post.isLiked ? "'FILL' 1" : "'FILL' 0"}}>favorite</span>
                    <span className="text-xs font-bold">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[var(--on-surface-variant)] cursor-pointer hover:text-white transition-colors">
                    <span className="material-symbols-outlined">chat_bubble</span>
                    <span className="text-xs font-bold">{post.comments}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default UserProfile;
