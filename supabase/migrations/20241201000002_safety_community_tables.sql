-- Migration: Safety and Community Tables
-- Description: Creates safety_contacts, location_shares, family_groups, family_members, lost_found, incident_reports
-- Requirements: 5.1, 5.3, 5.4, 6.1, 20.1

-- ============================================
-- SAFETY CONTACTS TABLE
-- ============================================
CREATE TABLE safety_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_safety_contacts_user ON safety_contacts(user_id);

-- ============================================
-- LOCATION SHARES TABLE
-- ============================================
CREATE TABLE location_shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  share_code TEXT UNIQUE NOT NULL,
  current_lat DECIMAL(10, 8) NOT NULL,
  current_lng DECIMAL(11, 8) NOT NULL,
  location_history JSONB DEFAULT '[]'::jsonb,
  name TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  update_interval INTEGER DEFAULT 30, -- seconds
  shared_with_emails TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  password_protected BOOLEAN DEFAULT false,
  access_password TEXT,
  geofence JSONB, -- { centerLat, centerLng, radiusMeters }
  sos_enabled BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_location_shares_user ON location_shares(user_id);
CREATE INDEX idx_location_shares_code ON location_shares(share_code);
CREATE INDEX idx_location_shares_expires ON location_shares(expires_at);


-- ============================================
-- FAMILY GROUPS TABLE
-- ============================================
CREATE TABLE family_groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  meeting_point_lat DECIMAL(10, 8),
  meeting_point_lng DECIMAL(11, 8),
  meeting_point_name TEXT,
  emergency_contact TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_groups_creator ON family_groups(created_by);
CREATE INDEX idx_family_groups_active ON family_groups(is_active) WHERE is_active = true;

-- ============================================
-- FAMILY MEMBERS TABLE
-- ============================================

-- Family member role enum
CREATE TYPE family_member_role AS ENUM ('parent', 'child', 'guardian', 'member');

CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES family_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  role family_member_role DEFAULT 'member',
  full_name TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  photo_url TEXT,
  description TEXT,
  is_missing BOOLEAN DEFAULT false,
  last_seen_lat DECIMAL(10, 8),
  last_seen_lng DECIMAL(11, 8),
  last_seen_at TIMESTAMPTZ,
  found_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_family_members_group ON family_members(group_id);
CREATE INDEX idx_family_members_user ON family_members(user_id);
CREATE INDEX idx_family_members_missing ON family_members(is_missing) WHERE is_missing = true;

-- ============================================
-- LOST AND FOUND TABLE
-- ============================================

-- Item category enum
CREATE TYPE item_category AS ENUM (
  'phone',
  'wallet',
  'bag',
  'jewelry',
  'documents',
  'keys',
  'clothing',
  'electronics',
  'other'
);

-- Lost/found status enum
CREATE TYPE lost_found_status AS ENUM (
  'open',
  'matched',
  'resolved',
  'claimed',
  'expired'
);

-- Lost/found type enum
CREATE TYPE lost_found_type AS ENUM ('lost', 'found');

CREATE TABLE lost_found (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type lost_found_type NOT NULL,
  item_name TEXT NOT NULL,
  item_description TEXT NOT NULL,
  category item_category NOT NULL,
  color TEXT,
  brand TEXT,
  distinctive_features TEXT,
  location_name TEXT NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  lost_found_at TIMESTAMPTZ,
  images TEXT[] DEFAULT '{}',
  ai_image_embedding VECTOR(1536), -- OpenAI embedding dimension
  ai_description TEXT,
  ai_suggested_matches UUID[] DEFAULT '{}',
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  contact_method_preference TEXT DEFAULT 'phone' CHECK (contact_method_preference IN ('phone', 'email')),
  status lost_found_status DEFAULT 'open',
  matched_with_id UUID REFERENCES lost_found(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  reward_offered BOOLEAN DEFAULT false,
  reward_amount DECIMAL(10, 2),
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lost_found_user ON lost_found(user_id);
CREATE INDEX idx_lost_found_type ON lost_found(type);
CREATE INDEX idx_lost_found_category ON lost_found(category);
CREATE INDEX idx_lost_found_status ON lost_found(status);
CREATE INDEX idx_lost_found_created ON lost_found(created_at DESC);


-- ============================================
-- INCIDENT REPORTS TABLE
-- ============================================

-- Incident severity enum
CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Incident status enum
CREATE TYPE incident_status AS ENUM (
  'reported',
  'acknowledged',
  'in-progress',
  'resolved',
  'closed'
);

CREATE TABLE incident_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity incident_severity NOT NULL,
  description TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  location_name TEXT,
  images TEXT[] DEFAULT '{}',
  status incident_status DEFAULT 'reported',
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_incident_reports_user ON incident_reports(user_id);
CREATE INDEX idx_incident_reports_severity ON incident_reports(severity);
CREATE INDEX idx_incident_reports_status ON incident_reports(status);
CREATE INDEX idx_incident_reports_created ON incident_reports(created_at DESC);
CREATE INDEX idx_incident_reports_location ON incident_reports USING GIST (
  ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
);

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE safety_contacts IS 'Emergency contacts for users';
COMMENT ON TABLE location_shares IS 'Temporary location sharing links with geofencing';
COMMENT ON TABLE family_groups IS 'Family groups for reunification tracking';
COMMENT ON TABLE family_members IS 'Members of family groups with missing status';
COMMENT ON TABLE lost_found IS 'Lost and found item reports with AI matching';
COMMENT ON TABLE incident_reports IS 'Safety incident reports with severity levels';
