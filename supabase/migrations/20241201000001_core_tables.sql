-- Migration: Core Tables
-- Description: Creates user_profiles, events, hotels, and hotel_bookings tables
-- Requirements: 1.1, 2.1, 10.1

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  phone TEXT,
  language_preference TEXT DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{
    "email": true,
    "push": true,
    "sms": false,
    "eventReminders": true,
    "safetyAlerts": true,
    "communityUpdates": true
  }'::jsonb,
  location_sharing_enabled BOOLEAN DEFAULT false,
  emergency_contacts JSONB DEFAULT '[]'::jsonb,
  preferences JSONB DEFAULT '{
    "favoriteCategories": [],
    "accessibilityNeeds": []
  }'::jsonb,
  gamification_stats JSONB DEFAULT '{
    "badges": [],
    "points": 0,
    "level": 1
  }'::jsonb,
  is_verified BOOLEAN DEFAULT false,
  is_vendor BOOLEAN DEFAULT false,
  is_organizer BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for username lookups
CREATE INDEX idx_user_profiles_username ON user_profiles(username);

-- ============================================
-- EVENTS TABLE
-- ============================================

-- Event category enum
CREATE TYPE event_category AS ENUM (
  'parade',
  'music',
  'culture',
  'kids',
  'exhibition',
  'sports',
  'nightlife',
  'workshop',
  'competition'
);

-- Event status enum
CREATE TYPE event_status AS ENUM (
  'draft',
  'upcoming',
  'live',
  'completed',
  'cancelled'
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT NOT NULL,
  long_description TEXT,
  category event_category NOT NULL,
  subcategory TEXT,
  tags TEXT[] DEFAULT '{}',
  venue_name TEXT NOT NULL,
  venue_description TEXT,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  address TEXT,
  capacity INTEGER,
  attendance_count INTEGER DEFAULT 0,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  timezone TEXT DEFAULT 'Africa/Lagos',
  featured_image TEXT,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  live_stream_url TEXT,
  organizer_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  organizer_name TEXT,
  is_free BOOLEAN DEFAULT true,
  ticket_required BOOLEAN DEFAULT false,
  ticket_price DECIMAL(10, 2),
  tickets_available INTEGER,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_live BOOLEAN DEFAULT false,
  accessibility_features TEXT[] DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  view_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  status event_status DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for events
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_is_featured ON events(is_featured) WHERE is_featured = true;
CREATE INDEX idx_events_is_live ON events(is_live) WHERE is_live = true;
CREATE INDEX idx_events_location ON events USING GIST (
  ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
);

-- Saved events junction table
CREATE TABLE saved_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

CREATE INDEX idx_saved_events_user ON saved_events(user_id);
CREATE INDEX idx_saved_events_event ON saved_events(event_id);


-- ============================================
-- HOTELS TABLE
-- ============================================

-- Price range enum
CREATE TYPE price_range AS ENUM ('budget', 'mid-range', 'luxury');

CREATE TABLE hotels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  website TEXT,
  whatsapp TEXT,
  star_rating INTEGER CHECK (star_rating >= 1 AND star_rating <= 5) NOT NULL,
  price_range price_range NOT NULL,
  price_per_night_min DECIMAL(10, 2) NOT NULL,
  price_per_night_max DECIMAL(10, 2) NOT NULL,
  total_rooms INTEGER NOT NULL,
  available_rooms INTEGER NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  room_types JSONB DEFAULT '[]'::jsonb,
  policies JSONB DEFAULT '{
    "checkIn": "14:00",
    "checkOut": "11:00",
    "cancellation": "Free cancellation up to 24 hours before check-in",
    "payment": ["card", "bank_transfer"]
  }'::jsonb,
  images TEXT[] DEFAULT '{}',
  virtual_tour_url TEXT,
  distance_from_center DECIMAL(10, 2) DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  paystack_subaccount_code TEXT,
  commission_rate DECIMAL(5, 2) DEFAULT 10.00,
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  carnival_special_rate DECIMAL(5, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for hotels
CREATE INDEX idx_hotels_price_range ON hotels(price_range);
CREATE INDEX idx_hotels_star_rating ON hotels(star_rating);
CREATE INDEX idx_hotels_is_active ON hotels(is_active) WHERE is_active = true;
CREATE INDEX idx_hotels_distance ON hotels(distance_from_center);
CREATE INDEX idx_hotels_location ON hotels USING GIST (
  ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
);

-- ============================================
-- HOTEL BOOKINGS TABLE
-- ============================================

-- Payment status enum
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Booking status enum
CREATE TYPE booking_status AS ENUM (
  'pending',
  'confirmed',
  'checked-in',
  'checked-out',
  'cancelled',
  'no-show'
);

CREATE TABLE hotel_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_reference TEXT UNIQUE NOT NULL,
  hotel_id UUID NOT NULL REFERENCES hotels(id) ON DELETE RESTRICT,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE RESTRICT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  nights INTEGER NOT NULL,
  room_type TEXT NOT NULL,
  room_count INTEGER NOT NULL DEFAULT 1,
  guest_count INTEGER NOT NULL,
  price_per_night DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT NOT NULL,
  special_requests TEXT,
  payment_status payment_status DEFAULT 'pending',
  payment_reference TEXT,
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  status booking_status DEFAULT 'pending',
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
  CONSTRAINT valid_nights CHECK (nights > 0),
  CONSTRAINT valid_room_count CHECK (room_count > 0),
  CONSTRAINT valid_guest_count CHECK (guest_count > 0)
);

-- Indexes for hotel_bookings
CREATE INDEX idx_hotel_bookings_hotel ON hotel_bookings(hotel_id);
CREATE INDEX idx_hotel_bookings_user ON hotel_bookings(user_id);
CREATE INDEX idx_hotel_bookings_reference ON hotel_bookings(booking_reference);
CREATE INDEX idx_hotel_bookings_dates ON hotel_bookings(check_in_date, check_out_date);
CREATE INDEX idx_hotel_bookings_status ON hotel_bookings(status);
CREATE INDEX idx_hotel_bookings_payment_status ON hotel_bookings(payment_status);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE user_profiles IS 'User profile information extending Supabase auth.users';
COMMENT ON TABLE events IS 'Carnival events with location, timing, and metadata';
COMMENT ON TABLE saved_events IS 'Junction table for user saved events';
COMMENT ON TABLE hotels IS 'Hotel listings with room types and amenities';
COMMENT ON TABLE hotel_bookings IS 'Hotel booking records with payment tracking';
