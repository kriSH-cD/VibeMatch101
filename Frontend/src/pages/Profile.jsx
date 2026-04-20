import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function Profile() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;

    async function fetchMyPosts() {
      setLoading(true);
      const { data } = await supabase
        .from('posts')
        .select('*, author:users(full_name, profile_photo_url)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      // Check likes
      const { data: userLikes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', profile.id);

      const likedIds = new Set((userLikes || []).map(l => l.post_id));
      setPosts((data || []).map(p => ({ ...p, user_liked: likedIds.has(p.id) })));
      setLoading(false);
    }

    fetchMyPosts();
  }, [profile]);

  if (!profile) return null;

  const avatar = profile.profile_photo_url
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=82c6f1&color=003f5a&size=200`;

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Profile Header */}
        <div className="card p-6 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img src={avatar} alt={profile.full_name} className="w-24 h-24 rounded-full object-cover"
                 style={{ border: '3px solid var(--color-primary-container)' }} />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h1 className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{profile.full_name}</h1>
                <button onClick={() => navigate('/edit-profile')} className="btn-secondary flex items-center gap-1.5 text-sm mt-2 sm:mt-0">
                  <PencilIcon className="w-4 h-4" /> Edit Profile
                </button>
              </div>
              {profile.bio && (
                <p className="text-sm mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>{profile.bio}</p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="chip">{profile.branch}</span>
                <span className="chip">{profile.year}</span>
                <span className="chip">Div {profile.division}</span>
                <span className="chip">{profile.hostel_or_day}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-around mt-6 pt-4" style={{ borderTop: '1px solid rgba(169,180,185,0.12)' }}>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{posts.length}</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>Posts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{profile.age}</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>Age</p>
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>Recent Activity</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="card p-5">
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm" style={{ color: 'var(--color-outline)' }}>No posts yet. Share your first thought!</p>
          </div>
        ) : (
          posts.map(p => (
            <PostCard key={p.id} post={p} onDelete={(id) => setPosts(prev => prev.filter(x => x.id !== id))} />
          ))
        )}
      </main>
    </div>
  );
}
