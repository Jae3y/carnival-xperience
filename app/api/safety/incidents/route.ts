import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CreateIncidentRequest {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  locationLat: number;
  locationLng: number;
  locationName?: string;
  images?: string[];
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

    const { data: incidents, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching incidents:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch incidents' },
        { status: 500 }
      );
    }

    const mappedIncidents = incidents?.map(incident => ({
      id: incident.id,
      userId: incident.user_id,
      type: incident.type,
      severity: incident.severity,
      description: incident.description,
      locationLat: incident.location_lat,
      locationLng: incident.location_lng,
      locationName: incident.location_name,
      images: incident.images || [],
      status: incident.status,
      resolutionNotes: incident.resolution_notes,
      resolvedAt: incident.resolved_at,
      resolvedBy: incident.resolved_by,
      createdAt: incident.created_at,
      updatedAt: incident.updated_at,
    })) || [];

    return NextResponse.json({ success: true, incidents: mappedIncidents });
  } catch (error) {
    console.error('Incidents GET error:', error);
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

    const body: CreateIncidentRequest = await request.json();
    const { type, severity, description, locationLat, locationLng, locationName, images } = body;

    // Validate required fields
    if (!type || !severity || !description || typeof locationLat !== 'number' || typeof locationLng !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, severity, description, locationLat, locationLng' },
        { status: 400 }
      );
    }

    // Validate severity
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { success: false, error: 'Invalid severity. Must be: low, medium, high, or critical' },
        { status: 400 }
      );
    }

    const { data: incident, error: insertError } = await supabase
      .from('incident_reports')
      .insert({
        user_id: user.id,
        type,
        severity,
        description,
        location_lat: locationLat,
        location_lng: locationLng,
        location_name: locationName || null,
        images: images || [],
        status: 'reported',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating incident:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create incident report' },
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
    console.error('Incidents POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
