import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/ui/GradientButton';

const VerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 text-center">
      <div className="w-20 h-20 bg-[var(--surface-container-high)] rounded-full flex items-center justify-center mb-6">
        <span className="text-[var(--on-surface)] text-3xl">✉️</span>
      </div>
      <h2 className="text-3xl font-bold font-headline mb-4">Check your email</h2>
      <p className="text-[var(--on-surface-variant)] mb-8 max-w-sm">
        We've sent a magic link to your email address. Click the link to verify your account and join the campus!
      </p>
      <div className="w-full max-w-xs">
        <GradientButton onClick={() => navigate('/setup-profile')}>
          Simulate Verification
        </GradientButton>
      </div>
    </div>
  );
};

export default VerifyEmail;
