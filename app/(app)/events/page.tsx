"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EventGrid } from '@/components/events/event-grid';
import { EventFilters } from '@/components/events/event-filters';
import { Button } from '@/components/ui/button';
import { Loader2, Grid, List, Calendar } from 'lucide-react';
import type { Event, EventCategory } from '@/types';
import { filterEventsByCategory, searchEvents } from '@/lib/events';

type ViewMode = 'grid' | 'list' | 'calendar';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
	  const [viewMode, setViewMode] = useState<ViewMode>('grid');
	  const shouldReduceMotion = useReducedMotion();

	  const sectionTransition = {
	    duration: 0.3,
	    ease: 'easeOut',
	  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
          setFilteredEvents(data);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    let result = events;

    if (selectedCategory) {
      result = filterEventsByCategory(result, selectedCategory);
    }

    if (searchQuery) {
      result = searchEvents(result, searchQuery);
    }

    if (showFeaturedOnly) {
      result = result.filter((e) => e.isFeatured);
    }

    setFilteredEvents(result);
  }, [events, selectedCategory, searchQuery, showFeaturedOnly]);

  const handleSave = useCallback(async (eventId: string) => {
    const isSaved = savedEventIds.includes(eventId);
    
    if (isSaved) {
      setSavedEventIds((prev) => prev.filter((id) => id !== eventId));
    } else {
      setSavedEventIds((prev) => [...prev, eventId]);
    }

    try {
      await fetch(`/api/events/${eventId}/${isSaved ? 'unsave' : 'save'}`, { method: 'POST' });
    } catch (error) {
      console.error('Error saving event:', error);
      // Revert on error
      if (isSaved) {
        setSavedEventIds((prev) => [...prev, eventId]);
      } else {
        setSavedEventIds((prev) => prev.filter((id) => id !== eventId));
      }
    }
  }, [savedEventIds]);

  const handleShare = useCallback(async (event: Event) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: event.tagline || event.description,
          url: `${window.location.origin}/events/${event.slug}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      await navigator.clipboard.writeText(`${window.location.origin}/events/${event.slug}`);
    }
  }, []);

	  if (isLoading) {
	    return (
	      <div className="flex items-center justify-center min-h-[400px]">
	        <Loader2 className="h-8 w-8 animate-spin" />
	      </div>
	    );
	  }

	  return (
	    <motion.div
	      className="space-y-6"
	      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
	      animate={{ opacity: 1, y: 0 }}
	      transition={sectionTransition}
	    >
	      <motion.div
	        className="flex items-center justify-between gap-4 flex-wrap"
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.05 }}
	      >
	        <div>
	          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
	          <p className="mt-1 text-sm text-muted-foreground">
	            Discover amazing carnival events, parades, and after-parties.
	          </p>
	        </div>
	        <div className="flex items-center gap-2 rounded-full bg-background/60 px-2 py-1 shadow-sm ring-1 ring-border/60">
	          <Button
	            variant={viewMode === 'grid' ? 'default' : 'outline'}
	            size="icon"
	            onClick={() => setViewMode('grid')}
	            aria-label="Grid view"
	          >
	            <Grid className="h-4 w-4" />
	          </Button>
	          <Button
	            variant={viewMode === 'list' ? 'default' : 'outline'}
	            size="icon"
	            onClick={() => setViewMode('list')}
	            aria-label="List view"
	          >
	            <List className="h-4 w-4" />
	          </Button>
	          <Button
	            variant={viewMode === 'calendar' ? 'default' : 'outline'}
	            size="icon"
	            onClick={() => setViewMode('calendar')}
	            aria-label="Calendar view"
	          >
	            <Calendar className="h-4 w-4" />
	          </Button>
	        </div>
	      </motion.div>

	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.1 }}
	      >
	        <EventFilters
	          selectedCategory={selectedCategory}
	          onCategoryChange={setSelectedCategory}
	          searchQuery={searchQuery}
	          onSearchChange={setSearchQuery}
	          showFeaturedOnly={showFeaturedOnly}
	          onFeaturedChange={setShowFeaturedOnly}
	        />
	      </motion.div>

	      <motion.div
	        className="text-sm text-muted-foreground"
	        initial={{ opacity: 0 }}
	        animate={{ opacity: 1 }}
	        transition={{ ...sectionTransition, delay: 0.15 }}
	      >
	        Showing {filteredEvents.length} of {events.length} events
	      </motion.div>

	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.18 }}
	      >
	        <EventGrid
	          events={filteredEvents}
	          savedEventIds={savedEventIds}
	          onSave={handleSave}
	          onShare={handleShare}
	          columns={viewMode === 'list' ? 1 : 3}
	        />
	      </motion.div>
	    </motion.div>
	  );
}

