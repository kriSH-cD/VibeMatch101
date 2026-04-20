import React, { useState } from 'react';
import TopBar from '../components/layout/TopBar';
import BottomNav from '../components/layout/BottomNav';
import FloatingActionButton from '../components/layout/FloatingActionButton';
import PostCard from '../components/feed/PostCard';
import CreatePostModal from '../components/feed/CreatePostModal';
import { Bell } from 'lucide-react';

const MOCK_POSTS = [
  {
    id: 1,
    user: { name: 'Sarah Jenkins', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    content: 'Just aced my algorithms final! Time to celebrate tonight 🥳 Who\'s going to the student union?',
    timeAgo: '2 hours ago',
    likesCount: 24,
    commentsCount: 5
  },
  {
    id: 2,
    user: { name: 'Late Night Library Club', avatarUrl: '' },
    content: 'Library is packed right now on the 3rd floor. We have an open table by the windows if anyone needs a spot.',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    timeAgo: '4 hours ago',
    likesCount: 112,
    commentsCount: 18
  }
];

const Feed = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [isModalOpen, setModalOpen] = useState(false);

  const handlePost = ({ content }) => {
    const newPost = {
      id: Date.now(),
      user: { name: 'You', avatarUrl: '' },
      content,
      timeAgo: 'Just now',
      likesCount: 0,
      commentsCount: 0
    };
    setPosts([newPost, ...posts]);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--surface-container-lowest)] pb-24">
      <TopBar 
        title="Campus Feed" 
        rightElement={
          <button className="relative p-2 rounded-full hover:bg-[var(--surface-container-low)]">
            <Bell size={24} className="text-[var(--on-surface)]" />
            <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--tertiary)] rounded-full"></div>
          </button>
        }
      />
      
      <div className="px-4 py-4 max-w-lg mx-auto">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <FloatingActionButton onClick={() => setModalOpen(true)} />
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)}
        onSubmit={handlePost} 
      />
      
      <BottomNav />
    </div>
  );
};

export default Feed;
