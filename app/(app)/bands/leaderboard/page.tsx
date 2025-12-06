'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Leaderboard } from '@/components/bands/leaderboard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Trophy, Search, ArrowLeft, Filter } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Band } from '@/types/carnival';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LeaderboardPage() {
  const [bands, setBands] = useState<Band[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'name'>('votes');
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const sectionTransition = {
    duration: 0.3,
    ease: 'easeOut',
  };

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const supabase = createClient();
        const currentYear = new Date().getFullYear();

        const { data: bandsData, error: bandsError } = await supabase
          .from('bands')
          .select('*')
          .eq('year', currentYear)
          .order('vote_count', { ascending: false });

        if (bandsError) throw bandsError;

        const formattedBands: Band[] = (bandsData || []).map(band => ({
          id: band.id,
          name: band.name,
          description: band.description,
          theme: band.theme,
          imageUrl: band.image_url,
          voteCount: band.vote_count,
          year: band.year,
          createdAt: new Date(band.created_at),
          updatedAt: new Date(band.updated_at),
        }));

        setBands(formattedBands);
      } catch (err) {
        console.error('Error fetching bands:', err);
        setError('Failed to load leaderboard. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBands();
  }, []);

  // Filter and sort bands
  const filteredBands = useMemo(() => {
    let result = [...bands];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        band =>
          band.name.toLowerCase().includes(query) ||
          band.theme?.toLowerCase().includes(query) ||
          band.description?.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result.sort((a, b) => b.voteCount - a.voteCount);
    }

    return result;
  }, [bands, searchQuery, sortBy]);

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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.05 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bands
        </Button>
        
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-600" />
              Full Leaderboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete rankings of all carnival bands for 2025
            </p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sectionTransition, delay: 0.1 }}
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Filters and Search */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.12 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bands by name, theme, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(value: 'votes' | 'name') => setSortBy(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="votes">Most Votes</SelectItem>
              <SelectItem value="name">Alphabetical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="flex gap-6 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...sectionTransition, delay: 0.15 }}
      >
        <div>
          <span className="text-muted-foreground">Total Bands:</span>{' '}
          <span className="font-semibold">{bands.length}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Showing:</span>{' '}
          <span className="font-semibold">{filteredBands.length}</span>
        </div>
        {filteredBands.length > 0 && (
          <div>
            <span className="text-muted-foreground">Total Votes:</span>{' '}
            <span className="font-semibold">
              {filteredBands.reduce((sum, band) => sum + band.voteCount, 0).toLocaleString()}
            </span>
          </div>
        )}
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.18 }}
      >
        {filteredBands.length > 0 ? (
          <Leaderboard 
            initialBands={filteredBands}
            showTitle={false}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? 'No bands match your search.' : 'No bands available yet.'}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
