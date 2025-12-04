import * as fc from 'fast-check';
import {
  filterEventsByCategory,
  filterEventsByDateRange,
  isEventLive,
  getLiveEvents,
  sortEventsByStartTime,
  searchEvents,
  groupEventsByCategory,
} from '@/lib/events';
import type { Event, EventCategory } from '@/types';

// Arbitrary for generating valid event categories
const eventCategoryArb = fc.constantFrom<EventCategory>(
  'parade', 'music', 'culture', 'kids', 'exhibition', 'sports', 'nightlife', 'workshop', 'competition'
);

// Arbitrary for generating valid events
const eventArb = fc.record({
  id: fc.uuid(),
  slug: fc.string({ minLength: 1, maxLength: 50 }).map(s => s.replace(/[^a-z0-9-]/gi, '-').toLowerCase()),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  tagline: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
  description: fc.string({ minLength: 1, maxLength: 500 }),
  longDescription: fc.option(fc.string({ maxLength: 2000 }), { nil: undefined }),
  category: eventCategoryArb,
  subcategory: fc.option(fc.string({ maxLength: 50 }), { nil: undefined }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 30 }), { maxLength: 10 }),
  venueName: fc.string({ minLength: 1, maxLength: 100 }),
  venueDescription: fc.option(fc.string({ maxLength: 500 }), { nil: undefined }),
  locationLat: fc.double({ min: -90, max: 90, noNaN: true }),
  locationLng: fc.double({ min: -180, max: 180, noNaN: true }),
  address: fc.option(fc.string({ maxLength: 200 }), { nil: undefined }),
  capacity: fc.option(fc.integer({ min: 1, max: 100000 }), { nil: undefined }),
  attendanceCount: fc.integer({ min: 0, max: 100000 }),
  startTime: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
  endTime: fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
  timezone: fc.constant('Africa/Lagos'),
  featuredImage: fc.option(fc.webUrl(), { nil: undefined }),
  images: fc.array(fc.webUrl(), { maxLength: 10 }),
  videoUrl: fc.option(fc.webUrl(), { nil: undefined }),
  liveStreamUrl: fc.option(fc.webUrl(), { nil: undefined }),
  organizerId: fc.option(fc.uuid(), { nil: undefined }),
  organizerName: fc.option(fc.string({ maxLength: 100 }), { nil: undefined }),
  isFree: fc.boolean(),
  ticketRequired: fc.boolean(),
  ticketPrice: fc.option(fc.integer({ min: 0, max: 1000000 }), { nil: undefined }),
  ticketsAvailable: fc.option(fc.integer({ min: 0, max: 100000 }), { nil: undefined }),
  isFeatured: fc.boolean(),
  isTrending: fc.boolean(),
  isLive: fc.boolean(),
  accessibilityFeatures: fc.array(fc.string({ maxLength: 50 }), { maxLength: 10 }),
  amenities: fc.array(fc.string({ maxLength: 50 }), { maxLength: 10 }),
  viewCount: fc.integer({ min: 0, max: 1000000 }),
  saveCount: fc.integer({ min: 0, max: 1000000 }),
  shareCount: fc.integer({ min: 0, max: 1000000 }),
  rating: fc.option(fc.double({ min: 0, max: 5, noNaN: true }), { nil: undefined }),
  reviewCount: fc.integer({ min: 0, max: 100000 }),
  status: fc.constantFrom('draft', 'upcoming', 'live', 'completed', 'cancelled') as fc.Arbitrary<Event['status']>,
  createdAt: fc.date(),
  updatedAt: fc.date(),
}).filter(e => e.endTime >= e.startTime) as fc.Arbitrary<Event>;

describe('Event Filtering', () => {
  /**
   * Property 1: Event Category Filtering Consistency
   * All returned events must have the specified category
   */
  test('filterEventsByCategory returns only events with the specified category', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 0, maxLength: 50 }),
        eventCategoryArb,
        (events, category) => {
          const filtered = filterEventsByCategory(events, category);
          
          // All filtered events must have the specified category
          return filtered.every(event => event.category === category);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('filterEventsByCategory does not include events with other categories', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 0, maxLength: 50 }),
        eventCategoryArb,
        (events, category) => {
          const filtered = filterEventsByCategory(events, category);
          const originalWithCategory = events.filter(e => e.category === category);
          
          // The filtered count should equal the count of events with that category
          return filtered.length === originalWithCategory.length;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('filterEventsByDateRange returns events overlapping with date range', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 0, maxLength: 20 }),
        fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }),
        fc.date({ min: new Date('2024-01-01'), max: new Date('2025-12-31') }),
        (events, date1, date2) => {
          const startDate = date1 < date2 ? date1 : date2;
          const endDate = date1 < date2 ? date2 : date1;
          
          const filtered = filterEventsByDateRange(events, startDate, endDate);
          
          // All filtered events must overlap with the date range
          return filtered.every(event => {
            const eventStart = new Date(event.startTime);
            const eventEnd = new Date(event.endTime);
            return eventStart <= endDate && eventEnd >= startDate;
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Live Event Indicator', () => {
  /**
   * Property 3: Live Event Indicator Correctness
   */
  test('isEventLive returns true only when current time is between start and end', () => {
    fc.assert(
      fc.property(
        eventArb,
        fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
        (event, currentTime) => {
          const isLive = isEventLive(event, currentTime);
          const eventStart = new Date(event.startTime);
          const eventEnd = new Date(event.endTime);
          
          const shouldBeLive = currentTime >= eventStart && currentTime <= eventEnd;
          return isLive === shouldBeLive;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('getLiveEvents returns only events that are currently live', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 0, maxLength: 20 }),
        fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') }),
        (events, currentTime) => {
          const liveEvents = getLiveEvents(events, currentTime);
          
          return liveEvents.every(event => isEventLive(event, currentTime));
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Event Sorting', () => {
  test('sortEventsByStartTime maintains correct order', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 0, maxLength: 20 }),
        fc.boolean(),
        (events, ascending) => {
          const sorted = sortEventsByStartTime(events, ascending);
          
          for (let i = 1; i < sorted.length; i++) {
            const prev = new Date(sorted[i - 1].startTime).getTime();
            const curr = new Date(sorted[i].startTime).getTime();
            
            if (ascending && prev > curr) return false;
            if (!ascending && prev < curr) return false;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Event Search', () => {
  test('searchEvents finds events by name', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 1, maxLength: 20 }),
        (events) => {
          // Pick a random event and search for part of its name
          const targetEvent = events[0];
          const searchTerm = targetEvent.name.substring(0, Math.min(3, targetEvent.name.length));
          
          if (searchTerm.length === 0) return true;
          
          const results = searchEvents(events, searchTerm);
          
          // The target event should be in results if its name contains the search term
          const targetInResults = results.some(e => e.id === targetEvent.id);
          const nameContainsTerm = targetEvent.name.toLowerCase().includes(searchTerm.toLowerCase());
          
          return nameContainsTerm ? targetInResults : true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Event Grouping', () => {
  test('groupEventsByCategory groups all events correctly', () => {
    fc.assert(
      fc.property(
        fc.array(eventArb, { minLength: 0, maxLength: 50 }),
        (events) => {
          const grouped = groupEventsByCategory(events);
          
          // Total events in all groups should equal original count
          const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
          if (totalGrouped !== events.length) return false;
          
          // Each event should be in the correct group
          for (const [category, categoryEvents] of Object.entries(grouped)) {
            if (!categoryEvents.every(e => e.category === category)) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

