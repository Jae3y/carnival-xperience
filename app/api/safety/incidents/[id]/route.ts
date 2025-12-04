import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UpdateIncidentRequest {
  status?: 'reported' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed';
  resolutionNotes?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: incident, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error || !incident) {
      return NextResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
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
        images: incident.images || [],
        status: incident.status,
        resolutionNotes: incident.resolution_notes,
        resolvedAt: incident.resolved_at,
        resolvedBy: incident.resolved_by,
        createdAt: incident.created_at,
        updatedAt: incident.updated_at,
      },
    });
  } catch (error) {
    console.error('Incident GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: UpdateIncidentRequest = await request.json();
    const { status, resolutionNotes } = body;

    // Verify incident exists and belongs to user
    const { data: existingIncident, error: fetchError } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !existingIncident) {
      return NextResponse.json(
        { success: false, error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      const validStatuses = ['reported', 'acknowledged', 'in-progress', 'resolved', 'closed'];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Invalid status' },
          { status: 400 }
        );
      }
      updateData.status = status;
      
      if (status === 'resolved' || status === 'closed') {
        updateData.resolved_at = new Date().toISOString();
        updateData.resolved_by = user.id;
      }
    }

    if (resolutionNotes !== undefined) {
      updateData.resolution_notes = resolutionNotes;
    }

    const { data: updatedIncident, error: updateError } = await supabase
      .from('incident_reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating incident:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update incident' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      incident: {
        id: updatedIncident.id,
        userId: updatedIncident.user_id,
        type: updatedIncident.type,
        severity: updatedIncident.severity,
        description: updatedIncident.description,
        locationLat: updatedIncident.location_lat,
        locationLng: updatedIncident.location_lng,
        locationName: updatedIncident.location_name,
        images: updatedIncident.images || [],
        status: updatedIncident.status,
        resolutionNotes: updatedIncident.resolution_notes,
        resolvedAt: updatedIncident.resolved_at,
        resolvedBy: updatedIncident.resolved_by,
        createdAt: updatedIncident.created_at,
        updatedAt: updatedIncident.updated_at,
      },
    });
  } catch (error) {
    console.error('Incident PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
