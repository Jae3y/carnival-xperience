import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/supabase/queries';
import type { EventCategory } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const category = searchParams.get('category') as EventCategory | null;
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const isFeatured = searchParams.get('featured');
  const isTrending = searchParams.get('trending');
  const search = searchParams.get('search');
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  try {
    const events = await getEvents({
      category: category || undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      isFeatured: isFeatured === 'true' ? true : undefined,
      isTrending: isTrending === 'true' ? true : undefined,
      search: search || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

