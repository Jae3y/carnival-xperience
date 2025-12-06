export type EventCategory =
  | 'parade'
  | 'music'
  | 'culture'
  | 'kids'
  | 'exhibition'
  | 'sports'
  | 'nightlife'
  | 'workshop'
  | 'competition';

export type EventStatus = 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface Event {
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
  status: EventStatus;
  culturalSignificance?: string;
  historicalContext?: string;
  participatingBands?: string[];
  createdAt: Date;
  updatedAt: Date;
}
