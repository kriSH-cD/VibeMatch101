import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { containsProfanity } from '../utils/profanityFilter';
import toast from 'react-hot-toast';
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  FlagIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function PostCard({ post, onDelete, onUpdate }) {
  const { profile } = useAuth();
  const [liked, setLiked] = useState(post.user_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAnon, setCommentAnon] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const isOwn = profile?.id === post.user_id;
  const displayName = post.is_anonymous ? 'Anonymous' : (post.author?.full_name || 'User');
  const displayAvatar = post.is_anonymous
    ? `https://ui-avatars.com/api/?name=?&background=d9e4ea&color=566166`
    : (post.author?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=82c6f1&color=003f5a`);

  const timeAgo = post.created_at
    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
    : '';

  // Like / unlike
  const handleLike = async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount(prev => wasLiked ? prev - 1 : prev + 1);

    try {
      if (wasLiked) {
        await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', profile.id);
      } else {
        await supabase.from('likes').insert({ post_id: post.id, user_id: profile.id });
      }
      // Update post likes_count
      await supabase.from('posts').update({ likes_count: wasLiked ? likesCount - 1 : likesCount + 1 }).eq('id', post.id);
    } catch {
      setLiked(wasLiked);
      setLikesCount(prev => wasLiked ? prev + 1 : prev - 1);
    }
  };

  // Load comments
  const loadComments = async () => {
    setLoadingComments(true);
    const { data } = await supabase
      .from('comments')
      .select('*, author:users(full_name, profile_photo_url)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true });
    setComments(data || []);
    setLoadingComments(false);
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  // Add comment
  const addComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    if (containsProfanity(trimmed)) {
      toast.error('Comment contains inappropriate language.');
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: post.id, user_id: profile.id, content: trimmed, is_anonymous: commentAnon })
      .select('*, author:users(full_name, profile_photo_url)')
      .single();

    if (error) {
      toast.error('Failed to add comment');
      return;
    }

    setComments(prev => [...prev, data]);
    setCommentText('');
    setCommentAnon(false);
    // Update count
    await supabase.from('posts').update({ comments_count: (post.comments_count || 0) + 1 }).eq('id', post.id);
  };

  // Delete post
  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return;
    const { error } = await supabase.from('posts').delete().eq('id', post.id);
    if (error) {
      toast.error('Failed to delete');
    } else {
      toast.success('Post deleted');
      if (onDelete) onDelete(post.id);
    }
    setShowMenu(false);
  };

  // Report post
  const submitReport = async () => {
    if (!reportReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    const { error } = await supabase.from('reports').insert({
      reporter_id: profile.id,
      reported_post_id: post.id,
      reported_user_id: post.user_id,
      reason: reportReason.trim(),
    });
    if (error) {
      toast.error('Failed to submit report');
    } else {
      toast.success('Report submitted. Thank you.');
    }
    setShowReport(false);
    setReportReason('');
    setShowMenu(false);
  };

  return (
    <div className="card p-5 mb-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {post.is_anonymous ? (
            <img src={displayAvatar} alt="" className="avatar" />
          ) : (
            <Link to={`/user/${post.user_id}`}>
              <img src={displayAvatar} alt="" className="avatar" />
            </Link>
          )}
          <div>
            {post.is_anonymous ? (
              <span className="font-semibold text-sm" style={{ color: 'var(--color-on-surface)' }}>Anonymous</span>
            ) : (
              <Link to={`/user/${post.user_id}`} className="font-semibold text-sm no-underline" style={{ color: 'var(--color-on-surface)' }}>
                {displayName}
              </Link>
            )}
            <p className="text-xs" style={{ color: 'var(--color-outline)' }}>{timeAgo}</p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}>
            <EllipsisHorizontalIcon className="w-5 h-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white rounded-xl py-2 z-10" style={{ boxShadow: 'var(--shadow-elevated)', minWidth: '150px' }}>
              {isOwn && (
                <button onClick={handleDelete}
                        className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-[var(--color-surface-container-low)]"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-error)' }}>
                  <TrashIcon className="w-4 h-4" /> Delete
                </button>
              )}
              {!isOwn && (
                <button onClick={() => { setShowReport(true); setShowMenu(false); }}
                        className="w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-[var(--color-surface-container-low)]"
                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}>
                  <FlagIcon className="w-4 h-4" /> Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {post.content && (
        <p className="mb-3 text-sm leading-relaxed" style={{ color: 'var(--color-on-surface)', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </p>
      )}

      {/* Image */}
      {post.image_url && (
        <div className="rounded-xl overflow-hidden mb-3">
          <img src={post.image_url} alt="Post" className="w-full object-cover" style={{ maxHeight: '400px' }} />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-2">
        <button onClick={handleLike}
                className="flex items-center gap-1.5 text-sm transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: liked ? '#e74c6f' : 'var(--color-on-surface-variant)' }}>
          {liked ? <HeartIconSolid className="w-5 h-5" /> : <HeartIcon className="w-5 h-5" />}
          {likesCount > 0 && likesCount}
        </button>
        <button onClick={toggleComments}
                className="flex items-center gap-1.5 text-sm"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)' }}>
          <ChatBubbleLeftIcon className="w-5 h-5" />
          {post.comments_count > 0 && post.comments_count}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(169,180,185,0.12)' }}>
          {loadingComments ? (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="skeleton h-10 rounded-lg" />)}
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
              {comments.map(c => (
                <div key={c.id} className="flex gap-2">
                  <img
                    src={c.is_anonymous
                      ? `https://ui-avatars.com/api/?name=?&background=d9e4ea&color=566166&size=32`
                      : (c.author?.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.author?.full_name || 'U')}&background=82c6f1&color=003f5a&size=32`)}
                    alt="" className="avatar-sm mt-0.5"
                  />
                  <div className="flex-1 rounded-xl px-3 py-2" style={{ background: 'var(--color-surface-container-low)', fontSize: '0.85rem' }}>
                    <span className="font-medium" style={{ color: 'var(--color-on-surface)' }}>
                      {c.is_anonymous ? 'Anonymous' : (c.author?.full_name || 'User')}
                    </span>
                    <p style={{ color: 'var(--color-on-surface-variant)' }}>{c.content}</p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-center py-2" style={{ color: 'var(--color-outline)' }}>No comments yet</p>
              )}
            </div>
          )}

          {/* Add comment */}
          <div className="flex gap-2 items-end">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment…"
              className="input-serene text-sm flex-1"
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
            />
            <label className="flex items-center gap-1 text-xs cursor-pointer whitespace-nowrap" style={{ color: 'var(--color-outline)' }}>
              <input type="checkbox" checked={commentAnon} onChange={(e) => setCommentAnon(e.target.checked)}
                     className="w-3.5 h-3.5" />
              Anon
            </label>
            <button onClick={addComment} className="btn-primary text-sm py-2 px-4">Send</button>
          </div>
        </div>
      )}

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <div className="card p-6 w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Report Post</h3>
              <button onClick={() => setShowReport(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Why are you reporting this post?"
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
    </div>
  );
}
