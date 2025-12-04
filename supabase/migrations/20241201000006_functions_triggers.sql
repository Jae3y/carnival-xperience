-- Migration: Database Functions and Triggers
-- Description: Creates utility functions and triggers for automated updates
-- Requirements: 2.5, 7.3, 8.2, 9.5

-- ============================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables with updated_at column
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
  BEFORE UPDATE ON hotels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hotel_bookings_updated_at
  BEFORE UPDATE ON hotel_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_safety_contacts_updated_at
  BEFORE UPDATE ON safety_contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lost_found_updated_at
  BEFORE UPDATE ON lost_found
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at
  BEFORE UPDATE ON incident_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_posts_updated_at
  BEFORE UPDATE ON user_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetups_updated_at
  BEFORE UPDATE ON meetups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_subscriptions_updated_at
  BEFORE UPDATE ON push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================
-- POST LIKE/UNLIKE COUNTER TRIGGERS
-- Requirements: 7.3
-- ============================================
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_posts
    SET likes_count = likes_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_posts
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_like_insert
  AFTER INSERT ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

CREATE TRIGGER trigger_post_like_delete
  AFTER DELETE ON post_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- ============================================
-- POST COMMENT COUNTER TRIGGERS
-- Requirements: 7.3
-- ============================================
CREATE OR REPLACE FUNCTION update_post_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE user_posts
    SET comments_count = comments_count + 1
    WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE user_posts
    SET comments_count = GREATEST(comments_count - 1, 0)
    WHERE id = OLD.post_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_post_comment_insert
  AFTER INSERT ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

CREATE TRIGGER trigger_post_comment_delete
  AFTER DELETE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();

-- ============================================
-- HOTEL AVAILABILITY UPDATE TRIGGER
-- Requirements: 2.5
-- ============================================
CREATE OR REPLACE FUNCTION update_hotel_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Decrease available rooms when booking is confirmed
    IF NEW.status = 'confirmed' THEN
      UPDATE hotels
      SET available_rooms = GREATEST(available_rooms - NEW.room_count, 0)
      WHERE id = NEW.hotel_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      -- Booking just confirmed, decrease availability
      UPDATE hotels
      SET available_rooms = GREATEST(available_rooms - NEW.room_count, 0)
      WHERE id = NEW.hotel_id;
    ELSIF OLD.status = 'confirmed' AND NEW.status IN ('cancelled', 'no-show') THEN
      -- Booking cancelled or no-show, restore availability
      UPDATE hotels
      SET available_rooms = LEAST(available_rooms + OLD.room_count, total_rooms)
      WHERE id = NEW.hotel_id;
    ELSIF OLD.status = 'confirmed' AND NEW.status = 'checked-out' THEN
      -- Guest checked out, restore availability
      UPDATE hotels
      SET available_rooms = LEAST(available_rooms + OLD.room_count, total_rooms)
      WHERE id = NEW.hotel_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_hotel_booking_availability
  AFTER INSERT OR UPDATE ON hotel_bookings
  FOR EACH ROW EXECUTE FUNCTION update_hotel_availability();


-- ============================================
-- RATING CALCULATION TRIGGER
-- Requirements: 9.5
-- ============================================
CREATE OR REPLACE FUNCTION update_reviewable_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating DECIMAL(3, 2);
  review_count INTEGER;
BEGIN
  -- Calculate new average rating and count
  SELECT 
    ROUND(AVG(rating)::numeric, 2),
    COUNT(*)
  INTO avg_rating, review_count
  FROM reviews
  WHERE reviewable_type = NEW.reviewable_type
    AND reviewable_id = NEW.reviewable_id
    AND is_hidden = false;

  -- Update the appropriate table based on reviewable_type
  IF NEW.reviewable_type = 'event' THEN
    UPDATE events
    SET rating = avg_rating, review_count = review_count
    WHERE id = NEW.reviewable_id;
  ELSIF NEW.reviewable_type = 'hotel' THEN
    UPDATE hotels
    SET rating = avg_rating, review_count = review_count
    WHERE id = NEW.reviewable_id;
  ELSIF NEW.reviewable_type = 'vendor' THEN
    UPDATE vendors
    SET rating = avg_rating, review_count = review_count
    WHERE id = NEW.reviewable_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_review_rating_update
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_reviewable_rating();

-- ============================================
-- BADGE AWARD TRIGGER
-- Requirements: 8.2
-- ============================================
CREATE OR REPLACE FUNCTION check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  badge_record RECORD;
  user_checkin_count INTEGER;
  user_post_count INTEGER;
  user_points INTEGER;
BEGIN
  -- Get user's current stats
  SELECT COUNT(*) INTO user_checkin_count
  FROM event_checkins WHERE user_id = NEW.user_id;

  SELECT COUNT(*) INTO user_post_count
  FROM user_posts WHERE user_id = NEW.user_id;

  SELECT COALESCE((gamification_stats->>'points')::integer, 0) INTO user_points
  FROM user_profiles WHERE id = NEW.user_id;

  -- Check each badge requirement
  FOR badge_record IN 
    SELECT * FROM badges 
    WHERE is_active = true 
    AND id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = NEW.user_id)
  LOOP
    -- Check attendance badges
    IF badge_record.requirement_type = 'checkins' AND user_checkin_count >= badge_record.requirement_value THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.user_id, badge_record.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;

    -- Check social badges
    IF badge_record.requirement_type = 'posts' AND user_post_count >= badge_record.requirement_value THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.user_id, badge_record.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;

    -- Check points badges
    IF badge_record.requirement_type = 'points' AND user_points >= badge_record.requirement_value THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (NEW.user_id, badge_record.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger badge check on event checkin
CREATE TRIGGER trigger_badge_check_on_checkin
  AFTER INSERT ON event_checkins
  FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();

-- Trigger badge check on post creation
CREATE TRIGGER trigger_badge_check_on_post
  AFTER INSERT ON user_posts
  FOR EACH ROW EXECUTE FUNCTION check_and_award_badges();


-- ============================================
-- UPDATE USER POINTS ON CHECKIN
-- Requirements: 8.1
-- ============================================
CREATE OR REPLACE FUNCTION update_user_points_on_checkin()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user's gamification stats with new points
  UPDATE user_profiles
  SET gamification_stats = jsonb_set(
    gamification_stats,
    '{points}',
    to_jsonb(COALESCE((gamification_stats->>'points')::integer, 0) + NEW.points_awarded)
  )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_points_on_checkin
  AFTER INSERT ON event_checkins
  FOR EACH ROW EXECUTE FUNCTION update_user_points_on_checkin();

-- ============================================
-- EVENT SAVE/UNSAVE COUNTER
-- ============================================
CREATE OR REPLACE FUNCTION update_event_save_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE events
    SET save_count = save_count + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE events
    SET save_count = GREATEST(save_count - 1, 0)
    WHERE id = OLD.event_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_event_save_insert
  AFTER INSERT ON saved_events
  FOR EACH ROW EXECUTE FUNCTION update_event_save_count();

CREATE TRIGGER trigger_event_save_delete
  AFTER DELETE ON saved_events
  FOR EACH ROW EXECUTE FUNCTION update_event_save_count();

-- ============================================
-- CHALLENGE PARTICIPANT COUNTER
-- ============================================
CREATE OR REPLACE FUNCTION update_challenge_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE challenges
    SET participant_count = participant_count + 1
    WHERE id = NEW.challenge_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE challenges
    SET participant_count = GREATEST(participant_count - 1, 0)
    WHERE id = OLD.challenge_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_challenge_participant_insert
  AFTER INSERT ON user_challenges
  FOR EACH ROW EXECUTE FUNCTION update_challenge_participant_count();

CREATE TRIGGER trigger_challenge_participant_delete
  AFTER DELETE ON user_challenges
  FOR EACH ROW EXECUTE FUNCTION update_challenge_participant_count();

-- ============================================
-- CHALLENGE COMPLETION COUNTER
-- ============================================
CREATE OR REPLACE FUNCTION update_challenge_completion_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE challenges
    SET completion_count = completion_count + 1
    WHERE id = NEW.challenge_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_challenge_completion_update
  AFTER UPDATE ON user_challenges
  FOR EACH ROW EXECUTE FUNCTION update_challenge_completion_count();

-- ============================================
-- EVENT ATTENDANCE COUNTER
-- ============================================
CREATE OR REPLACE FUNCTION update_event_attendance_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE events
  SET attendance_count = attendance_count + 1
  WHERE id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_event_attendance_on_checkin
  AFTER INSERT ON event_checkins
  FOR EACH ROW EXECUTE FUNCTION update_event_attendance_count();

-- ============================================
-- GENERATE UNIQUE BOOKING REFERENCE
-- ============================================
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
DECLARE
  ref TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    -- Generate reference: CX + timestamp + random chars
    ref := 'CX' || TO_CHAR(NOW(), 'YYMMDD') || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6));
    
    -- Check if reference already exists
    SELECT COUNT(*) INTO exists_count FROM hotel_bookings WHERE booking_reference = ref;
    
    IF exists_count = 0 THEN
      NEW.booking_reference := ref;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_booking_reference
  BEFORE INSERT ON hotel_bookings
  FOR EACH ROW
  WHEN (NEW.booking_reference IS NULL)
  EXECUTE FUNCTION generate_booking_reference();

-- ============================================
-- GENERATE UNIQUE LOCATION SHARE CODE
-- ============================================
CREATE OR REPLACE FUNCTION generate_share_code()
RETURNS TRIGGER AS $$
DECLARE
  code TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    -- Generate 8-character alphanumeric code
    code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 8));
    
    -- Check if code already exists
    SELECT COUNT(*) INTO exists_count FROM location_shares WHERE share_code = code;
    
    IF exists_count = 0 THEN
      NEW.share_code := code;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_share_code
  BEFORE INSERT ON location_shares
  FOR EACH ROW
  WHEN (NEW.share_code IS NULL)
  EXECUTE FUNCTION generate_share_code();

-- ============================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates updated_at timestamp';
COMMENT ON FUNCTION update_post_likes_count() IS 'Maintains accurate like count on posts';
COMMENT ON FUNCTION update_post_comments_count() IS 'Maintains accurate comment count on posts';
COMMENT ON FUNCTION update_hotel_availability() IS 'Updates hotel room availability on booking changes';
COMMENT ON FUNCTION update_reviewable_rating() IS 'Calculates and updates average rating for reviewable entities';
COMMENT ON FUNCTION check_and_award_badges() IS 'Checks and awards badges based on user activity';
COMMENT ON FUNCTION generate_booking_reference() IS 'Generates unique booking reference codes';
COMMENT ON FUNCTION generate_share_code() IS 'Generates unique location share codes';
COMMENT ON FUNCTION handle_new_user() IS 'Creates user profile on new user signup';
