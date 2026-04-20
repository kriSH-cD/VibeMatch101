import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import GradientButton from '../components/ui/GradientButton';

const EditProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)]">
      <TopBar title="Edit Profile" showBack />
      <div className="p-6 max-w-md mx-auto space-y-6">
         <div>
          <label className="text-sm text-[var(--on-surface-variant)] ml-1 mb-1 block">Bio</label>
          <textarea 
            className="w-full bg-[var(--surface-container-low)] border border-[var(--outline-variant)]/30 rounded-xl px-4 py-3 text-[var(--on-surface)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] min-h-[100px] resize-none"
            defaultValue="I run on iced coffee and good vibes."
          />
        </div>
        
        <div className="pt-4">
          <GradientButton onClick={() => navigate('/profile/me')}>
            Save Changes
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
