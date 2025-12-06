'use client';

import Image from 'next/image';
import { Clock, MapPin, Pin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { LiveUpdate } from '@/types/carnival';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface LiveUpdateCardProps {
  update: LiveUpdate;
  className?: string;
}

export function LiveUpdateCard({ update, className }: LiveUpdateCardProps) {
  const formattedTime = formatDistanceToNow(new Date(update.createdAt), { addSuffix: true });

  return (
    <Card className={cn(
      'overflow-hidden transition-all duration-300',
      update.isPinned && 'border-primary border-2 shadow-lg',
      className
    )}>
      {update.isPinned && (
        <div className="bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2">
          <Pin className="h-4 w-4" />
          <span className="text-sm font-semibold">Pinned Update</span>
        </div>
      )}

      <CardContent className={cn('p-4', update.isPinned && 'pt-3')}>
        {/* Timestamp and Location */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formattedTime}</span>
          </div>
          
          {update.location && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{update.location}</span>
              </div>
            </>
          )}
        </div>

        {/* Update Content */}
        <p className="text-base leading-relaxed whitespace-pre-wrap">
          {update.content}
        </p>

        {/* Optional Image */}
        {update.imageUrl && (
          <div className="relative mt-4 aspect-video rounded-lg overflow-hidden">
            <Image
              src={update.imageUrl}
              alt="Update image"
              fill
              className="object-cover"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
