import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import {
  ChatBubbleLeftRightIcon,
  NoSymbolIcon,
  FlagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export default function UserProfile() {
  const { userId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    if (!userId || !profile) return;

    // Redirect if viewing own profile
    if (userId === profile.id) {
      navigate('/profile');
      return;
    }

    async function fetchData() {
      setLoading(true);

      // Fetch user
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      setUser(userData);

      // Check block status
      const { data: blockData } = await supabase
        .from('blocked_users')
        .select('id')
        .eq('user_id', profile.id)
        .eq('blocked_user_id', userId)
        .limit(1);
      setIsBlocked(blockData && blockData.length > 0);

      // Fetch their non-anonymous posts
      const { data: postsData } = await supabase
        .from('posts')
        .select('*, author:users(full_name, profile_photo_url)')
        .eq('user_id', userId)
        .eq('is_anonymous', false)
        .order('created_at', { ascending: false });

      const { data: userLikes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', profile.id);

      const likedIds = new Set((userLikes || []).map(l => l.post_id));
      setPosts((postsData || []).map(p => ({ ...p, user_liked: likedIds.has(p.id) })));
      setLoading(false);
    }

    fetchData();
  }, [userId, profile]);

  const handleBlock = async () => {
    if (isBlocked) {
      await supabase.from('blocked_users').delete().eq('user_id', profile.id).eq('blocked_user_id', userId);
      setIsBlocked(false);
      toast.success('User unblocked');
    } else {
      if (!confirm('Block this user? They won\'t be able to message you.')) return;
      await supabase.from('blocked_users').insert({ user_id: profile.id, blocked_user_id: userId });
      setIsBlocked(true);
      toast.success('User blocked');
    }
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Provide a reason');
      return;
    }
    const { error } = await supabase.from('reports').insert({
      reporter_id: profile.id,
      reported_user_id: userId,
      reason: reportReason.trim(),
    });
    if (error) {
      toast.error('Failed to submit report');
    } else {
      toast.success('Report submitted');
    }
    setShowReport(false);
    setReportReason('');
  };

  if (loading) {
    return (
      <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="card p-6">
            <div className="flex items-center gap-5">
              <div className="skeleton w-24 h-24 rounded-full" />
              <div className="flex-1">
                <div className="skeleton h-6 w-40 mb-3" />
                <div className="skeleton h-4 w-60" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="card p-8 text-center">
            <p className="text-lg font-medium" style={{ color: 'var(--color-on-surface)' }}>User not found</p>
          </div>
        </main>
      </div>
    );
  }

  const avatar = user.profile_photo_url
    || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}&background=82c6f1&color=003f5a&size=200`;

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <div className="card p-6 mb-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img src={avatar} alt={user.full_name} className="w-24 h-24 rounded-full object-cover"
                 style={{ border: '3px solid var(--color-primary-container)' }} />
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--color-on-surface)' }}>{user.full_name}</h1>
              {user.bio && (
                <p className="text-sm mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>{user.bio}</p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
                <span className="chip">{user.branch}</span>
                <span className="chip">{user.year}</span>
                <span className="chip">Div {user.division}</span>
                <span className="chip">{user.hostel_or_day}</span>
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Link
                  to={`/messages?user=${user.id}`}
                  className="btn-primary flex items-center gap-1.5 no-underline text-sm py-2 px-4"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" /> Message
                </Link>
                <button onClick={handleBlock} className="btn-secondary flex items-center gap-1.5 text-sm">
                  <NoSymbolIcon className="w-4 h-4" /> {isBlocked ? 'Unblock' : 'Block'}
                </button>
                <button onClick={() => setShowReport(true)} className="btn-secondary flex items-center gap-1.5 text-sm">
                  <FlagIcon className="w-4 h-4" /> Report
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-on-surface)' }}>
          Posts by {user.full_name}
        </h2>
        {posts.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm" style={{ color: 'var(--color-outline)' }}>No public posts yet</p>
          </div>
        ) : (
          posts.map(p => <PostCard key={p.id} post={p} />)
        )}

        {/* Report modal */}
        {showReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <div className="card p-6 w-full max-w-md animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>Report User</h3>
                <button onClick={() => setShowReport(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Why are you reporting this user?"
                className="input-serene resize-none mb-4"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowReport(false)} className="btn-secondary">Cancel</button>
                <button onClick={submitReport} className="btn-danger">Submit Report</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
