'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { BandGrid } from '@/components/bands/band-grid';
import { Leaderboard } from '@/components/bands/leaderboard';
import { Button } from '@/components/ui/button';
import { Loader2, Trophy, Info, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Band, BandVote } from '@/types/carnival';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BandsPage() {
  const [bands, setBands] = useState<Band[]>([]);
  const [userVotes, setUserVotes] = useState<BandVote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const sectionTransition = {
    duration: 0.3,
    ease: 'easeOut',
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        setIsAuthenticated(!!user);

        const currentYear = new Date().getFullYear();

        // Fetch bands
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

        // Fetch user votes if authenticated
        if (user) {
          const { data: votesData, error: votesError } = await supabase
            .from('band_votes')
            .select('*')
            .eq('user_id', user.id)
            .eq('year', currentYear);

          if (votesError) throw votesError;

          const formattedVotes: BandVote[] = (votesData || []).map(vote => ({
            id: vote.id,
            bandId: vote.band_id,
            userId: vote.user_id,
            year: vote.year,
            createdAt: new Date(vote.created_at),
          }));

          setUserVotes(formattedVotes);
        }
      } catch (err) {
        console.error('Error fetching bands:', err);
        setError('Failed to load bands. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVote = useCallback(async (bandId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`/api/bands/${bandId}/vote`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to vote');
      }

      // Update local state
      setBands(prevBands =>
        prevBands.map(band =>
          band.id === bandId
            ? { ...band, voteCount: band.voteCount + 1 }
            : band
        )
      );

      // Add vote to user votes
      const currentYear = new Date().getFullYear();
      setUserVotes([{
        id: crypto.randomUUID(),
        bandId,
        userId: 'current-user',
        year: currentYear,
        createdAt: new Date(),
      }]);
    } catch (err) {
      console.error('Error voting:', err);
      setError(err instanceof Error ? err.message : 'Failed to vote');
      throw err;
    }
  }, [isAuthenticated, router]);

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
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            Carnival Bands 2025
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vote for your favorite carnival band and help them win the competition!
          </p>
        </div>
      </motion.div>

      {!isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sectionTransition, delay: 0.1 }}
        >
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <span className="font-medium">Sign in to vote!</span> You need to be logged in to vote for your favorite band.{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-medium"
                onClick={() => router.push('/login')}
              >
                Sign in now
              </Button>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...sectionTransition, delay: 0.15 }}
        >
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <motion.div
        className="text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...sectionTransition, delay: 0.15 }}
      >
        {bands.length} bands competing • {userVotes.length > 0 ? 'You have voted' : 'Vote for your favorite'}
      </motion.div>

      {/* Leaderboard Section */}
      {bands.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...sectionTransition, delay: 0.16 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Top 10 Bands</h2>
            <Link href="/bands/leaderboard">
              <Button variant="outline" size="sm">
                View Full Leaderboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <Leaderboard 
            initialBands={bands} 
            limit={10}
            showTitle={false}
          />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.18 }}
      >
        <h2 className="text-2xl font-bold mb-4">All Bands</h2>
        <BandGrid
          bands={bands}
          userVotes={userVotes}
          onVote={handleVote}
          isLoading={false}
          error={null}
        />
      </motion.div>
    </motion.div>
  );
}
