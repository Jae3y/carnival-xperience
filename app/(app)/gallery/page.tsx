'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { GalleryGrid } from '@/components/carnival/gallery-grid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, SlidersHorizontal } from 'lucide-react';
import { galleryPhotos } from '@/lib/sample-data/calabar-gallery-photos';
import type { GalleryPhoto } from '@/types/carnival';
import { format, parseISO } from 'date-fns';

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'likes'>('date');
  const shouldReduceMotion = useReducedMotion();

  const sectionTransition = {
    duration: 0.3,
    ease: 'easeOut',
  };

  useEffect(() => {
    // Transform sample data to include IDs and createdAt
    const transformedPhotos: GalleryPhoto[] = galleryPhotos.map((photo, index) => ({
      ...photo,
      id: `photo-${index + 1}`,
      createdAt: photo.takenAt || new Date(),
    }));
    setPhotos(transformedPhotos);
  }, []);

  // Get unique dates from photos
  const availableDates = useMemo(() => {
    const dates = photos
      .map(photo => photo.takenAt ? format(photo.takenAt, 'yyyy-MM-dd') : null)
      .filter((date): date is string => date !== null);
    return Array.from(new Set(dates)).sort().reverse();
  }, [photos]);

  // Filter and sort photos
  const filteredPhotos = useMemo(() => {
    let filtered = photos;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(photo => 
        photo.caption?.toLowerCase().includes(query) ||
        photo.photographer?.toLowerCase().includes(query) ||
        photo.location?.toLowerCase().includes(query)
      );
    }

    // Apply date filter
    if (selectedDate !== 'all') {
      filtered = filtered.filter(photo => 
        photo.takenAt && format(photo.takenAt, 'yyyy-MM-dd') === selectedDate
      );
    }

    // Apply sorting
    if (sortBy === 'date') {
      filtered = [...filtered].sort((a, b) => {
        const dateA = a.takenAt?.getTime() || 0;
        const dateB = b.takenAt?.getTime() || 0;
        return dateB - dateA;
      });
    } else {
      filtered = [...filtered].sort((a, b) => b.likesCount - a.likesCount);
    }

    return filtered;
  }, [photos, searchQuery, selectedDate, sortBy]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={sectionTransition}
    >
      {/* Header */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.05 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Photo Gallery</h1>
        <p className="text-sm text-muted-foreground">
          Explore stunning moments from Calabar Carnival 2025
        </p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.1 }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search photos by caption, photographer, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          
          {/* Date filter */}
          <div className="flex items-center gap-2">
            <Button
              variant={selectedDate === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDate('all')}
            >
              All Dates
            </Button>
            {availableDates.slice(0, 3).map(date => (
              <Button
                key={date}
                variant={selectedDate === date ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDate(date)}
              >
                <Calendar className="h-3 w-3 mr-1" />
                {format(parseISO(date), 'MMM d')}
              </Button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 border-l pl-2">
            <Button
              variant={sortBy === 'date' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('date')}
            >
              Latest
            </Button>
            <Button
              variant={sortBy === 'likes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('likes')}
            >
              Most Liked
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...sectionTransition, delay: 0.15 }}
      >
        <Badge variant="secondary">
          {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'}
        </Badge>
      </motion.div>

      {/* Gallery Grid */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.2 }}
      >
        <GalleryGrid photos={filteredPhotos} columns={3} />
      </motion.div>
    </motion.div>
  );
}
