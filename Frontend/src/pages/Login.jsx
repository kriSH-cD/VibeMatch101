import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/ui/GradientButton';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    if(email) {
      navigate('/setup-profile');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-[url('/grid-bg.svg')] bg-[var(--surface-container-lowest)] relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-[var(--secondary)] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

      <div className="z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold font-headline mb-4">
            Campus<span className="text-gradient">Match</span>
          </h1>
          <p className="text-[var(--on-surface-variant)] text-lg h-auto align-top">
            The Electric Nocturne Experience. Find your vibe.
          </p>
        </div>

        <div className="bg-[var(--surface-container-high)]/40 backdrop-blur-2xl p-8 rounded-3xl border border-[var(--outline-variant)]/20 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[var(--on-surface-variant)] text-sm mb-2 ml-1">Email Address (.edu preferred)</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 rounded-xl px-4 py-3 text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all"
                placeholder="you@college.edu"
                required
              />
            </div>
            
            <GradientButton type="submit">
              Continue
            </GradientButton>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-[var(--on-surface-variant)]">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
