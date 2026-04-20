# VibeMatch101 — Supabase Backend

## Database Schema

Run this SQL in the Supabase SQL Editor to set up all tables.

```sql
-- ═══════════════════════════════════════════════════════
-- USERS TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  age INTEGER,
  branch TEXT,
  division TEXT,
  year TEXT,
  hostel_or_day TEXT,
  profile_photo_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- POSTS TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- LIKES TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- ═══════════════════════════════════════════════════════
-- COMMENTS TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- MESSAGES TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- REPORTS TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reported_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- BLOCKED USERS TABLE
-- ═══════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS blocked_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  blocked_user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, blocked_user_id)
);

-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY POLICIES
-- ═══════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

-- Users: anyone authenticated can read, only own can update
CREATE POLICY "Users are viewable by authenticated" ON users FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Posts: anyone authenticated can read/create, only own can delete
CREATE POLICY "Posts are viewable by authenticated" ON posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can create posts" ON posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Likes
CREATE POLICY "Likes are viewable by authenticated" ON likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can like" ON likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own likes" ON likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Comments
CREATE POLICY "Comments are viewable by authenticated" ON comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can comment" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Messages: only sender/receiver can access
CREATE POLICY "Users can view own messages" ON messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Authenticated users can send messages" ON messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Receiver can mark messages as read" ON messages FOR UPDATE TO authenticated
  USING (auth.uid() = receiver_id);

-- Reports
CREATE POLICY "Users can create reports" ON reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Users can view own reports" ON reports FOR SELECT TO authenticated USING (auth.uid() = reporter_id);

-- Blocked users
CREATE POLICY "Users can view own blocks" ON blocked_users FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = blocked_user_id);
CREATE POLICY "Users can block" ON blocked_users FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unblock" ON blocked_users FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════
-- ENABLE REALTIME FOR MESSAGES
-- ═══════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
```

## Storage Buckets

Create these in Supabase Dashboard → Storage:

1. **profile-photos** — Public bucket
2. **post-images** — Public bucket

### Storage Policies (apply via SQL):

```sql
-- Profile photos: public read, authenticated write
CREATE POLICY "Public read for profile photos" ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');
CREATE POLICY "Authenticated users can upload profile photos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-photos');
CREATE POLICY "Users can update own profile photos" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-photos');

-- Post images: public read, authenticated write
CREATE POLICY "Public read for post images" ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');
CREATE POLICY "Authenticated users can upload post images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'post-images');
```

## Auth Configuration

1. Enable **Email** provider in Supabase Dashboard → Authentication → Providers
2. Set redirect URL to your frontend domain (e.g., `http://localhost:5173` for local dev)
3. Email domain restriction is handled in the frontend signup page
