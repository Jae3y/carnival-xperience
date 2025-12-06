'use client';

import { useState, useEffect } from 'react';
import { BandCard } from './band-card';
import type { Band, BandVote } from '@/types/carnival';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BandGridProps {
  bands: Band[];
  userVotes?: BandVote[];
  onVote?: (bandId: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function BandGrid({ bands, userVotes = [], onVote, isLoading = false, error = null }: BandGridProps) {
  const [votedBandId, setVotedBandId] = useState<string | null>(null);

  useEffect(() => {
    // Find the band the user voted for (should only be one per year)
    const userVote = userVotes.find(vote => vote.year === new Date().getFullYear());
    if (userVote) {
      setVotedBandId(userVote.bandId);
    }
  }, [userVotes]);

  const handleVote = async (bandId: string) => {
    if (!onVote) return;
    
    try {
      await onVote(bandId);
      setVotedBandId(bandId);
    } catch (error) {
      // Error handling is done in the parent component
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading bands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (bands.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bands available for voting yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {bands.map((band) => (
        <BandCard
          key={band.id}
          band={band}
          hasVoted={votedBandId !== null}
          isVotedBand={votedBandId === band.id}
          onVote={handleVote}
        />
      ))}
    </div>
  );
}
