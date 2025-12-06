'use client';

import Image from 'next/image';
import { Trophy, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShareButtons } from '@/components/carnival/share-buttons';
import type { Band } from '@/types/carnival';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BandCardProps {
  band: Band;
  hasVoted?: boolean;
  isVotedBand?: boolean;
  onVote?: (bandId: string) => Promise<void>;
  className?: string;
}

export function BandCard({ band, hasVoted = false, isVotedBand = false, onVote, className }: BandCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [optimisticVoteCount, setOptimisticVoteCount] = useState(band.voteCount);
  const [optimisticVoted, setOptimisticVoted] = useState(isVotedBand);

  const handleVote = async () => {
    if (!onVote || hasVoted || isVoting) return;

    setIsVoting(true);
    // Optimistic update
    setOptimisticVoteCount(prev => prev + 1);
    setOptimisticVoted(true);

    try {
      await onVote(band.id);
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticVoteCount(band.voteCount);
      setOptimisticVoted(isVotedBand);
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card className={cn('group overflow-hidden hover:shadow-lg transition-all duration-300', className)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        {band.imageUrl ? (
          <Image
            src={band.imageUrl}
            alt={band.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-6xl">🎭</span>
          </div>
        )}
        
        {/* Vote Count Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1.5">
          <Trophy className="h-4 w-4 text-yellow-600" />
          <span className="text-sm font-bold">{optimisticVoteCount.toLocaleString()}</span>
        </div>

        {/* Voted Indicator */}
        {optimisticVoted && (
          <div className="absolute top-3 left-3 bg-green-500 text-white rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <Check className="h-4 w-4" />
            <span className="text-sm font-bold">Voted</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-xl line-clamp-1 group-hover:text-primary transition-colors">
          {band.name}
        </h3>
        
        {band.theme && (
          <p className="text-sm text-primary font-medium mt-1 line-clamp-1">
            {band.theme}
          </p>
        )}

        {band.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {band.description}
          </p>
        )}

        <div className="mt-4 space-y-3">
          {optimisticVoted ? (
            <Button 
              className="w-full" 
              variant="outline" 
              disabled
            >
              <Check className="h-4 w-4 mr-2" />
              You Voted for This Band
            </Button>
          ) : hasVoted ? (
            <Button 
              className="w-full" 
              variant="outline" 
              disabled
            >
              Already Voted
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={handleVote}
              disabled={isVoting}
            >
              <Trophy className="h-4 w-4 mr-2" />
              {isVoting ? 'Voting...' : 'Vote for This Band'}
            </Button>
          )}

          {/* Share Button */}
          <ShareButtons
            url={`/bands?band=${band.id}`}
            title={`Vote for ${band.name}`}
            description={band.theme ? `${band.name} - ${band.theme}` : band.description}
            image={band.imageUrl}
            hashtags={['CalabarCarnival', 'CalabarCarnival2025', band.name.replace(/\s+/g, '')]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
