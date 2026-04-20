import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import AvatarCircle from '../components/ui/AvatarCircle';
import { Edit2, LogOut, Settings, Bell, Shield } from 'lucide-react';

const MyProfile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] pb-24">
      <TopBar title="My Profile" rightElement={<button className="p-2 text-[var(--on-surface-variant)]"><Settings size={24}/></button>} />
      
      <div className="px-6 py-6 max-w-lg mx-auto">
        <div className="flex items-center mb-8">
          <AvatarCircle size="xl" alt="Me" src="https://i.pravatar.cc/150?u=myprofile" />
          <div className="ml-6 flex-1">
            <h1 className="text-2xl font-bold font-headline">Alex Johnson</h1>
            <p className="text-[var(--primary)] text-sm mb-3">Computer Science • '25</p>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="flex items-center gap-2 text-xs font-bold text-[var(--on-surface)] bg-[var(--surface-container-high)] px-4 py-2 rounded-full hover:bg-[var(--surface-variant)] transition-colors"
            >
              <Edit2 size={14} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--on-surface-variant)] uppercase tracking-wider mb-2 ml-2">App Settings</h3>
          
          <div className="bg-[var(--surface-container-low)] rounded-2xl overflow-hidden border border-[var(--outline-variant)]/20">
            <button className="w-full flex items-center justify-between p-4 border-b border-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] transition-colors">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-[var(--primary)]" />
                <span>Notifications</span>
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 border-b border-[var(--surface-container-high)] hover:bg-[var(--surface-container-high)] transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-[var(--tertiary)]" />
                <span>Privacy & Security</span>
              </div>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--surface-container-high)] transition-colors"
            >
              <div className="flex items-center gap-3 text-[var(--error)]">
                <LogOut size={20} />
                <span>Log Out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default MyProfile;
