'use client';

import { EventCard } from './event-card';
import type { Event } from '@/types';
import { cn } from '@/lib/utils';

interface EventGridProps {
  events: Event[];
  savedEventIds?: string[];
  onSave?: (eventId: string) => void;
  onShare?: (event: Event) => void;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function EventGrid({
  events,
  savedEventIds = [],
  onSave,
  onShare,
  className,
  columns = 3,
}: EventGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-6xl mb-4">🎭</span>
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-6', gridCols[columns], className)}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isSaved={savedEventIds.includes(event.id)}
          onSave={onSave}
          onShare={onShare}
        />
      ))}
    </div>
  );
}

interface EventListProps {
  events: Event[];
  savedEventIds?: string[];
  onSave?: (eventId: string) => void;
  onShare?: (event: Event) => void;
  className?: string;
}

export function EventList({
  events,
  savedEventIds = [],
  onSave,
  onShare,
  className,
}: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <span className="text-6xl mb-4">🎭</span>
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isSaved={savedEventIds.includes(event.id)}
          onSave={onSave}
          onShare={onShare}
          className="flex flex-col md:flex-row"
        />
      ))}
    </div>
  );
}

