-- Migration: Carnival Enhancements
-- Description: Creates tables for band voting, cultural content, live updates, and photo gallery
-- Requirements: 1.1, 1.2, 2.1, 3.1, 4.1

-- ============================================
-- CARNIVAL BANDS TABLE
-- ============================================
CREATE TABLE bands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  image_url TEXT,
  vote_count INTEGER DEFAULT 0 CHECK (vote_count >= 0),
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique band names per year
  CONSTRAINT unique_band_per_year UNIQUE(name, year)
);

-- Indexes for bands
CREATE INDEX idx_bands_year ON bands(year);
CREATE INDEX idx_bands_vote_count ON bands(vote_count DESC);
CREATE INDEX idx_bands_year_vote_count ON bands(year, vote_count DESC);

-- ============================================
-- BAND VOTES TABLE
-- ============================================
CREATE TABLE band_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  band_id UUID NOT NULL REFERENCES bands(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one vote per user per year
  CONSTRAINT unique_vote_per_user_per_year UNIQUE(user_id, year)
);

-- Indexes for band_votes
CREATE INDEX idx_band_votes_band ON band_votes(band_id);
CREATE INDEX idx_band_votes_user ON band_votes(user_id);
CREATE INDEX idx_band_votes_year ON band_votes(year);
CREATE INDEX idx_band_votes_user_year ON band_votes(user_id, year);

-- ============================================
-- CULTURAL CONTENT TABLE
-- ============================================
CREATE TABLE cultural_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for cultural_content
CREATE INDEX idx_cultural_content_category ON cultural_content(category);
CREATE INDEX idx_cultural_content_order ON cultural_content(order_index);

-- ============================================
-- LIVE UPDATES TABLE
-- ============================================
CREATE TABLE live_updates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  location TEXT,
  image_url TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for live_updates
CREATE INDEX idx_live_updates_created_at ON live_updates(created_at DESC);
CREATE INDEX idx_live_updates_event ON live_updates(event_id);
CREATE INDEX idx_live_updates_pinned ON live_updates(is_pinned) WHERE is_pinned = true;
CREATE INDEX idx_live_updates_pinned_created ON live_updates(is_pinned DESC, created_at DESC);

-- ============================================
-- GALLERY PHOTOS TABLE
-- ============================================
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  caption TEXT,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  photographer TEXT,
  taken_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  likes_count INTEGER DEFAULT 0 CHECK (likes_count >= 0)
);

-- Indexes for gallery_photos
CREATE INDEX idx_gallery_photos_event ON gallery_photos(event_id);
CREATE INDEX idx_gallery_photos_created_at ON gallery_photos(created_at DESC);
CREATE INDEX idx_gallery_photos_taken_at ON gallery_photos(taken_at DESC);
CREATE INDEX idx_gallery_photos_likes ON gallery_photos(likes_count DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for bands table
CREATE TRIGGER update_bands_updated_at
  BEFORE UPDATE ON bands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for cultural_content table
CREATE TRIGGER update_cultural_content_updated_at
  BEFORE UPDATE ON cultural_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTION TO INCREMENT VOTE COUNT
-- ============================================

-- Function to increment band vote count atomically
CREATE OR REPLACE FUNCTION increment_band_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bands
  SET vote_count = vote_count + 1
  WHERE id = NEW.band_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to increment vote count when a vote is added
CREATE TRIGGER increment_vote_count_on_insert
  AFTER INSERT ON band_votes
  FOR EACH ROW
  EXECUTE FUNCTION increment_band_vote_count();

-- Function to decrement band vote count atomically
CREATE OR REPLACE FUNCTION decrement_band_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bands
  SET vote_count = vote_count - 1
  WHERE id = OLD.band_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to decrement vote count when a vote is deleted
CREATE TRIGGER decrement_vote_count_on_delete
  AFTER DELETE ON band_votes
  FOR EACH ROW
  EXECUTE FUNCTION decrement_band_vote_count();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE bands IS 'Carnival bands participating in the competition';
COMMENT ON TABLE band_votes IS 'User votes for carnival bands (one vote per user per year)';
COMMENT ON TABLE cultural_content IS 'Cultural heritage and educational content about Calabar Carnival';
COMMENT ON TABLE live_updates IS 'Real-time updates during carnival events';
COMMENT ON TABLE gallery_photos IS 'Photo gallery of carnival moments';
