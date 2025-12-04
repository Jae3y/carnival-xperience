-- Migration: Social and Gamification Tables
-- Description: Creates user_posts, post_likes, post_comments, badges, user_badges, challenges, user_challenges, meetups, meetup_participants
-- Requirements: 7.1, 7.3, 8.1, 8.2

-- ============================================
-- USER POSTS TABLE (Community Feed & Stories)
-- ============================================

-- Post type enum
CREATE TYPE post_type AS ENUM ('post', 'story');

-- Media type enum
CREATE TYPE media_type AS ENUM ('image', 'video');

CREATE TABLE user_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  type post_type DEFAULT 'post',
  caption TEXT,
  media_url TEXT NOT NULL,
  media_type media_type DEFAULT 'image',
  thumbnail_url TEXT,
  location_name TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_flagged BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  ai_tags TEXT[] DEFAULT '{}',
  ai_description TEXT,
  sentiment_score DECIMAL(3, 2),
  expires_at TIMESTAMPTZ, -- For stories (24 hours after creation)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_posts_user ON user_posts(user_id);
CREATE INDEX idx_user_posts_event ON user_posts(event_id);
CREATE INDEX idx_user_posts_type ON user_posts(type);
CREATE INDEX idx_user_posts_created ON user_posts(created_at DESC);
CREATE INDEX idx_user_posts_expires ON user_posts(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_user_posts_visible ON user_posts(is_hidden) WHERE is_hidden = false;


-- ============================================
-- POST LIKES TABLE
-- ============================================
CREATE TABLE post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_post_likes_post ON post_likes(post_id);
CREATE INDEX idx_post_likes_user ON post_likes(user_id);

-- ============================================
-- POST COMMENTS TABLE
-- ============================================
CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_post_comments_post ON post_comments(post_id);
CREATE INDEX idx_post_comments_user ON post_comments(user_id);
CREATE INDEX idx_post_comments_created ON post_comments(created_at DESC);

-- ============================================
-- BADGES TABLE
-- ============================================

-- Badge category enum
CREATE TYPE badge_category AS ENUM (
  'attendance',
  'social',
  'explorer',
  'safety',
  'contributor',
  'special'
);

-- Badge rarity enum
CREATE TYPE badge_rarity AS ENUM ('common', 'rare', 'epic', 'legendary');

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category badge_category NOT NULL,
  rarity badge_rarity DEFAULT 'common',
  points INTEGER DEFAULT 0,
  requirement_type TEXT,
  requirement_value INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_badges_category ON badges(category);
CREATE INDEX idx_badges_rarity ON badges(rarity);
CREATE INDEX idx_badges_active ON badges(is_active) WHERE is_active = true;

-- ============================================
-- USER BADGES TABLE
-- ============================================
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);


-- ============================================
-- CHALLENGES TABLE
-- ============================================

-- Challenge type enum
CREATE TYPE challenge_type AS ENUM ('daily', 'weekly', 'special', 'event');

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type challenge_type DEFAULT 'daily',
  points_reward INTEGER DEFAULT 0,
  badge_reward_id UUID REFERENCES badges(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  requirement TEXT NOT NULL,
  participant_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenges_type ON challenges(type);
CREATE INDEX idx_challenges_dates ON challenges(start_date, end_date);
CREATE INDEX idx_challenges_active ON challenges(is_active) WHERE is_active = true;

-- ============================================
-- USER CHALLENGES TABLE
-- ============================================

-- Challenge progress status enum
CREATE TYPE challenge_progress_status AS ENUM ('in_progress', 'completed', 'failed');

CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  status challenge_progress_status DEFAULT 'in_progress',
  completed_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_challenges_user ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_challenge ON user_challenges(challenge_id);
CREATE INDEX idx_user_challenges_status ON user_challenges(status);

-- ============================================
-- EVENT CHECK-INS TABLE
-- ============================================
CREATE TABLE event_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  points_awarded INTEGER DEFAULT 0,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_event_checkins_user ON event_checkins(user_id);
CREATE INDEX idx_event_checkins_event ON event_checkins(event_id);
CREATE INDEX idx_event_checkins_date ON event_checkins(checked_in_at DESC);


-- ============================================
-- MEETUPS TABLE
-- ============================================
CREATE TABLE meetups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  location_name TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  max_participants INTEGER,
  is_public BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meetups_creator ON meetups(created_by);
CREATE INDEX idx_meetups_scheduled ON meetups(scheduled_at);
CREATE INDEX idx_meetups_active ON meetups(is_active) WHERE is_active = true;
CREATE INDEX idx_meetups_location ON meetups USING GIST (
  ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
);

-- ============================================
-- MEETUP PARTICIPANTS TABLE
-- ============================================
CREATE TABLE meetup_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meetup_id UUID NOT NULL REFERENCES meetups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meetup_id, user_id)
);

CREATE INDEX idx_meetup_participants_meetup ON meetup_participants(meetup_id);
CREATE INDEX idx_meetup_participants_user ON meetup_participants(user_id);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE user_posts IS 'Community posts and stories with engagement tracking';
COMMENT ON TABLE post_likes IS 'Post likes junction table';
COMMENT ON TABLE post_comments IS 'Comments on community posts';
COMMENT ON TABLE badges IS 'Gamification badges with requirements';
COMMENT ON TABLE user_badges IS 'Badges earned by users';
COMMENT ON TABLE challenges IS 'Time-limited challenges with rewards';
COMMENT ON TABLE user_challenges IS 'User progress on challenges';
COMMENT ON TABLE event_checkins IS 'Event check-ins for gamification points';
COMMENT ON TABLE meetups IS 'User-created meetup events';
COMMENT ON TABLE meetup_participants IS 'Meetup participation tracking';
