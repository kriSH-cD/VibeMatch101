import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

export default function Home() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, author:users(full_name, profile_photo_url)')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Check which posts the current user has liked
    if (data && profile) {
      const { data: userLikes } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', profile.id);

      const likedIds = new Set((userLikes || []).map(l => l.post_id));
      const enriched = data.map(p => ({ ...p, user_liked: likedIds.has(p.id) }));
      setPosts(enriched);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [profile]);

  const handlePostCreated = (newPost) => {
    const enriched = {
      ...newPost,
      author: { full_name: profile.full_name, profile_photo_url: profile.profile_photo_url },
      user_liked: false,
    };
    setPosts(prev => [enriched, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh' }}>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-on-surface)' }}>Feed</h1>

        <CreatePost onPostCreated={handlePostCreated} />

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-5">
                <div className="flex gap-3 mb-4">
                  <div className="skeleton w-11 h-11 rounded-full" />
                  <div className="flex-1">
                    <div className="skeleton h-4 w-32 mb-2" />
                    <div className="skeleton h-3 w-20" />
                  </div>
                </div>
                <div className="skeleton h-4 w-full mb-2" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-on-surface)' }}>No posts yet</p>
            <p className="text-sm" style={{ color: 'var(--color-outline)' }}>Be the first to share something with the community!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} onDelete={handlePostDeleted} />
          ))
        )}
      </main>
    </div>
  );
}
