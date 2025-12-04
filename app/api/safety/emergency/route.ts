import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface EmergencyRequest {
  latitude?: number;
  longitude?: number;
  timestamp?: string;
}

interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' } as ApiErrorResponse,
        { status: 401 }
      );
    }

    const body: EmergencyRequest = await request.json();
    const { latitude, longitude } = body;

    // Create incident report with critical severity
    const { data: incident, error: insertError } = await supabase
      .from('incident_reports')
      .insert({
        user_id: user.id,
        type: 'emergency',
        severity: 'critical',
        description: 'Emergency alert triggered by user',
        location_lat: latitude ?? 0,
        location_lng: longitude ?? 0,
        location_name: 'Emergency location',
        images: [],
        status: 'reported',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating emergency alert:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create emergency alert' } as ApiErrorResponse,
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      incident: {
        id: incident.id,
        userId: incident.user_id,
        type: incident.type,
        severity: incident.severity,
        description: incident.description,
        locationLat: incident.location_lat,
        locationLng: incident.location_lng,
        locationName: incident.location_name,
        images: incident.images,
        status: incident.status,
        createdAt: incident.created_at,
        updatedAt: incident.updated_at,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Emergency API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as ApiErrorResponse,
      { status: 500 }
    );
  }
}
