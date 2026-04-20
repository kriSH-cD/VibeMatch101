import React, { useState } from 'react';
import BottomNav from '../components/layout/BottomNav';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const SetupProfile = () => {
  const navigate = useNavigate();
  const { setGlobalUser } = useUser();
  const [errorToast, setErrorToast] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    branch: 'Computer Science',
    year: '1st Year',
    division: '',
    housingType: 'Hostel',
    bio: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHousingToggle = (type) => {
    setFormData({ ...formData, housingType: type });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Client-side Validation Checks
    if (formData.fullName.trim().length < 3) {
      setErrorToast("Full name must be at least 3 characters.");
      return;
    }
    if (parseInt(formData.age) < 16 || parseInt(formData.age) > 80) {
      setErrorToast("Please enter a valid age.");
      return;
    }
    if (formData.bio.trim().length < 10) {
      setErrorToast("Tell us a bit more! Bio must be at least 10 characters.");
      return;
    }

    setErrorToast(null);
    console.log("Saving user Profile locally: ", formData);
    
    // Save to App context for immediate state utilization across screens
    setGlobalUser(formData);
    
    // Proceed to Profile Dashboard
    navigate('/profile/me');
  };

  return (
    <div className="bg-[var(--surface-container-lowest)] text-[var(--on-surface)] font-body selection:bg-[var(--primary-container)] selection:text-[var(--on-primary-container)] min-h-screen pb-20">
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-950/40 backdrop-blur-xl border-none shadow-none shadow-[0_0_20px_rgba(233,30,140,0.1)]">
        <div className="font-serif italic font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 text-2xl tracking-tighter">
          CampusMatch
        </div>
        <div className="flex items-center gap-6">
          <span className="material-symbols-outlined text-slate-400 hover:scale-105 transition-transform cursor-pointer">favorite</span>
          <span className="material-symbols-outlined text-slate-400 hover:scale-105 transition-transform cursor-pointer">notifications</span>
        </div>
      </nav>

      <main className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <header className="mb-10 text-center lg:text-left">
          <h1 className="font-headline text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[var(--on-surface)] to-[var(--primary)]">
            Complete Your Profile
          </h1>
          <div className="w-full bg-[var(--surface-container-high)] h-2 rounded-full overflow-hidden mb-2">
            <div className="h-full w-3/4 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-container)] progress-glow rounded-full"></div>
          </div>
          <div className="flex justify-between items-center px-1">
            <span className="text-label text-xs uppercase tracking-widest text-[var(--primary)] font-bold">Step 3 of 4</span>
            <span className="text-label text-xs uppercase tracking-widest text-[var(--on-surface-variant)] font-bold">75% Finished</span>
          </div>
        </header>

        <div className="glass-panel border border-[var(--outline-variant)]/10 rounded-xl p-8 lg:p-12 shadow-2xl relative overflow-hidden mt-6">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl"></div>
          
          {errorToast && (
            <div className="mb-6 p-4 rounded-lg bg-[var(--error-container)]/10 border border-[var(--error)]/30 text-[var(--error)] text-sm font-bold animate-pulse text-center relative z-10">
              {errorToast}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
            <div className="md:col-span-12 flex flex-col items-center justify-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="w-40 h-40 rounded-full custom-dashed flex items-center justify-center p-2 transition-transform duration-500 group-hover:rotate-12">
                  <div className="w-full h-full rounded-full bg-[var(--surface-container-high)] flex items-center justify-center overflow-hidden border-4 border-[var(--surface-container-lowest)]">
                    <span className="material-symbols-outlined text-[var(--primary)] text-5xl opacity-40 group-hover:opacity-100 transition-opacity">add_a_photo</span>
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 bg-[var(--primary-container)] text-[var(--on-primary-container)] w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all" type="button">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <p className="mt-4 text-label text-sm text-[var(--on-surface-variant)] font-medium">Upload your campus vibe</p>
            </div>

            <div className="md:col-span-8 space-y-2">
              <label className="block text-label text-sm font-bold text-[var(--primary)] tracking-wide ml-1">Full Name</label>
              <input 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-[var(--surface-container-low)] border-b border-[var(--outline)]/30 focus:border-[var(--primary)] focus:ring-0 text-[var(--on-surface)] px-4 py-3 rounded-t-lg transition-all placeholder:text-[var(--on-surface-variant)]/30 outline-none" 
                placeholder="Alex Rivers" 
                type="text" 
                required 
              />
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="block text-label text-sm font-bold text-[var(--primary)] tracking-wide ml-1">Age</label>
              <input 
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-[var(--surface-container-low)] border-b border-[var(--outline)]/30 focus:border-[var(--primary)] focus:ring-0 text-[var(--on-surface)] px-4 py-3 rounded-t-lg transition-all outline-none" 
                placeholder="21" 
                type="number"
                required
              />
            </div>

            <div className="md:col-span-6 space-y-2">
              <label className="block text-label text-sm font-bold text-[var(--primary)] tracking-wide ml-1">Branch</label>
              <div className="relative">
                <select 
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-[var(--surface-container-low)] border-b border-[var(--outline)]/30 focus:border-[var(--primary)] focus:ring-0 text-[var(--on-surface)] px-4 py-3 rounded-t-lg appearance-none transition-all outline-none"
                >
                  <option>Computer Science</option>
                  <option>Mechanical Engineering</option>
                  <option>Architecture</option>
                  <option>Business Management</option>
                  <option>Fine Arts</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="block text-label text-sm font-bold text-[var(--primary)] tracking-wide ml-1">Year</label>
              <div className="relative">
                <select 
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-[var(--surface-container-low)] border-b border-[var(--outline)]/30 focus:border-[var(--primary)] focus:ring-0 text-[var(--on-surface)] px-4 py-3 rounded-t-lg appearance-none transition-all outline-none"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[var(--on-surface-variant)] pointer-events-none">expand_more</span>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="block text-label text-sm font-bold text-[var(--primary)] tracking-wide ml-1">Division</label>
              <input 
                name="division"
                value={formData.division}
                onChange={handleChange}
                className="w-full bg-[var(--surface-container-low)] border-b border-[var(--outline)]/30 focus:border-[var(--primary)] focus:ring-0 text-[var(--on-surface)] px-4 py-3 rounded-t-lg transition-all outline-none" 
                placeholder="Sec-A" 
                type="text"
              />
            </div>

            <div className="md:col-span-12 py-4">
              <div className="bg-[var(--surface-container-low)] rounded-xl p-1 flex items-center w-fit border border-[var(--outline-variant)]/10">
                <button 
                  onClick={() => handleHousingToggle('Hostel')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${formData.housingType === 'Hostel' ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-lg' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'}`} 
                  type="button"
                >
                  Hostel
                </button>
                <button 
                  onClick={() => handleHousingToggle('Day Scholar')}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${formData.housingType === 'Day Scholar' ? 'bg-[var(--primary-container)] text-[var(--on-primary-container)] shadow-lg' : 'text-[var(--on-surface-variant)] hover:text-[var(--on-surface)]'}`} 
                  type="button"
                >
                  Day Scholar
                </button>
              </div>
            </div>

            <div className="md:col-span-12 space-y-2">
              <label className="block text-label text-sm font-bold text-[var(--primary)] tracking-wide ml-1">Bio</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full bg-[var(--surface-container-low)] border-b border-[var(--outline)]/30 focus:border-[var(--primary)] focus:ring-0 text-[var(--on-surface)] px-4 py-3 rounded-t-lg transition-all outline-none resize-none" 
                placeholder="Coffee lover, late-night coder, and looking for someone to explore the campus library's hidden corners with..." 
                rows="4"
              ></textarea>
            </div>

            <div className="md:col-span-12 pt-6">
              <button className="w-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-container)] text-[var(--on-primary-container)] font-bold text-lg py-4 rounded-full shadow-[0_0_30px_rgba(233,30,140,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2" type="submit">
                <span>Launch Your Profile</span>
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center text-[var(--on-surface-variant)] text-sm font-medium italic opacity-60">
          "Your profile is your digital aura. Make it shine."
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default SetupProfile;
