import type { Event, EventCategory } from '@/types';

/**
 * Filter events by category
 * Property 1: Event Category Filtering Consistency
 * - All returned events must have the specified category
 * - No events with other categories should be included
 */
export function filterEventsByCategory(events: Event[], category: EventCategory): Event[] {
  return events.filter((event) => event.category === category);
}

/**
 * Filter events by date range
 * - Returns events that overlap with the given date range
 * - An event overlaps if it starts before the range ends AND ends after the range starts
 */
export function filterEventsByDateRange(events: Event[], startDate: Date, endDate: Date): Event[] {
  return events.filter((event) => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    return eventStart <= endDate && eventEnd >= startDate;
  });
}

/**
 * Check if an event is currently live
 * Property 3: Live Event Indicator Correctness
 * - Returns true if current time is between event start and end times
 * - Returns false otherwise
 */
export function isEventLive(event: Event, currentTime: Date = new Date()): boolean {
  const eventStart = new Date(event.startTime);
  const eventEnd = new Date(event.endTime);
  return currentTime >= eventStart && currentTime <= eventEnd;
}

/**
 * Get events that are currently live
 */
export function getLiveEvents(events: Event[], currentTime: Date = new Date()): Event[] {
  return events.filter((event) => isEventLive(event, currentTime));
}

/**
 * Get upcoming events (not yet started)
 */
export function getUpcomingEvents(events: Event[], currentTime: Date = new Date()): Event[] {
  return events.filter((event) => new Date(event.startTime) > currentTime);
}

/**
 * Get past events (already ended)
 */
export function getPastEvents(events: Event[], currentTime: Date = new Date()): Event[] {
  return events.filter((event) => new Date(event.endTime) < currentTime);
}

/**
 * Sort events by start time (ascending)
 */
export function sortEventsByStartTime(events: Event[], ascending: boolean = true): Event[] {
  return [...events].sort((a, b) => {
    const diff = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    return ascending ? diff : -diff;
  });
}

/**
 * Sort events by popularity (save count + view count)
 */
export function sortEventsByPopularity(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const popularityA = a.saveCount + a.viewCount;
    const popularityB = b.saveCount + b.viewCount;
    return popularityB - popularityA;
  });
}

/**
 * Get featured events
 */
export function getFeaturedEvents(events: Event[]): Event[] {
  return events.filter((event) => event.isFeatured);
}

/**
 * Get trending events
 */
export function getTrendingEvents(events: Event[]): Event[] {
  return events.filter((event) => event.isTrending);
}

/**
 * Search events by name or description
 */
export function searchEvents(events: Event[], query: string): Event[] {
  const lowerQuery = query.toLowerCase();
  return events.filter(
    (event) =>
      event.name.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get time until event starts
 */
export function getTimeUntilEvent(event: Event, currentTime: Date = new Date()): number {
  const eventStart = new Date(event.startTime);
  return Math.max(0, eventStart.getTime() - currentTime.getTime());
}

/**
 * Format countdown for display
 */
export function formatCountdown(milliseconds: number): { days: number; hours: number; minutes: number; seconds: number } {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  };
}

/**
 * Group events by category
 */
export function groupEventsByCategory(events: Event[]): Record<EventCategory, Event[]> {
  const groups: Record<string, Event[]> = {};
  
  for (const event of events) {
    if (!groups[event.category]) {
      groups[event.category] = [];
    }
    groups[event.category].push(event);
  }
  
  return groups as Record<EventCategory, Event[]>;
}

/**
 * Group events by date
 */
export function groupEventsByDate(events: Event[]): Record<string, Event[]> {
  const groups: Record<string, Event[]> = {};
  
  for (const event of events) {
    const dateKey = new Date(event.startTime).toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
  }
  
  return groups;
}

