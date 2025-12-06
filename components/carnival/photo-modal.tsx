'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Heart, Calendar, MapPin, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GalleryPhoto } from '@/types/carnival';
import { formatDistanceToNow } from 'date-fns';

interface PhotoModalProps {
  photo: GalleryPhoto;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export function PhotoModal({ 
  photo, 
  onClose, 
  onNext, 
  onPrev,
  hasNext = false,
  hasPrev = false,
}: PhotoModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrev) {
        onPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, hasNext, hasPrev]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      {hasPrev && onPrev && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
      )}

      {hasNext && onNext && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/10"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      )}

      {/* Main content */}
      <div 
        className="flex h-full flex-col items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image container */}
        <div className="relative w-full max-w-6xl max-h-[70vh] mb-4">
          <Image
            src={photo.url}
            alt={photo.caption || 'Carnival photo'}
            width={1200}
            height={800}
            className="w-full h-full object-contain rounded-lg"
            priority
          />
        </div>

        {/* Photo details */}
        <div className="w-full max-w-6xl bg-black/50 backdrop-blur-md rounded-lg p-4 md:p-6 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 space-y-3">
              {/* Caption */}
              {photo.caption && (
                <p className="text-lg font-medium">{photo.caption}</p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                {photo.photographer && (
                  <div className="flex items-center gap-1.5">
                    <Camera className="h-4 w-4" />
                    <span>{photo.photographer}</span>
                  </div>
                )}

                {photo.takenAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(photo.takenAt, { addSuffix: true })}</span>
                  </div>
                )}

                {photo.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{photo.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Likes */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                <span>{photo.likesCount.toLocaleString()}</span>
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation hint */}
        <p className="mt-4 text-sm text-gray-400">
          Use arrow keys or swipe to navigate • Press ESC to close
        </p>
      </div>
    </div>
  );
}
