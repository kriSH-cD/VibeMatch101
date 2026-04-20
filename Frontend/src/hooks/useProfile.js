import { useState, useEffect } from 'react';

const USER_DATA = {
  name: "Elena Rodriguez",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAf4mdEfnM-JQzyf5cJf97OHnGEBXp54sPRiDy1ciw5Gf39eoQzwoW8NC0gc0lXZ2lSHNO94a5A-w0ICJ5FT-6qFiZaFTDyOWkAV8Z_AK3tqdAD-0orGzHK_abXPF9FYliWi9wXEJJucFlbP6Xx6azFtRUjheVoSukM0MjF-yvArPybK8HxsmU0eX_zVAucrVBA8jNl5PSK8fKOBBElYbhWM5PRa5kNAgqFbe88HOSh2dStkh6Bzp2LWlu1XZ1rUY5f5eVDgYHCGH1h",
  tags: ["Computer Science", "Junior Year", "Orion Hall"],
  bio: "Designing pixel-perfect worlds by day, debugging the universe by night. Looking for a coffee buddy at the tech cafe."
};

const MOCK_POSTS = [
  {
    id: 1,
    time: "2 hours ago",
    content: "The view from the library rooftop at sunset is absolutely unmatched today. Anyone else catching the vibe? 🌇",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_jfzWLZNyKjqYMJvI7GVH3MZ7V_iuRqYrYscOia7AwpO-loWxrBSaA3vXa-Lkqj6gh1PZk9gxu3qg3Q0Q9cgCrFkfCmDhHsJAgI-m0BKCWiLqk5uhMUGYNObYtZ7cU7k2a-FQdTYSm754Am9bZGnGXlgZMth6ABcsWQVRzddT_nR4_8hmLMt1zEV7YlUNSROG2KNqd1kyJNMCB2K7fNnYO3oPBhXZL_kvumt5G8E1pSJ6J6_TNNlGEKQdY-dG4gRbZ-84H6hnlhaD",
    likes: 42,
    comments: 12,
    isLiked: true
  },
  {
    id: 2,
    time: "Yesterday",
    content: "Finally finished my UI project for Advanced Design. Sleep is for the weak (or for people who aren't perfectionists). 🎨✨",
    likes: 128,
    comments: 34,
    isLiked: false
  }
];

export const useProfile = (userId = null) => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate database lookup latency
    const timer = setTimeout(() => {
      setProfile(USER_DATA);
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [userId]);

  return { profile, posts, loading };
};
