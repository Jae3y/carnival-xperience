'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MapPin, Users, Heart, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LiveBadge } from './live-badge';
import { CompactCountdown } from './countdown-timer';
import { isEventLive } from '@/lib/events';
import type { Event } from '@/types';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  isSaved?: boolean;
  onSave?: (eventId: string) => void;
  onShare?: (event: Event) => void;
  className?: string;
}

const categoryColors: Record<string, string> = {
  parade: 'bg-purple-500',
  music: 'bg-pink-500',
  culture: 'bg-amber-500',
  kids: 'bg-green-500',
  exhibition: 'bg-blue-500',
  sports: 'bg-red-500',
  nightlife: 'bg-indigo-500',
  workshop: 'bg-teal-500',
  competition: 'bg-orange-500',
};

export function EventCard({ event, isSaved = false, onSave, onShare, className }: EventCardProps) {
  const isLive = isEventLive(event);
  const eventDate = new Date(event.startTime);

  return (
    <Card className={cn('group overflow-hidden hover:shadow-lg transition-all duration-300', className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        {event.featuredImage ? (
          <Image
            src={event.featuredImage}
            alt={event.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-4xl">🎭</span>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={cn('text-xs font-medium px-2 py-1 rounded-full text-white', categoryColors[event.category] || 'bg-gray-500')}>
            {event.category}
          </span>
          {isLive && <LiveBadge size="sm" />}
          {event.isFeatured && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500 text-white">Featured</span>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => { e.preventDefault(); onSave?.(event.id); }}
          >
            <Heart className={cn('h-4 w-4', isSaved ? 'fill-red-500 text-red-500' : '')} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
            onClick={(e) => { e.preventDefault(); onShare?.(event); }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Price */}
        {!event.isFree && event.ticketPrice && (
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <span className="text-sm font-bold">₦{event.ticketPrice.toLocaleString()}</span>
          </div>
        )}
        {event.isFree && (
          <div className="absolute bottom-3 right-3 bg-green-500 text-white rounded-lg px-2 py-1">
            <span className="text-sm font-bold">FREE</span>
          </div>
        )}
      </div>

      <Link href={`/events/${event.slug}`}>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {event.name}
          </h3>
          {event.tagline && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{event.tagline}</p>
          )}

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{eventDate.toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span>•</span>
              <span>{eventDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{event.venueName}</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{event.attendanceCount} attending</span>
            </div>
            {!isLive && <CompactCountdown event={event} />}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

