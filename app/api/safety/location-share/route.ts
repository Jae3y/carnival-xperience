import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { nanoid } from 'nanoid';

interface CreateLocationShareRequest {
  latitude: number;
  longitude: number;
  name?: string;
  expiresInMinutes?: number;
  isPublic?: boolean;
}

function generateShareCode(): string {
  return nanoid(8).toUpperCase();
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: shares, error } = await supabase
      .from('location_shares')
      .select('*')
      .eq('user_id', user.id)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching location shares:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch location shares' },
        { status: 500 }
      );
    }

    const mappedShares = shares?.map(share => ({
      id: share.id,
      userId: share.user_id,
      shareCode: share.share_code,
      currentLat: share.current_lat,
      currentLng: share.current_lng,
      locationHistory: share.location_history || [],
      name: share.name,
      expiresAt: share.expires_at,
      updateInterval: share.update_interval,
      isPublic: share.is_public,
      viewCount: share.view_count,
      lastUpdated: share.last_updated,
      createdAt: share.created_at,
    })) || [];

    return NextResponse.json({ success: true, shares: mappedShares });
  } catch (error) {
    console.error('Location share GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateLocationShareRequest = await request.json();
    const { latitude, longitude, name, expiresInMinutes = 60, isPublic = false } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const shareCode = generateShareCode();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const { data: share, error: insertError } = await supabase
      .from('location_shares')
      .insert({
        user_id: user.id,
        share_code: shareCode,
        current_lat: latitude,
        current_lng: longitude,
        location_history: [{ lat: latitude, lng: longitude, timestamp: new Date().toISOString() }],
        name: name || null,
        expires_at: expiresAt.toISOString(),
        is_public: isPublic,
        view_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating location share:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create location share' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      share: {
        id: share.id,
        userId: share.user_id,
        shareCode: share.share_code,
        currentLat: share.current_lat,
        currentLng: share.current_lng,
        locationHistory: share.location_history,
        name: share.name,
        expiresAt: share.expires_at,
        updateInterval: share.update_interval,
        isPublic: share.is_public,
        viewCount: share.view_count,
        lastUpdated: share.last_updated,
        createdAt: share.created_at,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Location share POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
