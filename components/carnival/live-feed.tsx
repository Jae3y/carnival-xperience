'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LiveUpdateCard } from './live-update-card';
import type { LiveUpdate } from '@/types/carnival';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface LiveFeedProps {
  initialUpdates?: LiveUpdate[];
  autoRefresh?: boolean;
  className?: string;
}

export function LiveFeed({ initialUpdates = [], autoRefresh = true, className }: LiveFeedProps) {
  const [updates, setUpdates] = useState<LiveUpdate[]>(initialUpdates);
  const [isLoading, setIsLoading] = useState(!initialUpdates.length);
  const supabase = createClient();

  useEffect(() => {
    // Fetch initial updates if not provided
    if (!initialUpdates.length) {
      fetchUpdates();
    }

    // Set up real-time subscription if autoRefresh is enabled
    if (autoRefresh) {
      const channel = supabase
        .channel('live_updates_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'live_updates',
          },
          (payload) => {
            if (payload.eventType === 'INSERT') {
              const newUpdate = transformUpdate(payload.new);
              setUpdates((current) => {
                // Add new update and re-sort
                const updated = [newUpdate, ...current];
                return sortUpdates(updated);
              });
            } else if (payload.eventType === 'UPDATE') {
              const updatedUpdate = transformUpdate(payload.new);
              setUpdates((current) => {
                const updated = current.map((u) =>
                  u.id === updatedUpdate.id ? updatedUpdate : u
                );
                return sortUpdates(updated);
              });
            } else if (payload.eventType === 'DELETE') {
              setUpdates((current) =>
                current.filter((u) => u.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [autoRefresh, initialUpdates.length]);

  const fetchUpdates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('live_updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedUpdates = data.map(transformUpdate);
        setUpdates(sortUpdates(transformedUpdates));
      }
    } catch (error) {
      console.error('Error fetching live updates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const transformUpdate = (data: any): LiveUpdate => ({
    id: data.id,
    content: data.content,
    eventId: data.event_id,
    location: data.location,
    imageUrl: data.image_url,
    isPinned: data.is_pinned || false,
    createdAt: new Date(data.created_at),
  });

  const sortUpdates = (updates: LiveUpdate[]): LiveUpdate[] => {
    // Sort: pinned first, then by creation date (newest first)
    return [...updates].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  if (isLoading) {
    return (
      <div className={className}>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className={className}>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No live updates available at the moment. Check back during the carnival for real-time updates!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {updates.map((update) => (
          <LiveUpdateCard key={update.id} update={update} />
        ))}
      </div>
    </div>
  );
}
