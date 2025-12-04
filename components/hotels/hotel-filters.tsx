'use client';

import { Search, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import type { PriceRange } from '@/types';
import { cn } from '@/lib/utils';

interface HotelFiltersProps {
  selectedPriceRange?: PriceRange;
  onPriceRangeChange: (range: PriceRange | undefined) => void;
  minStars: number;
  onMinStarsChange: (stars: number) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'distance' | 'price' | 'rating';
  onSortChange: (sort: 'distance' | 'price' | 'rating') => void;
  className?: string;
}

const priceRanges: { value: PriceRange; label: string }[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'mid-range', label: 'Mid-Range' },
  { value: 'luxury', label: 'Luxury' },
];

export function HotelFilters({
  selectedPriceRange,
  onPriceRangeChange,
  minStars,
  onMinStarsChange,
  priceRange,
  onPriceChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  className,
}: HotelFiltersProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search hotels..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Price Range Pills */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedPriceRange === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPriceRangeChange(undefined)}
          className="rounded-full"
        >
          All Hotels
        </Button>
        {priceRanges.map((range) => (
          <Button
            key={range.value}
            variant={selectedPriceRange === range.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPriceRangeChange(range.value)}
            className="rounded-full"
          >
            {range.label}
          </Button>
        ))}
      </div>

      {/* Star Rating */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Minimum Star Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => onMinStarsChange(star === minStars ? 0 : star)}
              className={cn(
                'p-1 rounded transition-colors',
                star <= minStars ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
              )}
            >
              <Star className={cn('h-6 w-6', star <= minStars && 'fill-current')} />
            </button>
          ))}
          {minStars > 0 && (
            <span className="text-sm text-muted-foreground ml-2">{minStars}+ stars</span>
          )}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Price Range: ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
        </label>
        <Slider
          value={priceRange}
          onValueChange={(value) => onPriceChange(value as [number, number])}
          min={0}
          max={500000}
          step={5000}
          className="w-full"
        />
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <Button
          variant={sortBy === 'distance' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('distance')}
        >
          Distance
        </Button>
        <Button
          variant={sortBy === 'price' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('price')}
        >
          Price
        </Button>
        <Button
          variant={sortBy === 'rating' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSortChange('rating')}
        >
          Rating
        </Button>
      </div>
    </div>
  );
}

