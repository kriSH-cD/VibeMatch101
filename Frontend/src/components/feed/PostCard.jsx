import React from 'react';
import GlassCard from '../ui/GlassCard';
import AvatarCircle from '../ui/AvatarCircle';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

const PostCard = ({ post }) => {
  return (
    <GlassCard className="mb-6">
      <div className="flex items-center mb-4">
        <AvatarCircle src={post.user?.avatarUrl} alt={post.user?.name || 'User'} size="md" />
        <div className="ml-3">
          <h3 className="font-bold text-[var(--on-surface)] text-md">{post.user?.name || 'Anonymous'}</h3>
          <p className="text-[var(--on-surface-variant)] text-xs">{post.timeAgo || 'Just now'}</p>
        </div>
      </div>
      
      <p className="text-[var(--on-surface)] mb-4 whitespace-pre-wrap">{post.content}</p>
      
      {post.imageUrl && (
        <div className="rounded-xl overflow-hidden mb-4">
          <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover" />
        </div>
      )}
      
      <div className="flex items-center justify-between text-[var(--on-surface-variant)] mt-4 pt-2 border-t border-[var(--surface-container-high)]/30">
        <button className="flex items-center gap-1.5 hover:text-[var(--primary)] hover:glow-primary-interactive transition-all rounded-full p-2">
          <Heart size={20} />
          <span className="text-sm">{post.likesCount || 0}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-[var(--primary)] hover:glow-primary-interactive transition-all rounded-full p-2">
          <MessageSquare size={20} />
          <span className="text-sm">{post.commentsCount || 0}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-[var(--primary)] transition-all rounded-full p-2">
          <Share2 size={20} />
        </button>
      </div>
    </GlassCard>
  );
};

export default PostCard;
