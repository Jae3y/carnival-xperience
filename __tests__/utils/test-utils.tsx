import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Test data generators using fast-check
import * as fc from 'fast-check';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Fast-check arbitraries for domain types
export const eventCategoryArb = fc.constantFrom(
  'parade', 'music', 'culture', 'kids', 'exhibition', 'sports', 'nightlife', 'workshop', 'competition'
);

export const eventStatusArb = fc.constantFrom(
  'draft', 'upcoming', 'live', 'completed', 'cancelled'
);

export const priceRangeArb = fc.constantFrom('budget', 'mid-range', 'luxury');

export const starRatingArb = fc.constantFrom(1, 2, 3, 4, 5);

export const paymentStatusArb = fc.constantFrom('pending', 'paid', 'failed', 'refunded');

export const bookingStatusArb = fc.constantFrom(
  'pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'
);

export const itemCategoryArb = fc.constantFrom(
  'phone', 'wallet', 'bag', 'jewelry', 'documents', 'keys', 'clothing', 'electronics', 'other'
);

// Domain object generators
export const eventArb = fc.record({
  id: fc.uuid(),
  slug: fc.string({ minLength: 3, maxLength: 50 }),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  description: fc.string({ minLength: 1 }),
  category: eventCategoryArb,
  tags: fc.array(fc.string()),
  venueName: fc.string({ minLength: 1 }),
  locationLat: fc.double({ min: -90, max: 90, noNaN: true }),
  locationLng: fc.double({ min: -180, max: 180, noNaN: true }),
  attendanceCount: fc.nat(),
  startTime: fc.date(),
  endTime: fc.date(),
  timezone: fc.constant('Africa/Lagos'),
  images: fc.array(fc.webUrl()),
  isFree: fc.boolean(),
  ticketRequired: fc.boolean(),
  isFeatured: fc.boolean(),
  isTrending: fc.boolean(),
  isLive: fc.boolean(),
  accessibilityFeatures: fc.array(fc.string()),
  amenities: fc.array(fc.string()),
  viewCount: fc.nat(),
  saveCount: fc.nat(),
  shareCount: fc.nat(),
  reviewCount: fc.nat(),
  status: eventStatusArb,
  createdAt: fc.date(),
  updatedAt: fc.date(),
});

export const hotelArb = fc.record({
  id: fc.uuid(),
  slug: fc.string({ minLength: 3, maxLength: 50 }),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  address: fc.string({ minLength: 1 }),
  locationLat: fc.double({ min: -90, max: 90, noNaN: true }),
  locationLng: fc.double({ min: -180, max: 180, noNaN: true }),
  phone: fc.string(),
  starRating: starRatingArb,
  priceRange: priceRangeArb,
  pricePerNightMin: fc.integer({ min: 10000, max: 50000 }),
  pricePerNightMax: fc.integer({ min: 50000, max: 500000 }),
  totalRooms: fc.integer({ min: 1, max: 500 }),
  availableRooms: fc.integer({ min: 0, max: 500 }),
  amenities: fc.array(fc.string()),
  roomTypes: fc.array(fc.record({
    type: fc.string(),
    price: fc.integer({ min: 10000, max: 500000 }),
    available: fc.integer({ min: 0, max: 100 }),
    maxOccupancy: fc.integer({ min: 1, max: 10 }),
    amenities: fc.array(fc.string()),
    images: fc.array(fc.string()),
  })),
  policies: fc.record({
    checkIn: fc.constant('14:00'),
    checkOut: fc.constant('11:00'),
    cancellation: fc.string(),
    payment: fc.array(fc.string()),
  }),
  images: fc.array(fc.webUrl()),
  distanceFromCenter: fc.double({ min: 0, max: 50, noNaN: true }),
  verified: fc.boolean(),
  commissionRate: fc.double({ min: 0, max: 0.3, noNaN: true }),
  reviewCount: fc.nat(),
  isActive: fc.boolean(),
  createdAt: fc.date(),
  updatedAt: fc.date(),
});

export const userProfileArb = fc.record({
  id: fc.uuid(),
  username: fc.option(fc.string({ minLength: 3, maxLength: 30 })),
  fullName: fc.option(fc.string({ minLength: 1, maxLength: 100 })),
  avatarUrl: fc.option(fc.webUrl()),
  bio: fc.option(fc.string()),
  phone: fc.option(fc.string()),
  languagePreference: fc.constant('en'),
  locationSharingEnabled: fc.boolean(),
  emergencyContacts: fc.array(fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 1 }),
    phone: fc.string(),
    relationship: fc.string(),
    isPrimary: fc.boolean(),
  })),
  isVerified: fc.boolean(),
  isVendor: fc.boolean(),
  isOrganizer: fc.boolean(),
  createdAt: fc.date(),
  updatedAt: fc.date(),
});

// Test helper functions
export const createMockEvent = (overrides = {}) => ({
  id: 'test-event-id',
  slug: 'test-event',
  name: 'Test Event',
  description: 'Test event description',
  category: 'music' as const,
  tags: ['test'],
  venueName: 'Test Venue',
  locationLat: 4.9583,
  locationLng: 8.3235,
  attendanceCount: 0,
  startTime: new Date('2024-12-25T10:00:00Z'),
  endTime: new Date('2024-12-25T18:00:00Z'),
  timezone: 'Africa/Lagos',
  images: [],
  isFree: true,
  ticketRequired: false,
  isFeatured: false,
  isTrending: false,
  isLive: false,
  accessibilityFeatures: [],
  amenities: [],
  viewCount: 0,
  saveCount: 0,
  shareCount: 0,
  reviewCount: 0,
  status: 'upcoming' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockHotel = (overrides = {}) => ({
  id: 'test-hotel-id',
  slug: 'test-hotel',
  name: 'Test Hotel',
  address: '123 Test Street, Calabar',
  locationLat: 4.9583,
  locationLng: 8.3235,
  phone: '+234123456789',
  starRating: 4 as const,
  priceRange: 'mid-range' as const,
  pricePerNightMin: 25000,
  pricePerNightMax: 75000,
  totalRooms: 50,
  availableRooms: 20,
  amenities: ['WiFi', 'Pool', 'Restaurant'],
  roomTypes: [],
  policies: { checkIn: '14:00', checkOut: '11:00', cancellation: 'Free cancellation', payment: ['Card'] },
  images: [],
  distanceFromCenter: 2.5,
  verified: true,
  commissionRate: 0.1,
  reviewCount: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

