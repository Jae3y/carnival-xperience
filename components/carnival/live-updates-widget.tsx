'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { LiveUpdateCard } from './live-update-card';
import type { LiveUpdate } from '@/types/carnival';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Radio, ArrowRight } from 'lucide-react';
import { getFallbackLiveUpdates, transformLiveUpdateRow } from '@/lib/carnival/live-updates';

interface LiveUpdatesWidgetProps {
  limit?: number;
  className?: string;
}

export function LiveUpdatesWidget({ limit = 3, className }: LiveUpdatesWidgetProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    return createClient();
  }, [isSupabaseConfigured]);

  useEffect(() => {
    fetchLatestUpdates();

    if (!supabase) {
      return;
    }

    // Set up real-time subscription
    const channel = supabase
      .channel('live_updates_widget')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_updates',
        },
        () => {
          fetchLatestUpdates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [limit, supabase]);

  const setFallbackUpdates = () => {
    setUpdates(sortUpdates(getFallbackLiveUpdates(limit)));
  };

  const fetchLatestUpdates = async () => {
    if (!supabase) {
      setFallbackUpdates();
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('live_updates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      if (data && data.length > 0) {
        const transformedUpdates: LiveUpdate[] = data.map(transformLiveUpdateRow);
        setUpdates(sortUpdates(transformedUpdates));
      } else {
        setFallbackUpdates();
      }
    } catch (error) {
      console.error('Error fetching live updates:', error);
      setFallbackUpdates();
    } finally {
      setIsLoading(false);
    }
  };

  const sortUpdates = (list: LiveUpdate[]): LiveUpdate[] => {
    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-red-500" />
            Live Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (updates.length === 0) {
    return null; // Don't show widget if no updates
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-red-500 animate-pulse" />
            Live Updates
          </CardTitle>
          <Link href="/live">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {updates.map((update) => (
            <LiveUpdateCard key={update.id} update={update} />
          ))}
        </div>
        <Link href="/live">
          <Button variant="outline" className="w-full mt-4">
            See All Live Updates
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
