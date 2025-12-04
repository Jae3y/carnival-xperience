# Design Document: CarnivalXperience

## Overview

CarnivalXperience is a Next.js 14 Progressive Web Application that serves as the ultimate digital companion for the Calabar Carnival. The platform combines cutting-edge technologies including AI-powered assistance, 3D mapping, AR navigation, and real-time communication to deliver an exceptional user experience.

The architecture follows a modern serverless approach using Next.js App Router with React Server Components, Supabase for backend services, and edge computing for optimal performance. The design prioritizes offline-first capabilities, accessibility, and investor-ready analytics.

### Key Design Principles

1. **Performance First**: Sub-2-second initial load, 60fps animations, optimistic UI updates
2. **Offline Resilient**: Service workers cache critical data, sync when online
3. **Accessibility**: WCAG 2.1 AA compliance, voice commands, multi-language support
4. **Real-Time**: WebSocket connections for live updates, location tracking, safety alerts
5. **Investor Ready**: Built-in analytics, revenue tracking, scalable architecture

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js 14 App Router (React Server Components + Client Components)        │
│  ├── Landing Page (GSAP, Three.js, Framer Motion)                          │
│  ├── Event Discovery (Filters, Calendar, Grid/List/Map views)              │
│  ├── Hotel Marketplace (Search, Booking, Payment)                          │
│  ├── Interactive Map (Mapbox GL, 3D Terrain, AR Overlay)                   │
│  ├── AI Concierge (Chat Interface, Voice Commands)                         │
│  ├── Safety Hub (Emergency, Location Share, Family Tracking)               │
│  ├── Community (Feed, Stories, Meetups)                                    │
│  └── Gamification (Badges, Leaderboard, Challenges)                        │
├─────────────────────────────────────────────────────────────────────────────┤
│  Service Worker (Offline Cache, Background Sync, Push Notifications)        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│  Next.js API Routes + Server Actions                                        │
│  ├── /api/events/* (CRUD, trending, search)                                │
│  ├── /api/hotels/* (search, availability, booking)                         │
│  ├── /api/ai/* (chat, recommendations, vision)                             │
│  ├── /api/location/* (share, track, crowd-density)                         │
│  ├── /api/payment/* (Paystack initialize, verify)                          │
│  ├── /api/upload (Cloudinary image processing)                             │
│  └── /api/analytics/* (tracking, metrics)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICES LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Supabase   │  │    Redis     │  │   OpenAI     │  │  Cloudinary  │    │
│  │  (Database,  │  │  (Upstash)   │  │  (GPT-4,     │  │   (Image     │    │
│  │   Auth,      │  │  Caching,    │  │   Vision)    │  │  Processing) │    │
│  │   Realtime)  │  │  Rate Limit  │  │              │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   Mapbox     │  │   Paystack   │  │   Twilio     │  │   PostHog    │    │
│  │  (Maps, Nav, │  │  (Payments)  │  │  (SMS,       │  │  (Analytics) │    │
│  │   Geocoding) │  │              │  │   WhatsApp)  │  │              │    │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Event Discovery Flow**: User → Filter Selection → Server Action → Supabase Query → Cached Response → UI Update
2. **Booking Flow**: User → Room Selection → Server Action → Paystack → Webhook → Supabase → Confirmation
3. **Real-Time Flow**: Supabase Realtime → WebSocket → Client State → UI Update
4. **AI Chat Flow**: User Message → API Route → OpenAI → Context Enrichment → Response

## Components and Interfaces

### Core UI Components

```typescript
// components/ui/magnetic-button.tsx
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magneticStrength?: number; // 0-1, default 0.3
  onClick?: () => void;
}

// components/animations/scroll-reveal.tsx
interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number; // 0-1, when to trigger
}

// components/animations/parallax-section.tsx
interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number; // parallax speed multiplier
  direction?: 'up' | 'down';
}
```

### Event Components

```typescript
// components/events/event-card.tsx
interface EventCardProps {
  event: Event;
  variant?: 'default' | 'compact' | 'featured';
  onSave?: (eventId: string) => void;
  onShare?: (event: Event) => void;
}

// components/events/event-filters.tsx
interface EventFiltersProps {
  categories: Category[];
  selectedCategories: string[];
  dateRange: DateRange | null;
  onCategoryChange: (categories: string[]) => void;
  onDateChange: (range: DateRange | null) => void;
  onReset: () => void;
}

// components/events/countdown-timer.tsx
interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
  variant?: 'default' | 'compact' | 'large';
}
```

### Map Components

```typescript
// components/map/map-container.tsx
interface MapContainerProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  pitch?: number; // 3D tilt angle
  bearing?: number; // rotation
  markers?: MapMarker[];
  layers?: MapLayer[];
  onMarkerClick?: (marker: MapMarker) => void;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

// components/map/route-display.tsx
interface RouteDisplayProps {
  origin: [number, number];
  destination: [number, number];
  mode?: 'walking' | 'driving';
  onRouteCalculated?: (route: Route) => void;
}

// components/map/heatmap-layer.tsx
interface HeatmapLayerProps {
  data: CrowdDensityPoint[];
  visible?: boolean;
  intensity?: number;
  radius?: number;
}
```

### Hotel Components

```typescript
// components/hotels/hotel-card.tsx
interface HotelCardProps {
  hotel: Hotel;
  onSelect?: (hotel: Hotel) => void;
  showDistance?: boolean;
}

// components/hotels/booking-form.tsx
interface BookingFormProps {
  hotel: Hotel;
  checkIn: Date;
  checkOut: Date;
  roomType: RoomType;
  onSubmit: (booking: BookingRequest) => Promise<void>;
  onCancel: () => void;
}

// components/hotels/payment-modal.tsx
interface PaymentModalProps {
  booking: BookingRequest;
  amount: number;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}
```

### Safety Components

```typescript
// components/safety/emergency-button.tsx
interface EmergencyButtonProps {
  onActivate: () => Promise<void>;
  contacts: EmergencyContact[];
  size?: 'default' | 'large';
}

// components/safety/location-share.tsx
interface LocationShareProps {
  onShare: (options: ShareOptions) => Promise<ShareLink>;
  defaultDuration?: number; // minutes
}

// components/safety/family-finder.tsx
interface FamilyFinderProps {
  group: FamilyGroup;
  members: FamilyMember[];
  onMarkMissing: (memberId: string) => void;
  onMarkFound: (memberId: string) => void;
}
```

### AI Components

```typescript
// components/ai/chat-interface.tsx
interface ChatInterfaceProps {
  sessionId?: string;
  onNewSession?: (sessionId: string) => void;
  systemPrompt?: string;
}

// components/ai/voice-command.tsx
interface VoiceCommandProps {
  onCommand: (command: string, intent: Intent) => void;
  language?: string;
  continuous?: boolean;
}
```

## Data Models

```typescript
// types/events.ts
interface Event {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  description: string;
  longDescription?: string;
  category: EventCategory;
  subcategory?: string;
  tags: string[];
  venueName: string;
  venueDescription?: string;
  locationLat: number;
  locationLng: number;
  address?: string;
  capacity?: number;
  attendanceCount: number;
  startTime: Date;
  endTime: Date;
  timezone: string;
  featuredImage?: string;
  images: string[];
  videoUrl?: string;
  liveStreamUrl?: string;
  organizerId?: string;
  organizerName?: string;
  isFree: boolean;
  ticketRequired: boolean;
  ticketPrice?: number;
  ticketsAvailable?: number;
  isFeatured: boolean;
  isTrending: boolean;
  isLive: boolean;
  accessibilityFeatures: string[];
  amenities: string[];
  viewCount: number;
  saveCount: number;
  shareCount: number;
  rating?: number;
  reviewCount: number;
  status: 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

type EventCategory = 
  | 'parade' 
  | 'music' 
  | 'culture' 
  | 'kids' 
  | 'exhibition' 
  | 'sports' 
  | 'nightlife' 
  | 'workshop' 
  | 'competition';

// types/hotels.ts
interface Hotel {
  id: string;
  slug: string;
  name: string;
  description?: string;
  address: string;
  locationLat: number;
  locationLng: number;
  phone: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  starRating: 1 | 2 | 3 | 4 | 5;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  pricePerNightMin: number;
  pricePerNightMax: number;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  roomTypes: RoomType[];
  policies: HotelPolicies;
  images: string[];
  virtualTourUrl?: string;
  distanceFromCenter: number;
  verified: boolean;
  paystackSubaccountCode?: string;
  commissionRate: number;
  rating?: number;
  reviewCount: number;
  carnivalSpecialRate?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface RoomType {
  type: string;
  description?: string;
  price: number;
  available: number;
  maxOccupancy: number;
  amenities: string[];
  images: string[];
}

interface HotelPolicies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  payment: string[];
}

// types/bookings.ts
interface HotelBooking {
  id: string;
  bookingReference: string;
  hotelId: string;
  userId: string;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  roomType: string;
  roomCount: number;
  guestCount: number;
  pricePerNight: number;
  totalAmount: number;
  platformFee: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentReference?: string;
  paymentMethod?: string;
  paidAt?: Date;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// types/users.ts
interface UserProfile {
  id: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  languagePreference: string;
  notificationPreferences: NotificationPreferences;
  locationSharingEnabled: boolean;
  emergencyContacts: EmergencyContact[];
  preferences: UserPreferences;
  gamificationStats: GamificationStats;
  isVerified: boolean;
  isVendor: boolean;
  isOrganizer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface GamificationStats {
  badges: string[];
  points: number;
  level: number;
}

// types/safety.ts
interface LocationShare {
  id: string;
  userId: string;
  shareCode: string;
  currentLat: number;
  currentLng: number;
  locationHistory: LocationPoint[];
  name?: string;
  expiresAt: Date;
  updateInterval: number;
  sharedWithEmails: string[];
  isPublic: boolean;
  passwordProtected: boolean;
  accessPassword?: string;
  geofence?: Geofence;
  sosEnabled: boolean;
  viewCount: number;
  lastUpdated: Date;
  createdAt: Date;
}

interface FamilyGroup {
  id: string;
  createdBy: string;
  name: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  meetingPointName?: string;
  emergencyContact?: string;
  isActive: boolean;
  createdAt: Date;
}

interface FamilyMember {
  id: string;
  groupId: string;
  userId?: string;
  role: 'parent' | 'child' | 'guardian' | 'member';
  fullName: string;
  phone?: string;
  age?: number;
  photoUrl?: string;
  description?: string;
  isMissing: boolean;
  lastSeenLat?: number;
  lastSeenLng?: number;
  lastSeenAt?: Date;
  foundAt?: Date;
  createdAt: Date;
}

// types/lost-found.ts
interface LostFoundItem {
  id: string;
  userId: string;
  type: 'lost' | 'found';
  itemName: string;
  itemDescription: string;
  category: ItemCategory;
  color?: string;
  brand?: string;
  distinctiveFeatures?: string;
  locationName: string;
  locationLat?: number;
  locationLng?: number;
  lostFoundAt?: Date;
  images: string[];
  aiImageEmbedding?: number[];
  aiDescription?: string;
  aiSuggestedMatches: string[];
  contactPhone: string;
  contactEmail?: string;
  contactMethodPreference: 'phone' | 'email';
  status: 'open' | 'matched' | 'resolved' | 'claimed' | 'expired';
  matchedWithId?: string;
  resolvedAt?: Date;
  rewardOffered: boolean;
  rewardAmount?: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

type ItemCategory = 
  | 'phone' 
  | 'wallet' 
  | 'bag' 
  | 'jewelry' 
  | 'documents' 
  | 'keys' 
  | 'clothing' 
  | 'electronics' 
  | 'other';

// types/community.ts
interface UserPost {
  id: string;
  userId: string;
  eventId?: string;
  type: 'post' | 'story';
  caption?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  thumbnailUrl?: string;
  locationName?: string;
  locationLat?: number;
  locationLng?: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  isFlagged: boolean;
  isHidden: boolean;
  aiTags: string[];
  aiDescription?: string;
  sentimentScore?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// types/gamification.ts
interface Badge {
  id: string;
  name: string;
  description?: string;
  icon: string;
  category: BadgeCategory;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirementType?: string;
  requirementValue?: number;
  isActive: boolean;
  createdAt: Date;
}

type BadgeCategory = 
  | 'attendance' 
  | 'social' 
  | 'explorer' 
  | 'safety' 
  | 'contributor' 
  | 'special';

interface Challenge {
  id: string;
  name: string;
  description?: string;
  type: 'daily' | 'weekly' | 'special' | 'event';
  pointsReward: number;
  badgeRewardId?: string;
  startDate: Date;
  endDate: Date;
  requirement: string;
  participantCount: number;
  completionCount: number;
  isActive: boolean;
  createdAt: Date;
}

// types/analytics.ts
interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventName: string;
  userId?: string;
  sessionId?: string;
  properties: Record<string, any>;
  deviceType?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  createdAt: Date;
}

interface DailyMetrics {
  id: string;
  metricDate: Date;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  pageViews: number;
  averageSessionDuration?: number;
  bounceRate?: number;
  topEvents: Record<string, number>;
  topHotels: Record<string, number>;
  createdAt: Date;
}
```

