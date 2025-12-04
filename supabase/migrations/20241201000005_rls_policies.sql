-- Migration: Row Level Security Policies
-- Description: Enables RLS and creates policies for all tables
-- Requirements: 10.1

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE lost_found ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetup_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USER PROFILES POLICIES
-- ============================================
-- Users can view all profiles (public info)
CREATE POLICY "Profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ============================================
-- EVENTS POLICIES (Public Read)
-- ============================================
-- Anyone can view published events
CREATE POLICY "Events are viewable by everyone"
  ON events FOR SELECT
  USING (status != 'draft' OR organizer_id = auth.uid());

-- Organizers can insert events
CREATE POLICY "Organizers can insert events"
  ON events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_organizer = true
    )
  );

-- Organizers can update their own events
CREATE POLICY "Organizers can update own events"
  ON events FOR UPDATE
  USING (organizer_id = auth.uid());

-- ============================================
-- SAVED EVENTS POLICIES
-- ============================================
-- Users can view their own saved events
CREATE POLICY "Users can view own saved events"
  ON saved_events FOR SELECT
  USING (user_id = auth.uid());

-- Users can save events
CREATE POLICY "Users can save events"
  ON saved_events FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can unsave events
CREATE POLICY "Users can unsave events"
  ON saved_events FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- HOTELS POLICIES (Public Read)
-- ============================================
-- Anyone can view active hotels
CREATE POLICY "Hotels are viewable by everyone"
  ON hotels FOR SELECT
  USING (is_active = true);

-- ============================================
-- HOTEL BOOKINGS POLICIES
-- ============================================
-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON hotel_bookings FOR SELECT
  USING (user_id = auth.uid());

-- Users can create bookings
CREATE POLICY "Users can create bookings"
  ON hotel_bookings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own pending bookings
CREATE POLICY "Users can update own pending bookings"
  ON hotel_bookings FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

-- ============================================
-- SAFETY CONTACTS POLICIES
-- ============================================
-- Users can manage their own safety contacts
CREATE POLICY "Users can view own safety contacts"
  ON safety_contacts FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert safety contacts"
  ON safety_contacts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own safety contacts"
  ON safety_contacts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own safety contacts"
  ON safety_contacts FOR DELETE
  USING (user_id = auth.uid());


-- ============================================
-- LOCATION SHARES POLICIES
-- ============================================
-- Users can view their own location shares
CREATE POLICY "Users can view own location shares"
  ON location_shares FOR SELECT
  USING (user_id = auth.uid());

-- Public location shares are viewable by anyone
CREATE POLICY "Public location shares are viewable"
  ON location_shares FOR SELECT
  USING (is_public = true AND expires_at > NOW());

-- Users can create location shares
CREATE POLICY "Users can create location shares"
  ON location_shares FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own location shares
CREATE POLICY "Users can update own location shares"
  ON location_shares FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own location shares
CREATE POLICY "Users can delete own location shares"
  ON location_shares FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- FAMILY GROUPS POLICIES
-- ============================================
-- Users can view groups they created or are members of
CREATE POLICY "Users can view own family groups"
  ON family_groups FOR SELECT
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM family_members
      WHERE group_id = family_groups.id AND user_id = auth.uid()
    )
  );

-- Users can create family groups
CREATE POLICY "Users can create family groups"
  ON family_groups FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Group creators can update their groups
CREATE POLICY "Creators can update family groups"
  ON family_groups FOR UPDATE
  USING (created_by = auth.uid());

-- Group creators can delete their groups
CREATE POLICY "Creators can delete family groups"
  ON family_groups FOR DELETE
  USING (created_by = auth.uid());

-- ============================================
-- FAMILY MEMBERS POLICIES
-- ============================================
-- Users can view members of groups they belong to
CREATE POLICY "Users can view family members"
  ON family_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM family_groups
      WHERE id = family_members.group_id
      AND (
        created_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM family_members fm
          WHERE fm.group_id = family_groups.id AND fm.user_id = auth.uid()
        )
      )
    )
  );

-- Group creators can manage members
CREATE POLICY "Creators can insert family members"
  ON family_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_groups
      WHERE id = family_members.group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Creators can update family members"
  ON family_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM family_groups
      WHERE id = family_members.group_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "Creators can delete family members"
  ON family_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM family_groups
      WHERE id = family_members.group_id AND created_by = auth.uid()
    )
  );


-- ============================================
-- LOST AND FOUND POLICIES
-- ============================================
-- Anyone can view open lost/found items
CREATE POLICY "Lost/found items are viewable"
  ON lost_found FOR SELECT
  USING (status = 'open' OR user_id = auth.uid());

-- Users can create lost/found reports
CREATE POLICY "Users can create lost/found reports"
  ON lost_found FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own reports
CREATE POLICY "Users can update own lost/found reports"
  ON lost_found FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- INCIDENT REPORTS POLICIES
-- ============================================
-- Users can view their own incident reports
CREATE POLICY "Users can view own incident reports"
  ON incident_reports FOR SELECT
  USING (user_id = auth.uid());

-- Users can create incident reports
CREATE POLICY "Users can create incident reports"
  ON incident_reports FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own reports
CREATE POLICY "Users can update own incident reports"
  ON incident_reports FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- USER POSTS POLICIES
-- ============================================
-- Anyone can view non-hidden posts
CREATE POLICY "Posts are viewable by everyone"
  ON user_posts FOR SELECT
  USING (is_hidden = false OR user_id = auth.uid());

-- Users can create posts
CREATE POLICY "Users can create posts"
  ON user_posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON user_posts FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON user_posts FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- POST LIKES POLICIES
-- ============================================
-- Anyone can view likes
CREATE POLICY "Likes are viewable by everyone"
  ON post_likes FOR SELECT
  USING (true);

-- Users can like posts
CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can unlike posts
CREATE POLICY "Users can unlike posts"
  ON post_likes FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- POST COMMENTS POLICIES
-- ============================================
-- Anyone can view non-hidden comments
CREATE POLICY "Comments are viewable by everyone"
  ON post_comments FOR SELECT
  USING (is_hidden = false OR user_id = auth.uid());

-- Users can create comments
CREATE POLICY "Users can create comments"
  ON post_comments FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  USING (user_id = auth.uid());


-- ============================================
-- BADGES POLICIES (Public Read)
-- ============================================
-- Anyone can view active badges
CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (is_active = true);

-- ============================================
-- USER BADGES POLICIES
-- ============================================
-- Anyone can view user badges
CREATE POLICY "User badges are viewable by everyone"
  ON user_badges FOR SELECT
  USING (true);

-- ============================================
-- CHALLENGES POLICIES (Public Read)
-- ============================================
-- Anyone can view active challenges
CREATE POLICY "Challenges are viewable by everyone"
  ON challenges FOR SELECT
  USING (is_active = true);

-- ============================================
-- USER CHALLENGES POLICIES
-- ============================================
-- Users can view their own challenge progress
CREATE POLICY "Users can view own challenges"
  ON user_challenges FOR SELECT
  USING (user_id = auth.uid());

-- Users can join challenges
CREATE POLICY "Users can join challenges"
  ON user_challenges FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own challenge progress
CREATE POLICY "Users can update own challenge progress"
  ON user_challenges FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- EVENT CHECKINS POLICIES
-- ============================================
-- Users can view their own checkins
CREATE POLICY "Users can view own checkins"
  ON event_checkins FOR SELECT
  USING (user_id = auth.uid());

-- Users can create checkins
CREATE POLICY "Users can create checkins"
  ON event_checkins FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- MEETUPS POLICIES
-- ============================================
-- Anyone can view public active meetups
CREATE POLICY "Meetups are viewable by everyone"
  ON meetups FOR SELECT
  USING (is_public = true AND is_active = true OR created_by = auth.uid());

-- Users can create meetups
CREATE POLICY "Users can create meetups"
  ON meetups FOR INSERT
  WITH CHECK (created_by = auth.uid());

-- Creators can update their meetups
CREATE POLICY "Creators can update meetups"
  ON meetups FOR UPDATE
  USING (created_by = auth.uid());

-- Creators can delete their meetups
CREATE POLICY "Creators can delete meetups"
  ON meetups FOR DELETE
  USING (created_by = auth.uid());

-- ============================================
-- MEETUP PARTICIPANTS POLICIES
-- ============================================
-- Anyone can view participants of public meetups
CREATE POLICY "Meetup participants are viewable"
  ON meetup_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meetups
      WHERE id = meetup_participants.meetup_id
      AND (is_public = true OR created_by = auth.uid())
    )
  );

-- Users can join meetups
CREATE POLICY "Users can join meetups"
  ON meetup_participants FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can leave meetups
CREATE POLICY "Users can leave meetups"
  ON meetup_participants FOR DELETE
  USING (user_id = auth.uid());


-- ============================================
-- VENDORS POLICIES (Public Read)
-- ============================================
-- Anyone can view active vendors
CREATE POLICY "Vendors are viewable by everyone"
  ON vendors FOR SELECT
  USING (is_active = true);

-- Vendor owners can update their vendor profile
CREATE POLICY "Vendors can update own profile"
  ON vendors FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- REVIEWS POLICIES
-- ============================================
-- Anyone can view non-hidden reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (is_hidden = false OR user_id = auth.uid());

-- Users can create reviews
CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (user_id = auth.uid());

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- ANALYTICS EVENTS POLICIES
-- ============================================
-- Users can insert analytics events
CREATE POLICY "Users can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Only admins can view analytics (handled by service role)
-- No SELECT policy for regular users

-- ============================================
-- DAILY METRICS POLICIES
-- ============================================
-- Only admins can view metrics (handled by service role)
-- No policies for regular users

-- ============================================
-- NOTIFICATIONS POLICIES
-- ============================================
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- PUSH SUBSCRIPTIONS POLICIES
-- ============================================
-- Users can manage their own push subscriptions
CREATE POLICY "Users can view own push subscriptions"
  ON push_subscriptions FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create push subscriptions"
  ON push_subscriptions FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own push subscriptions"
  ON push_subscriptions FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own push subscriptions"
  ON push_subscriptions FOR DELETE
  USING (user_id = auth.uid());

-- ============================================
-- CHAT SESSIONS POLICIES
-- ============================================
-- Users can view their own chat sessions
CREATE POLICY "Users can view own chat sessions"
  ON chat_sessions FOR SELECT
  USING (user_id = auth.uid());

-- Users can create chat sessions
CREATE POLICY "Users can create chat sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can update their own chat sessions
CREATE POLICY "Users can update own chat sessions"
  ON chat_sessions FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- CHAT MESSAGES POLICIES
-- ============================================
-- Users can view messages in their own sessions
CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id AND user_id = auth.uid()
    )
  );

-- Users can insert messages in their own sessions
CREATE POLICY "Users can insert chat messages"
  ON chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE id = chat_messages.session_id AND user_id = auth.uid()
    )
  );
