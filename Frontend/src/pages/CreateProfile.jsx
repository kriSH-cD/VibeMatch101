import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { compressImage, isValidImageType } from '../utils/imageCompression';
import { BRANCHES, DIVISIONS, YEARS, HOSTEL_STATUS, BUCKET_PROFILES, APP_NAME } from '../utils/constants';
import toast from 'react-hot-toast';
import { CameraIcon } from '@heroicons/react/24/outline';

export default function CreateProfile() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
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
      let photoUrl = null;

      if (profilePhoto) {
        const compressed = await compressImage(profilePhoto, 'profile');
        const fileName = `${user.id}/${Date.now()}-profile.jpg`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_PROFILES)
          .upload(fileName, compressed);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_PROFILES)
          .getPublicUrl(fileName);
        photoUrl = publicUrl;
      }

      const { error } = await supabase.from('users').insert({
        id: user.id,
        email: user.email,
        full_name: data.full_name,
        age: parseInt(data.age),
        branch: data.branch,
        division: data.division,
        year: data.year,
        hostel_or_day: data.hostel_or_day,
        bio: data.bio || null,
        profile_photo_url: photoUrl,
      });

      if (error) throw error;

      await refreshProfile();
      toast.success('Profile created!');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--color-surface)' }}>
      <div className="w-full max-w-lg">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>Complete Your Profile</h1>
          <p className="text-sm" style={{ color: 'var(--color-outline)' }}>Let the {APP_NAME} community know who you are</p>
        </div>

        <div className="card p-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Photo */}
            <div className="flex justify-center mb-2">
              <label className="relative cursor-pointer group">
                <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                     style={{ background: 'var(--color-surface-container)' }}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <CameraIcon className="w-8 h-8" style={{ color: 'var(--color-outline)' }} />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CameraIcon className="w-6 h-6 text-white" />
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
              </label>
            </div>
            <p className="text-xs text-center" style={{ color: 'var(--color-outline)' }}>Upload a profile photo (optional)</p>

            {/* Name */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Full Name *</label>
              <input {...register('full_name', { required: 'Name is required' })}
                     className="input-serene" placeholder="Your full name" />
              {errors.full_name && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.full_name.message}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Age *</label>
              <input type="number" {...register('age', { required: 'Age is required', min: { value: 16, message: 'Min age 16' }, max: { value: 30, message: 'Max age 30' } })}
                     className="input-serene" placeholder="Your age" />
              {errors.age && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.age.message}</p>}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Branch *</label>
              <select {...register('branch', { required: 'Branch is required' })} className="input-serene">
                <option value="">Select your branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.branch && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.branch.message}</p>}
            </div>

            {/* Division + Year row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                       style={{ color: 'var(--color-on-surface-variant)' }}>Division *</label>
                <select {...register('division', { required: 'Required' })} className="input-serene">
                  <option value="">Division</option>
                  {DIVISIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.division && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.division.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                       style={{ color: 'var(--color-on-surface-variant)' }}>Year *</label>
                <select {...register('year', { required: 'Required' })} className="input-serene">
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
                </select>
                {errors.year && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.year.message}</p>}
              </div>
            </div>

            {/* Hostel / Day */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Status *</label>
              <div className="flex gap-3">
                {HOSTEL_STATUS.map(h => (
                  <label key={h.value} className="flex-1">
                    <input type="radio" value={h.value} {...register('hostel_or_day', { required: 'Required' })} className="sr-only peer" />
                    <div className="text-center py-3 rounded-xl cursor-pointer transition-all text-sm font-medium peer-checked:text-white"
                         style={{ background: 'var(--color-surface-container-low)' }}>
                      <style>{`
                        .peer:checked + div { background: var(--gradient-primary) !important; color: white !important; }
                      `}</style>
                      {h.label}
                    </div>
                  </label>
                ))}
              </div>
              {errors.hostel_or_day && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.hostel_or_day.message}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wider"
                     style={{ color: 'var(--color-on-surface-variant)' }}>Bio (optional)</label>
              <textarea {...register('bio')} className="input-serene resize-none" rows={3}
                        placeholder="Tell us about yourself…" />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
              {submitting ? 'Creating profile…' : 'Complete Setup →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
