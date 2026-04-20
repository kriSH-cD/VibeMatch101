import React, { useState } from 'react';
import BottomNav from '../components/layout/BottomNav';
import UserCard from '../components/discover/UserCard';
import { useNavigate } from 'react-router-dom';

const MOCK_USERS = [
  { id: 1, name: 'Arjun R.', age: 21, major: 'Computer Engineering', year: 'SY', hostelBadge: 'Hostel A', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAllP4zh37BkPDl5Q3Dncjw2tMaYTcSsk7I9aYsL8VH1eQ-UIW5gC8FrNuMzDvJ6uVRmf-7aUDldLcyE1mMC60RHs2w6NkiQ8Rk7nTKBKWwBd0PwxVH6FeALwd91k16GrNUJNk-Avssx6IEKzQLa2vcr46fdROy0KtbZBMGBKQgnSowm0RGQs0Kjv41SJC_tpHU6BhRpJhPAOyKFgKYNcwSSdyrkCA4Z34UFS6xTDZ40tEx-ieC5eHu-CxVD5zueQRzm0jz0Gd65kA' },
  { id: 2, name: 'Meera V.', age: 20, major: 'Design & Arts', year: 'TY', hostelBadge: 'Day Scholar', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzcs9SAu_QZL8gIXV4hqCUGoWzK6dddbw-c3oduuWJRllnEiE8Uvi84f3yKERwc_Dz-WaoG65zwIQ0yDmfaQI64jPU0AkCaTdHjTha7NopTqlQe4b5wxpE5G2KBHkwefqQXY3EhTpHCVq2vOk0SHDLAsdD5anw0GjPblYzEYKu5oGh_wmkJhnrCp8CRqPi8-kX884HDLiuLgSSQQ38ktBJf--53YAOdO8qV2gIN4JQfhhB14h8E3Pb-ONECYa3A2XOH4JVMLMv-LKa' },
  { id: 3, name: 'Rohan K.', age: 20, major: 'Business Admin', year: 'FY', hostelBadge: 'Hostel C', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAsEtx4zP2erftyFiocL4bdVb2hNESLUIgsgTIEn0OVkFkWLosQca174vX96MDjvGP2aMKUYWTFhICf7rycXcDA5UfW24uhtONWFI6icPFohxSo1kgnAwtAzDH0lxzGBRe3RyGL_fncDd_xy_PbAl-9e0YWZAUgtb68D2Ta25cx9aHEyyk_XL1Khe_sPzAKw5voD6v11xVBDJAuZGWFpiAfT5Br5g5Qk3L-ynl9U7UN0e-heLRRq20RBu0inwmnarOsUDjaznm84cCH' },
  { id: 4, name: 'Sara A.', age: 21, major: 'Medical Science', year: 'Final', hostelBadge: 'Hostel B', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6dhcmwx7OvEsvQcm_KSvmt1Fkv4OTN-4ruLrr1XZLR6kGh9ilsyEiVx3VLig_IWzFjyeZ5Lvo2Lh-oXV2_0UaNaC7zHTKnhJftY5IzE2VA_LR_BOVippFmjpdzduQ6U3zMggYP4wJM8IIQsp7q4673R4WxMabBF_FJwB-usHwtkR4mFw4ge9Pqg2N25K2PLCWi_R0PJIFEa-ff6cJN52Rm6qq7peXH7-a69oKbFwhKrRV_0vNeW7Qlm9qFV9GzoaUcT32mmzT0rjH' }
];

const FilterOptions = [
  { label: 'All', value: 'all', active: true },
  { label: 'FY', value: 'fy', active: false },
  { label: 'SY', value: 'sy', active: false },
  { label: 'TY', value: 'ty', active: false },
  { label: 'Final Year', value: 'final', active: false },
  { label: 'Hosteller', value: 'hosteller', active: false },
  { label: 'Day Scholar', value: 'dayscholar', active: false }
];

const Discover = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[var(--background)] min-h-screen pb-32">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-none shadow-[0_0_20px_rgba(233,30,140,0.1)]">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <div className="font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 text-2xl tracking-tighter">
            VibeMatch101
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-400 hover:scale-105 transition-transform active:scale-95 duration-200">
              <span className="material-symbols-outlined">favorite</span>
            </button>
            <button className="text-slate-400 hover:scale-105 transition-transform active:scale-95 duration-200 relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--primary)] rounded-full"></span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="pt-24 px-6 max-w-7xl mx-auto">
        {/* Search and Discover Header */}
        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-[var(--on-surface)]">Discover</h1>
          {/* Sticky Search Bar Container */}
          <div className="sticky top-20 z-40 py-2 bg-[var(--background)]/80 backdrop-blur-md">
            <div className="relative group neon-glow-pink transition-all duration-300 rounded-full overflow-hidden border border-[var(--outline-variant)]/20">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-[var(--on-surface-variant)]">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input 
                className="w-full bg-[var(--surface-container-high)] py-4 pl-14 pr-6 rounded-full border-none focus:ring-0 text-[var(--on-surface)] placeholder-[var(--on-surface-variant)]/50 transition-all outline-none" 
                placeholder="Search by name, branch, or interest..." 
                type="text"
              />
            </div>
          </div>
          
          {/* Scrollable Filter Chips */}
          <div className="flex gap-3 overflow-x-auto hide-scrollbar py-2 -mx-6 px-6">
            {FilterOptions.map((opt, i) => (
              <button key={i} className={`whitespace-nowrap px-6 py-2.5 rounded-full font-semibold text-sm transition-transform active:scale-95 ${
                opt.active 
                  ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--primary-container)] text-[var(--on-primary-container)] font-bold shadow-[0_0_15px_rgba(233,30,140,0.3)]' 
                  : 'bg-[var(--surface-container-highest)] text-[var(--on-surface)] hover:bg-[var(--surface-bright)] transition-colors'
              }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* 2-column card grid (3-column desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
          {MOCK_USERS.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onClick={() => navigate(`/profile/${user.id}`)} 
            />
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
};

export default Discover;
