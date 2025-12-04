'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, MapPin, Wifi, Car, Coffee, Dumbbell, Waves, Utensils } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Hotel } from '@/types';
import { cn } from '@/lib/utils';

interface HotelCardProps {
  hotel: Hotel;
  className?: string;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  breakfast: <Coffee className="h-4 w-4" />,
  gym: <Dumbbell className="h-4 w-4" />,
  pool: <Waves className="h-4 w-4" />,
  restaurant: <Utensils className="h-4 w-4" />,
};

const priceRangeLabels: Record<string, string> = {
  budget: 'Budget-Friendly',
  'mid-range': 'Mid-Range',
  luxury: 'Luxury',
};

export function HotelCard({ hotel, className }: HotelCardProps) {
  return (
    <Link href={`/hotels/${hotel.slug}`}>
      <Card className={cn('group overflow-hidden hover:shadow-lg transition-all duration-300', className)}>
        <div className="relative aspect-[16/10] overflow-hidden">
          {hotel.images[0] ? (
            <Image
              src={hotel.images[0]}
              alt={hotel.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl">🏨</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {hotel.verified && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                Verified
              </Badge>
            )}
            {hotel.carnivalSpecialRate && (
              <Badge variant="secondary" className="bg-orange-500 text-white">
                Carnival Special
              </Badge>
            )}
          </div>

          {/* Price */}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-sm font-bold">₦{hotel.pricePerNightMin.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">/night</span>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: hotel.starRating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            {hotel.rating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({hotel.reviewCount})</span>
              </div>
            )}
          </div>

          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{hotel.address}</span>
          </div>

          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
            <span>{hotel.distanceFromCenter.toFixed(1)} km from carnival center</span>
          </div>

          {/* Amenities */}
          <div className="flex items-center gap-3 mt-3 text-muted-foreground">
            {hotel.amenities.slice(0, 5).map((amenity) => (
              <span key={amenity} title={amenity}>
                {amenityIcons[amenity.toLowerCase()] || <span className="text-xs">{amenity}</span>}
              </span>
            ))}
            {hotel.amenities.length > 5 && (
              <span className="text-xs">+{hotel.amenities.length - 5}</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <Badge variant="outline">{priceRangeLabels[hotel.priceRange]}</Badge>
            <span className="text-sm text-green-600 font-medium">
              {hotel.availableRooms} rooms left
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

