'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LiveFeed } from '@/components/carnival/live-feed';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Radio } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { LiveUpdate } from '@/types/carnival';

export default function LivePage() {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [carnivalStatus, setCarnivalStatus] = useState<'upcoming' | 'live' | 'ended'>('upcoming');
  const shouldReduceMotion = useReducedMotion();
  const supabase = createClient();

  const sectionTransition = {
    duration: 0.3,
    ease: 'easeOut',
  };

  useEffect(() => {
    fetchUpdates();
    determineCarnivalStatus();
  }, []);

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('live_updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const transformedUpdates: LiveUpdate[] = data.map((item) => ({
          id: item.id,
          content: item.content,
          eventId: item.event_id,
          location: item.location,
          imageUrl: item.image_url,
          isPinned: item.is_pinned || false,
          createdAt: new Date(item.created_at),
        }));
        setUpdates(transformedUpdates);
      }
    } catch (error) {
      console.error('Error fetching updates:', error);
    }
  };

  const determineCarnivalStatus = () => {
    // Calabar Carnival typically runs in late December
    const now = new Date();
    const currentYear = now.getFullYear();
    const carnivalStart = new Date(currentYear, 11, 20); // December 20
    const carnivalEnd = new Date(currentYear, 11, 31); // December 31

    if (now < carnivalStart) {
      setCarnivalStatus('upcoming');
    } else if (now >= carnivalStart && now <= carnivalEnd) {
      setCarnivalStatus('live');
    } else {
      setCarnivalStatus('ended');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUpdates();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getStatusBadge = () => {
    switch (carnivalStatus) {
      case 'live':
        return (
          <Badge className="bg-red-500 text-white animate-pulse">
            <Radio className="h-3 w-3 mr-1" />
            LIVE NOW
          </Badge>
        );
      case 'upcoming':
        return (
          <Badge variant="secondary">
            Upcoming
          </Badge>
        );
      case 'ended':
        return (
          <Badge variant="outline">
            Event Ended
          </Badge>
        );
    }
  };

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
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Live Updates</h1>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-muted-foreground">
            {carnivalStatus === 'live' 
              ? 'Real-time updates from Calabar Carnival 2025'
              : carnivalStatus === 'upcoming'
              ? 'Stay tuned for live updates during the carnival'
              : 'Relive the highlights from this year\'s carnival'
            }
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.1 }}
      >
        <LiveFeed initialUpdates={updates} autoRefresh={true} />
      </motion.div>
    </motion.div>
  );
}
