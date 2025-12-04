"use client";

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
// Card components available if needed for future features
import { MapLayers, type MapLayerState } from '@/components/map/map-layers';
import { RouteDisplay } from '@/components/map/route-display';
import type { MapMarker } from '@/lib/maps/mapbox';
import type { Event, Hotel } from '@/types';

// Dynamic import to avoid SSR issues with mapbox-gl
const MapContainer = dynamic(
  () => import('@/components/map/map-container').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> }
);

	export default function MapPage() {
	  const [layers, setLayers] = useState<MapLayerState>({
    events: true,
    hotels: true,
    vendors: false,
    safety: true,
  });
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
	  const shouldReduceMotion = useReducedMotion();

	  const sectionTransition = {
	    duration: 0.3,
	    ease: 'easeOut',
	  };

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, []);

  // Fetch markers based on active layers
  useEffect(() => {
    const fetchMarkers = async () => {
      setIsLoading(true);
      const newMarkers: MapMarker[] = [];

      try {
        if (layers.events) {
          const response = await fetch('/api/events?limit=50');
          if (response.ok) {
            const events: Event[] = await response.json();
            events.forEach((event) => {
              newMarkers.push({
                id: event.id,
                type: 'event',
                lat: event.locationLat,
                lng: event.locationLng,
                title: event.name,
                description: event.venueName,
              });
            });
          }
        }

        if (layers.hotels) {
          const response = await fetch('/api/hotels?limit=50');
          if (response.ok) {
            const hotels: Hotel[] = await response.json();
            hotels.forEach((hotel) => {
              newMarkers.push({
                id: hotel.id,
                type: 'hotel',
                lat: hotel.locationLat,
                lng: hotel.locationLng,
                title: hotel.name,
                description: `${hotel.starRating}★ · ₦${hotel.pricePerNightMin.toLocaleString()}/night`,
              });
            });
          }
        }

        // Safety points (static for now)
        if (layers.safety) {
          const safetyPoints = [
            { id: 's1', lat: 4.9530, lng: 8.3200, title: 'Police Station', description: 'Main carnival police post' },
            { id: 's2', lat: 4.9500, lng: 8.3250, title: 'Medical Tent', description: 'First aid station' },
            { id: 's3', lat: 4.9480, lng: 8.3180, title: 'Emergency Point', description: 'Emergency services hub' },
          ];
          safetyPoints.forEach((point) => {
            newMarkers.push({ ...point, type: 'safety' });
          });
        }

        setMarkers(newMarkers);
      } catch (error) {
        console.error('Error fetching markers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarkers();
  }, [layers]);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    setSelectedMarker(marker);
  }, []);

	  const filteredMarkers = searchQuery
    ? markers.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : markers;

	  return (
	    <motion.div
	      className="flex h-[calc(100vh-4rem)] flex-col"
	      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
	      animate={{ opacity: 1, y: 0 }}
	      transition={sectionTransition}
	    >
	      {/* Header */}
	      <motion.div
	        className="flex items-center gap-4 border-b bg-background/80 px-4 py-3 backdrop-blur-sm"
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.05 }}
	      >
	        <div className="relative flex-1 max-w-md">
	          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
	          <Input
	            placeholder="Search locations..."
	            value={searchQuery}
	            onChange={(e) => setSearchQuery(e.target.value)}
	            className="pl-10"
	            aria-label="Search locations on the map"
	          />
	        </div>
	        <MapLayers layers={layers} onLayerChange={setLayers} />
	      </motion.div>

	      {/* Map */}
	      <div className="relative flex-1">
	        <MapContainer
	          markers={filteredMarkers}
	          onMarkerClick={handleMarkerClick}
	          showUserLocation
	        />

	        {/* Selected marker panel */}
	        {selectedMarker && userLocation && (
	          <motion.div
	            className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96"
	            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
	            animate={{ opacity: 1, y: 0 }}
	            transition={{ duration: 0.25, ease: 'easeOut' }}
	          >
	            <RouteDisplay
	              origin={userLocation}
	              destination={[selectedMarker.lng, selectedMarker.lat]}
	              destinationName={selectedMarker.title}
	            />
	          </motion.div>
	        )}

	        {/* Loading overlay */}
	        {isLoading && (
	          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
	            <Loader2 className="h-8 w-8 animate-spin" />
	          </div>
	        )}
	      </div>
	    </motion.div>
	  );
}

