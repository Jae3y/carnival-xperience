import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UpdateFamilyMemberRequest {
  fullName?: string;
  role?: 'parent' | 'child' | 'guardian' | 'member';
  phone?: string;
  age?: number;
  photoUrl?: string;
  description?: string;
  isMissing?: boolean;
  lastSeenLat?: number;
  lastSeenLng?: number;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify group exists and belongs to user
    const { data: group, error: groupError } = await supabase
      .from('family_groups')
      .select('id')
      .eq('id', id)
      .eq('created_by', user.id)
      .eq('is_active', true)
      .single();

    if (groupError || !group) {
      return NextResponse.json(
        { success: false, error: 'Family group not found' },
        { status: 404 }
      );
    }

    // Verify member exists in this group
    const { data: existingMember, error: memberError } = await supabase
      .from('family_members')
      .select('*')
      .eq('id', memberId)
      .eq('group_id', id)
      .single();

    if (memberError || !existingMember) {
      return NextResponse.json(
        { success: false, error: 'Family member not found' },
        { status: 404 }
      );
    }

    const body: UpdateFamilyMemberRequest = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.fullName !== undefined) updateData.full_name = body.fullName.trim();
    if (body.role !== undefined) updateData.role = body.role;
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.age !== undefined) updateData.age = body.age;
    if (body.photoUrl !== undefined) updateData.photo_url = body.photoUrl;
    if (body.description !== undefined) updateData.description = body.description;

    // Handle missing status update
    if (body.isMissing !== undefined) {
      updateData.is_missing = body.isMissing;
      
      if (body.isMissing) {
        // Mark as missing - record last seen location and time
        updateData.last_seen_at = new Date().toISOString();
        if (body.lastSeenLat !== undefined) updateData.last_seen_lat = body.lastSeenLat;
        if (body.lastSeenLng !== undefined) updateData.last_seen_lng = body.lastSeenLng;
        updateData.found_at = null;
      } else {
        // Mark as found
        updateData.found_at = new Date().toISOString();
      }
    }

    const { data: updatedMember, error: updateError } = await supabase
      .from('family_members')
      .update(updateData)
      .eq('id', memberId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating family member:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to update family member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      member: {
        id: updatedMember.id,
        groupId: updatedMember.group_id,
        userId: updatedMember.user_id,
        role: updatedMember.role,
        fullName: updatedMember.full_name,
        phone: updatedMember.phone,
        age: updatedMember.age,
        photoUrl: updatedMember.photo_url,
        description: updatedMember.description,
        isMissing: updatedMember.is_missing,
        lastSeenLat: updatedMember.last_seen_lat,
        lastSeenLng: updatedMember.last_seen_lng,
        lastSeenAt: updatedMember.last_seen_at,
        foundAt: updatedMember.found_at,
        createdAt: updatedMember.created_at,
      },
    });
  } catch (error) {
    console.error('Family member PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
