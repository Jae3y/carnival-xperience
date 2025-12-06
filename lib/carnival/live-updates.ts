'use client';

import type { LiveUpdate } from '@/types/carnival';
import { CALABAR_LIVE_UPDATES } from '@/lib/sample-data/calabar-live-updates';

type LiveUpdateRow = {
  id: string;
  content: string;
  event_id?: string | null;
  location?: string | null;
  image_url?: string | null;
  is_pinned?: boolean | null;
  created_at?: string | Date | null;
};

export function transformLiveUpdateRow(row: LiveUpdateRow): LiveUpdate {
  return {
    id: row.id ?? crypto.randomUUID(),
    content: row.content ?? '',
    eventId: row.event_id ?? undefined,
    location: row.location ?? undefined,
    imageUrl: row.image_url ?? undefined,
    isPinned: Boolean(row.is_pinned),
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  };
}

export function getFallbackLiveUpdates(limit?: number): LiveUpdate[] {
  const baseTime = Date.now();
  const updates = CALABAR_LIVE_UPDATES.map((update, index) => ({
    id: `sample-live-update-${index + 1}`,
    content: update.content,
    eventId: update.eventId,
    location: update.location,
    imageUrl: update.imageUrl,
    isPinned: update.isPinned ?? false,
    createdAt: new Date(baseTime - index * 45 * 60 * 1000),
  }));

  return typeof limit === 'number' ? updates.slice(0, limit) : updates;
}
