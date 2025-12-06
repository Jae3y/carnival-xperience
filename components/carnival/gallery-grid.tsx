'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PhotoModal } from './photo-modal';
import type { GalleryPhoto } from '@/types/carnival';
import { Heart } from 'lucide-react';

interface GalleryGridProps {
  photos: GalleryPhoto[];
  columns?: number;
}

export function GalleryGrid({ photos, columns = 3 }: GalleryGridProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleClose = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNext = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No photos available yet.</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`grid gap-4 ${
          columns === 2 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : columns === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handlePhotoClick(index)}
          >
            <div className="relative aspect-[4/3] bg-muted">
              <Image
                src={photo.url}
                alt={photo.caption || 'Carnival photo'}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  {photo.caption && (
                    <p className="text-sm font-medium line-clamp-2 mb-2">
                      {photo.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    {photo.photographer && (
                      <span className="text-gray-300">{photo.photographer}</span>
                    )}
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                      <span>{photo.likesCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo Modal */}
      {selectedPhotoIndex !== null && (
        <PhotoModal
          photo={photos[selectedPhotoIndex]}
          onClose={handleClose}
          onNext={handleNext}
          onPrev={handlePrev}
          hasNext={selectedPhotoIndex < photos.length - 1}
          hasPrev={selectedPhotoIndex > 0}
        />
      )}
    </>
  );
}
