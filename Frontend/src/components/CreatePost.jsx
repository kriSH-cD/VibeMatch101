import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { compressImage, isValidImageType } from '../utils/imageCompression';
import { containsProfanity, cleanText } from '../utils/profanityFilter';
import { BUCKET_POSTS } from '../utils/constants';
import toast from 'react-hot-toast';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function CreatePost({ onPostCreated }) {
  const { profile } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!isValidImageType(file)) {
      toast.error('Please select a valid image (JPEG, PNG, WebP, or GIF)');
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed && !image) {
      toast.error('Write something or add an image');
      return;
    }

    if (containsProfanity(trimmed)) {
      toast.error('Your post contains inappropriate language. Please revise.');
      return;
    }

    setSubmitting(true);

    try {
      let imageUrl = null;

      // Upload image if present
      if (image) {
        const compressed = await compressImage(image, 'post');
        const fileName = `${profile.id}/${Date.now()}-${compressed.name}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET_POSTS)
          .upload(fileName, compressed);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_POSTS)
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }

      // Insert post
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: profile.id,
          content: trimmed,
          image_url: imageUrl,
          is_anonymous: isAnonymous,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Post shared!');
      setContent('');
      removeImage();
      setIsAnonymous(false);
      if (onPostCreated) onPostCreated(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-5 mb-6 animate-fade-in">
      {/* Input area */}
      <div className="flex gap-3">
        <img
          src={isAnonymous ? `https://ui-avatars.com/api/?name=?&background=d9e4ea&color=566166` : (profile?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'U')}&background=82c6f1&color=003f5a`)}
          alt=""
          className="avatar mt-1"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="input-serene resize-none"
            style={{ minHeight: '80px' }}
          />
        </div>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative mt-3 rounded-xl overflow-hidden" style={{ maxHeight: '300px' }}>
          <img src={imagePreview} alt="Preview" className="w-full object-cover rounded-xl" style={{ maxHeight: '300px' }} />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Actions row */}
      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(169,180,185,0.12)' }}>
        <div className="flex items-center gap-4">
          {/* Image upload */}
          <label className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-container-low)]"
                 style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
            <PhotoIcon className="w-5 h-5" />
            Photo
            <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          </label>

          {/* Anonymous toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            <div
              className="relative w-10 h-5.5 rounded-full transition-colors cursor-pointer"
              style={{
                background: isAnonymous ? 'var(--color-primary)' : 'var(--color-surface-container-highest)',
                width: '40px', height: '22px',
              }}
              onClick={() => setIsAnonymous(!isAnonymous)}
            >
              <div
                className="absolute top-0.5 w-4.5 h-4.5 rounded-full transition-transform bg-white"
                style={{
                  width: '18px', height: '18px', top: '2px',
                  transform: isAnonymous ? 'translateX(20px)' : 'translateX(2px)',
                  transition: 'transform 0.25s var(--ease-serene)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
              />
            </div>
            Anonymous
          </label>
        </div>

        <button onClick={handleSubmit} disabled={submitting || (!content.trim() && !image)} className="btn-primary text-sm px-5 py-2">
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>
    </div>
  );
}
