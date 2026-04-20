import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-4 bg-slate-950/60 backdrop-blur-2xl border-t border-white/5 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] rounded-t-[2.5rem]">
      <NavLink to="/feed" className={({isActive}) => `flex flex-col items-center justify-center px-5 py-2 transition-colors active:scale-90 duration-300 ${isActive ? 'text-pink-500 bg-pink-500/10 rounded-full shadow-[0_0_15px_rgba(233,30,140,0.3)]' : 'text-slate-500 hover:text-pink-300'}`}>
        <span className="material-symbols-outlined mb-1">home</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Home</span>
      </NavLink>
      <NavLink to="/discover" className={({isActive}) => `flex flex-col items-center justify-center px-5 py-2 transition-colors active:scale-90 duration-300 ${isActive ? 'text-pink-500 bg-pink-500/10 rounded-full shadow-[0_0_15px_rgba(233,30,140,0.3)]' : 'text-slate-500 hover:text-pink-300'}`}>
        <span className="material-symbols-outlined mb-1" style={{fontVariationSettings: "'FILL' 1"}}>explore</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Discover</span>
      </NavLink>
      <NavLink to="/messages" className={({isActive}) => `flex flex-col items-center justify-center px-5 py-2 transition-colors active:scale-90 duration-300 ${isActive ? 'text-pink-500 bg-pink-500/10 rounded-full shadow-[0_0_15px_rgba(233,30,140,0.3)]' : 'text-slate-500 hover:text-pink-300'}`}>
        <span className="material-symbols-outlined mb-1">chat_bubble</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Messages</span>
      </NavLink>
      <NavLink to="/profile/me" className={({isActive}) => `flex flex-col items-center justify-center px-5 py-2 transition-colors active:scale-90 duration-300 ${isActive ? 'text-pink-500 bg-pink-500/10 rounded-full shadow-[0_0_15px_rgba(233,30,140,0.3)]' : 'text-slate-500 hover:text-pink-300'}`}>
        <span className="material-symbols-outlined mb-1">person</span>
        <span className="font-sans text-[10px] font-bold uppercase tracking-widest">Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
