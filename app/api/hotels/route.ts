import { NextRequest, NextResponse } from 'next/server';
import { getHotels } from '@/lib/supabase/queries';
import type { PriceRange } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const priceRange = searchParams.get('priceRange') as PriceRange | null;
  const starRating = searchParams.get('starRating');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sortBy') as 'distance' | 'price' | 'rating' | null;
  const limit = searchParams.get('limit');
  const offset = searchParams.get('offset');

  try {
    const hotels = await getHotels({
      priceRange: priceRange || undefined,
      starRating: starRating ? parseInt(starRating) : undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      search: search || undefined,
      sortBy: sortBy || undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

