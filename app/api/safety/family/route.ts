import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CreateFamilyGroupRequest {
  name: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  meetingPointName?: string;
  emergencyContact?: string;
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

    // Get groups created by user or where user is a member
    const { data: groups, error } = await supabase
      .from('family_groups')
      .select(`
        *,
        family_members (*)
      `)
      .eq('created_by', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching family groups:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch family groups' },
        { status: 500 }
      );
    }

    const mappedGroups = groups?.map(group => ({
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
    })) || [];

    return NextResponse.json({ success: true, groups: mappedGroups });
  } catch (error) {
    console.error('Family groups GET error:', error);
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

    const body: CreateFamilyGroupRequest = await request.json();
    const { name, meetingPointLat, meetingPointLng, meetingPointName, emergencyContact } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Group name is required' },
        { status: 400 }
      );
    }

    const { data: group, error: insertError } = await supabase
      .from('family_groups')
      .insert({
        created_by: user.id,
        name: name.trim(),
        meeting_point_lat: meetingPointLat || null,
        meeting_point_lng: meetingPointLng || null,
        meeting_point_name: meetingPointName || null,
        emergency_contact: emergencyContact || null,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating family group:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create family group' },
        { status: 500 }
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
        members: [],
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Family groups POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
