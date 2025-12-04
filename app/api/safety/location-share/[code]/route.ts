import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UpdateLocationRequest {
  latitude: number;
  longitude: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createClient();

    const { data: share, error } = await supabase
      .from('location_shares')
      .select('*')
      .eq('share_code', code)
      .single();

    if (error || !share) {
      return NextResponse.json(
        { success: false, error: 'Location share not found' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(share.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Location share has expired' },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase
      .from('location_shares')
      .update({ view_count: (share.view_count || 0) + 1 })
      .eq('id', share.id);

    return NextResponse.json({
      success: true,
      share: {
        id: share.id,
        shareCode: share.share_code,
        currentLat: share.current_lat,
        currentLng: share.current_lng,
        locationHistory: share.location_history || [],
        name: share.name,
        expiresAt: share.expires_at,
        updateInterval: share.update_interval,
        isPublic: share.is_public,
        viewCount: share.view_count + 1,
        lastUpdated: share.last_updated,
        createdAt: share.created_at,
      },
    });
  } catch (error) {
    console.error('Location share GET by code error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: UpdateLocationRequest = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Get existing share
    const { data: existingShare, error: fetchError } = await supabase
      .from('location_shares')
      .select('*')
      .eq('share_code', code)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingShare) {
      return NextResponse.json(
        { success: false, error: 'Location share not found or not owned by user' },
        { status: 404 }
      );
    }

    // Check if expired
    if (new Date(existingShare.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Location share has expired' },
        { status: 404 }
      );
    }

    // Append to location history
    const locationHistory = existingShare.location_history || [];
    locationHistory.push({
      lat: latitude,
      lng: longitude,
      timestamp: new Date().toISOString(),
    });

    const { data: updatedShare, error: updateError } = await supabase
      .from('location_shares')
      .update({
        current_lat: latitude,
        current_lng: longitude,
        location_history: locationHistory,
        last_updated: new Date().toISOString(),
      })
      .eq('id', existingShare.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating location share:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update location share' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      share: {
        id: updatedShare.id,
        userId: updatedShare.user_id,
        shareCode: updatedShare.share_code,
        currentLat: updatedShare.current_lat,
        currentLng: updatedShare.current_lng,
        locationHistory: updatedShare.location_history,
        name: updatedShare.name,
        expiresAt: updatedShare.expires_at,
        updateInterval: updatedShare.update_interval,
        isPublic: updatedShare.is_public,
        viewCount: updatedShare.view_count,
        lastUpdated: updatedShare.last_updated,
        createdAt: updatedShare.created_at,
      },
    });
  } catch (error) {
    console.error('Location share PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
