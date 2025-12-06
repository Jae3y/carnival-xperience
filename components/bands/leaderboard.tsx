'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Band } from '@/types/carnival';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  initialBands: Band[];
  limit?: number;
  showTitle?: boolean;
  className?: string;
}

export function Leaderboard({ 
  initialBands, 
  limit, 
  showTitle = true,
  className 
}: LeaderboardProps) {
  const [bands, setBands] = useState<Band[]>(initialBands);
  const supabase = createClient();

  useEffect(() => {
    // Sort bands by vote count in descending order
    const sortedBands = [...initialBands].sort((a, b) => b.voteCount - a.voteCount);
    const displayBands = limit ? sortedBands.slice(0, limit) : sortedBands;
    setBands(displayBands);

    // Set up real-time subscription for vote updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bands',
        },
        (payload: any) => {
          if (payload.eventType === 'UPDATE') {
            const updatedBand = {
              id: payload.new.id,
              name: payload.new.name,
              description: payload.new.description,
              theme: payload.new.theme,
              imageUrl: payload.new.image_url,
              voteCount: payload.new.vote_count,
              year: payload.new.year,
              createdAt: new Date(payload.new.created_at),
              updatedAt: new Date(payload.new.updated_at),
            } as Band;
            
            setBands((currentBands) => {
              // Update the band in the list
              const updatedList = currentBands.map((band) =>
                band.id === updatedBand.id ? updatedBand : band
              );
              
              // Re-sort by vote count
              const sorted = updatedList.sort((a, b) => b.voteCount - a.voteCount);
              
              // Apply limit if specified
              return limit ? sorted.slice(0, limit) : sorted;
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialBands, limit, supabase]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-500 text-white';
      case 2:
        return 'bg-gray-400 text-white';
      case 3:
        return 'bg-amber-600 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={className}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Band Leaderboard
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? '' : 'p-6'}>
        <div className="space-y-3">
          {bands.map((band, index) => {
            const rank = index + 1;
            const icon = getRankIcon(rank);
            
            return (
              <div
                key={band.id}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg transition-all duration-200',
                  rank <= 3 
                    ? 'bg-gradient-to-r from-primary/5 to-transparent border border-primary/20' 
                    : 'bg-muted/50 hover:bg-muted'
                )}
              >
                {/* Rank */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  {icon ? (
                    icon
                  ) : (
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      getRankBadgeColor(rank)
                    )}>
                      {rank}
                    </div>
                  )}
                </div>

                {/* Band Image */}
                <div className="flex-shrink-0 relative w-12 h-12 rounded-lg overflow-hidden">
                  {band.imageUrl ? (
                    <Image
                      src={band.imageUrl}
                      alt={band.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-xl">🎭</span>
                    </div>
                  )}
                </div>

                {/* Band Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm line-clamp-1">
                    {band.name}
                  </h4>
                  {band.theme && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {band.theme}
                    </p>
                  )}
                </div>

                {/* Vote Count */}
                <div className="flex-shrink-0 text-right">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                    <span className="font-bold text-lg">
                      {band.voteCount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">votes</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
