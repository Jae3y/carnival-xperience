-- Migration: Carnival Enhancements RLS Policies
-- Description: Enables RLS and creates policies for carnival enhancement tables
-- Requirements: 1.2, 1.3

-- ============================================
-- ENABLE RLS ON CARNIVAL TABLES
-- ============================================
ALTER TABLE bands ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BANDS POLICIES (Public Read)
-- ============================================
-- Anyone can view bands
CREATE POLICY "Bands are viewable by everyone"
  ON bands FOR SELECT
  USING (true);

-- Only admins can insert bands (handled by service role)
-- No INSERT policy for regular users

-- Only admins can update bands (handled by service role)
-- No UPDATE policy for regular users

-- Only admins can delete bands (handled by service role)
-- No DELETE policy for regular users

-- ============================================
-- BAND VOTES POLICIES
-- ============================================
-- Users can view all votes (for transparency)
CREATE POLICY "Band votes are viewable by everyone"
  ON band_votes FOR SELECT
  USING (true);

-- Authenticated users can vote (insert)
CREATE POLICY "Authenticated users can vote for bands"
  ON band_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update votes (votes are immutable)
-- No UPDATE policy

-- Users can delete their own votes (to change vote)
CREATE POLICY "Users can delete own votes"
  ON band_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- CULTURAL CONTENT POLICIES (Public Read)
-- ============================================
-- Anyone can view cultural content
CREATE POLICY "Cultural content is viewable by everyone"
  ON cultural_content FOR SELECT
  USING (true);

-- Only admins can manage cultural content (handled by service role)
-- No INSERT, UPDATE, DELETE policies for regular users

-- ============================================
-- LIVE UPDATES POLICIES (Public Read)
-- ============================================
-- Anyone can view live updates
CREATE POLICY "Live updates are viewable by everyone"
  ON live_updates FOR SELECT
  USING (true);

-- Only admins can create live updates (handled by service role)
-- No INSERT policy for regular users

-- Only admins can update live updates (handled by service role)
-- No UPDATE policy for regular users

-- Only admins can delete live updates (handled by service role)
-- No DELETE policy for regular users

-- ============================================
-- GALLERY PHOTOS POLICIES (Public Read)
-- ============================================
-- Anyone can view gallery photos
CREATE POLICY "Gallery photos are viewable by everyone"
  ON gallery_photos FOR SELECT
  USING (true);

-- Only admins can manage gallery photos (handled by service role)
-- No INSERT, UPDATE, DELETE policies for regular users

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON POLICY "Bands are viewable by everyone" ON bands IS 
  'Public read access for all bands';

COMMENT ON POLICY "Band votes are viewable by everyone" ON band_votes IS 
  'Public read access for transparency in voting';

COMMENT ON POLICY "Authenticated users can vote for bands" ON band_votes IS 
  'Authenticated users can cast votes, enforcing one vote per user per year via unique constraint';

COMMENT ON POLICY "Users can delete own votes" ON band_votes IS 
  'Users can delete their own votes to change their selection';

COMMENT ON POLICY "Cultural content is viewable by everyone" ON cultural_content IS 
  'Public read access for cultural and heritage content';

COMMENT ON POLICY "Live updates are viewable by everyone" ON live_updates IS 
  'Public read access for real-time carnival updates';

COMMENT ON POLICY "Gallery photos are viewable by everyone" ON gallery_photos IS 
  'Public read access for carnival photo gallery';
