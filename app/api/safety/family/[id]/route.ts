import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UpdateFamilyGroupRequest {
  name?: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  meetingPointName?: string;
  emergencyContact?: string;
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

    const { data: group, error } = await supabase
      .from('family_groups')
      .select(`
        *,
        family_members (*)
      `)
      .eq('id', id)
      .eq('created_by', user.id)
      .eq('is_active', true)
      .single();

    if (error || !group) {
      return NextResponse.json(
        { success: false, error: 'Family group not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      group: {
        id: group.id,
        createdBy: group.created_by,
        name: group.name,
        meetingPointLat: group.meeting_point_lat,
        meetingPointLng: group.meeting_point_lng,
        meetingPointName: group.meeting_point_name,
        emergencyContact: group.emergency_contact,
        isActive: group.is_active,
        createdAt: group.created_at,
        members: group.family_members?.map((member: Record<string, unknown>) => ({
          id: member.id,
          groupId: member.group_id,
          userId: member.user_id,
          role: member.role,
          fullName: member.full_name,
          phone: member.phone,
          age: member.age,
          photoUrl: member.photo_url,
          description: member.description,
          isMissing: member.is_missing,
          lastSeenLat: member.last_seen_lat,
          lastSeenLng: member.last_seen_lng,
          lastSeenAt: member.last_seen_at,
          foundAt: member.found_at,
          createdAt: member.created_at,
        })) || [],
      },
    });
  } catch (error) {
    console.error('Family group GET error:', error);
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

    // Verify group exists and belongs to user
    const { data: existingGroup, error: fetchError } = await supabase
      .from('family_groups')
      .select('*')
      .eq('id', id)
      .eq('created_by', user.id)
      .eq('is_active', true)
      .single();

    if (fetchError || !existingGroup) {
      return NextResponse.json(
        { success: false, error: 'Family group not found' },
        { status: 404 }
      );
    }

    const body: UpdateFamilyGroupRequest = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.meetingPointLat !== undefined) updateData.meeting_point_lat = body.meetingPointLat;
    if (body.meetingPointLng !== undefined) updateData.meeting_point_lng = body.meetingPointLng;
    if (body.meetingPointName !== undefined) updateData.meeting_point_name = body.meetingPointName;
    if (body.emergencyContact !== undefined) updateData.emergency_contact = body.emergencyContact;

    const { data: updatedGroup, error: updateError } = await supabase
      .from('family_groups')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating family group:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update family group' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      group: {
        id: updatedGroup.id,
        createdBy: updatedGroup.created_by,
        name: updatedGroup.name,
        meetingPointLat: updatedGroup.meeting_point_lat,
        meetingPointLng: updatedGroup.meeting_point_lng,
        meetingPointName: updatedGroup.meeting_point_name,
        emergencyContact: updatedGroup.emergency_contact,
        isActive: updatedGroup.is_active,
        createdAt: updatedGroup.created_at,
      },
    });
  } catch (error) {
    console.error('Family group PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Soft delete by setting is_active to false
    const { error: updateError } = await supabase
      .from('family_groups')
      .update({ is_active: false })
      .eq('id', id)
      .eq('created_by', user.id);

    if (updateError) {
      console.error('Error deleting family group:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete family group' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Family group DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
