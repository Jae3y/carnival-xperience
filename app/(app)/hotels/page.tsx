"use client";

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { HotelCard } from '@/components/hotels/hotel-card';
import { HotelFilters } from '@/components/hotels/hotel-filters';
import { Loader2 } from 'lucide-react';
import type { Hotel, PriceRange } from '@/types';

	export default function HotelsPage() {
	  const [hotels, setHotels] = useState<Hotel[]>([]);
	  const [isLoading, setIsLoading] = useState(true);
	  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | undefined>();
	  const [minStars, setMinStars] = useState(0);
	  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
	  const [searchQuery, setSearchQuery] = useState('');
	  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'rating'>('distance');
	  const shouldReduceMotion = useReducedMotion();

	  const sectionTransition = {
	    duration: 0.3,
	    ease: 'easeOut',
	  };

	useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedPriceRange) params.set('priceRange', selectedPriceRange);
        if (minStars > 0) params.set('starRating', minStars.toString());
        if (priceRange[0] > 0) params.set('minPrice', priceRange[0].toString());
        if (priceRange[1] < 500000) params.set('maxPrice', priceRange[1].toString());
        if (searchQuery) params.set('search', searchQuery);
        params.set('sortBy', sortBy);

        const response = await fetch(`/api/hotels?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setHotels(data);
        }
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchHotels, 300);
    return () => clearTimeout(debounce);
	  }, [selectedPriceRange, minStars, priceRange, searchQuery, sortBy]);

	  return (
	    <motion.div
	      className="space-y-6"
	      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
	      animate={{ opacity: 1, y: 0 }}
	      transition={sectionTransition}
	    >
	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.05 }}
	      >
	        <h1 className="text-3xl font-bold tracking-tight">Hotels</h1>
	        <p className="mt-1 text-sm text-muted-foreground">
	          Find the perfect accommodation for your carnival experience.
	        </p>
	      </motion.div>

	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.1 }}
	      >
	        <HotelFilters
	          selectedPriceRange={selectedPriceRange}
	          onPriceRangeChange={setSelectedPriceRange}
	          minStars={minStars}
	          onMinStarsChange={setMinStars}
	          priceRange={priceRange}
	          onPriceChange={setPriceRange}
	          searchQuery={searchQuery}
	          onSearchChange={setSearchQuery}
	          sortBy={sortBy}
	          onSortChange={setSortBy}
	        />
	      </motion.div>

	      <motion.div
	        className="text-sm text-muted-foreground"
	        initial={{ opacity: 0 }}
	        animate={{ opacity: 1 }}
	        transition={{ ...sectionTransition, delay: 0.15 }}
	      >
	        {isLoading ? 'Loading...' : `${hotels.length} hotels found`}
	      </motion.div>

	      {isLoading ? (
	        <div className="flex items-center justify-center min-h-[400px]">
	          <Loader2 className="h-8 w-8 animate-spin" />
	        </div>
	      ) : hotels.length === 0 ? (
	        <motion.div
	          className="flex flex-col items-center justify-center py-12 text-center"
	          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
	          animate={{ opacity: 1, y: 0 }}
	          transition={{ ...sectionTransition, delay: 0.18 }}
	        >
	          <span className="mb-4 text-6xl">
	            {"\ud83c\udfe8"}
	          </span>
	          <h3 className="text-lg font-semibold">No hotels found</h3>
	          <p className="mt-1 text-muted-foreground">Try adjusting your filters</p>
	        </motion.div>
	      ) : (
	        <motion.div
	          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
	          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
	          animate={{ opacity: 1, y: 0 }}
	          transition={{ ...sectionTransition, delay: 0.18 }}
	        >
	          {hotels.map((hotel) => (
	            <HotelCard key={hotel.id} hotel={hotel} />
	          ))}
	        </motion.div>
	      )}
	    </motion.div>
	  );
}

