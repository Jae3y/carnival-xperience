import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface AddFamilyMemberRequest {
  fullName: string;
  role?: 'parent' | 'child' | 'guardian' | 'member';
  phone?: string;
  age?: number;
  photoUrl?: string;
  description?: string;
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

    const { data: members, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('group_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching family members:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch family members' },
        { status: 500 }
      );
    }

    const mappedMembers = members?.map(member => ({
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
    })) || [];

    return NextResponse.json({ success: true, members: mappedMembers });
  } catch (error) {
    console.error('Family members GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body: AddFamilyMemberRequest = await request.json();
    const { fullName, role = 'member', phone, age, photoUrl, description } = body;

    if (!fullName || fullName.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Full name is required' },
        { status: 400 }
      );
    }

    const { data: member, error: insertError } = await supabase
      .from('family_members')
      .insert({
        group_id: id,
        full_name: fullName.trim(),
        role,
        phone: phone || null,
        age: age || null,
        photo_url: photoUrl || null,
        description: description || null,
        is_missing: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error adding family member:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to add family member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      member: {
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
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Family members POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
