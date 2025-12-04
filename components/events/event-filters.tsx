'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EventCategory } from '@/types';
import { cn } from '@/lib/utils';

interface EventFiltersProps {
  selectedCategory?: EventCategory;
  onCategoryChange: (category: EventCategory | undefined) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFeaturedOnly?: boolean;
  onFeaturedChange?: (featured: boolean) => void;
  className?: string;
}

const categories: { value: EventCategory; label: string; emoji: string }[] = [
  { value: 'parade', label: 'Parades', emoji: '🎭' },
  { value: 'music', label: 'Music', emoji: '🎵' },
  { value: 'culture', label: 'Culture', emoji: '🏛️' },
  { value: 'kids', label: 'Kids', emoji: '👶' },
  { value: 'exhibition', label: 'Exhibition', emoji: '🖼️' },
  { value: 'sports', label: 'Sports', emoji: '⚽' },
  { value: 'nightlife', label: 'Nightlife', emoji: '🌙' },
  { value: 'workshop', label: 'Workshop', emoji: '🛠️' },
  { value: 'competition', label: 'Competition', emoji: '🏆' },
];

export function EventFilters({
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  showFeaturedOnly,
  onFeaturedChange,
  className,
}: EventFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 5);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events..."
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

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === undefined ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(undefined)}
          className="rounded-full"
        >
          All Events
        </Button>
        {visibleCategories.map((cat) => (
          <Button
            key={cat.value}
            variant={selectedCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(cat.value)}
            className="rounded-full"
          >
            <span className="mr-1">{cat.emoji}</span>
            {cat.label}
          </Button>
        ))}
        {!showAllCategories && categories.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllCategories(true)}
            className="rounded-full"
          >
            +{categories.length - 5} more
          </Button>
        )}
      </div>

      {/* Additional Filters */}
      {onFeaturedChange && (
        <div className="flex items-center gap-4">
          <Button
            variant={showFeaturedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFeaturedChange(!showFeaturedOnly)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Featured Only
          </Button>
        </div>
      )}

      {/* Active Filters */}
      {(selectedCategory || searchQuery || showFeaturedOnly) && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
              {categories.find((c) => c.value === selectedCategory)?.label}
              <button onClick={() => onCategoryChange(undefined)}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full">
              &quot;{searchQuery}&quot;
              <button onClick={() => onSearchChange('')}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              onCategoryChange(undefined);
              onSearchChange('');
              onFeaturedChange?.(false);
            }}
            className="text-muted-foreground hover:text-foreground underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

