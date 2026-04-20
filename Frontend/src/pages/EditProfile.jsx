import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { compressImage, isValidImageType } from '../utils/imageCompression';
import { BRANCHES, DIVISIONS, YEARS, HOSTEL_STATUS, BUCKET_PROFILES } from '../utils/constants';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { CameraIcon } from '@heroicons/react/24/outline';

export default function EditProfile() {
  const navigate = useNavigate();
  const { profile, refreshProfile } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
      age: profile?.age || '',
      branch: profile?.branch || '',
      division: profile?.division || '',
      year: profile?.year || '',
      hostel_or_day: profile?.hostel_or_day || '',
      bio: profile?.bio || '',
    },
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(profile?.profile_photo_url || null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!isValidImageType(file)) {
      toast.error('Please select a valid image');
      return;
    }
    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      let photoUrl = profile?.profile_photo_url;

      if (profilePhoto) {
        const compressed = await compressImage(profilePhoto, 'profile');
        const fileName = `${profile.id}/${Date.now()}-profile.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_PROFILES)
          .upload(fileName, compressed);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_PROFILES)
          .getPublicUrl(fileName);
        photoUrl = publicUrl;
      }

      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          age: parseInt(data.age),
          branch: data.branch,
          division: data.division,
          year: data.year,
          hostel_or_day: data.hostel_or_day,
          bio: data.bio || null,
          profile_photo_url: photoUrl,
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Profile updated!');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (!profile) return null;

  const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=82c6f1&color=003f5a&size=200`;

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>Edit Profile</h1>

        <div className="card p-8 animate-fade-in">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Photo */}
            <div className="flex justify-center mb-2">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden">
                  <img src={photoPreview || avatarFallback} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CameraIcon className="w-6 h-6 text-white" />
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Full Name *</label>
              <input {...register('full_name', { required: 'Name is required' })}
                     className="input-serene" />
              {errors.full_name && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.full_name.message}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Age *</label>
              <input type="number" {...register('age', { required: 'Age is required', min: 16, max: 30 })}
                     className="input-serene" />
              {errors.age && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.age.message}</p>}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Branch *</label>
              <select {...register('branch', { required: 'Required' })} className="input-serene">
                <option value="">Select branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Division + Year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                       style={{ color: 'var(--color-on-surface-variant)' }}>Division *</label>
                <select {...register('division', { required: 'Required' })} className="input-serene">
                  {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                       style={{ color: 'var(--color-on-surface-variant)' }}>Year *</label>
                <select {...register('year', { required: 'Required' })} className="input-serene">
                  {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                </select>
              </div>
            </div>

            {/* Hostel / Day */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Status *</label>
              <select {...register('hostel_or_day', { required: 'Required' })} className="input-serene">
                {HOSTEL_STATUS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Bio</label>
              <textarea {...register('bio')} className="input-serene resize-none" rows={3}
                        placeholder="Tell us about yourself…" />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/profile')} className="btn-secondary flex-1 py-3">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3">
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
