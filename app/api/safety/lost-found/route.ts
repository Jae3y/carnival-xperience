import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CreateLostFoundRequest {
  type: 'lost' | 'found';
  itemName: string;
  itemDescription: string;
  category: string;
  color?: string;
  brand?: string;
  distinctiveFeatures?: string;
  locationName: string;
  locationLat?: number;
  locationLng?: number;
  lostFoundAt?: string;
  images?: string[];
  contactPhone: string;
  contactEmail?: string;
  contactMethodPreference?: 'phone' | 'email';
  rewardOffered?: boolean;
  rewardAmount?: number;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'lost' | 'found' | null;
    const status = searchParams.get('status');

    let query = supabase
      .from('lost_found')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: items, error } = await query;

    if (error) {
      console.error('Error fetching lost/found items:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch lost/found items' },
        { status: 500 }
      );
    }

    const mappedItems = items?.map(item => ({
      id: item.id,
      userId: item.user_id,
      type: item.type,
      itemName: item.item_name,
      itemDescription: item.item_description,
      category: item.category,
      color: item.color,
      brand: item.brand,
      distinctiveFeatures: item.distinctive_features,
      locationName: item.location_name,
      locationLat: item.location_lat,
      locationLng: item.location_lng,
      lostFoundAt: item.lost_found_at,
      images: item.images || [],
      contactPhone: item.contact_phone,
      contactEmail: item.contact_email,
      contactMethodPreference: item.contact_method_preference,
      status: item.status,
      matchedWithId: item.matched_with_id,
      resolvedAt: item.resolved_at,
      rewardOffered: item.reward_offered,
      rewardAmount: item.reward_amount,
      viewCount: item.view_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    })) || [];

    return NextResponse.json({ success: true, items: mappedItems });
  } catch (error) {
    console.error('Lost/found GET error:', error);
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

    const body: CreateLostFoundRequest = await request.json();
    const {
      type,
      itemName,
      itemDescription,
      category,
      color,
      brand,
      distinctiveFeatures,
      locationName,
      locationLat,
      locationLng,
      lostFoundAt,
      images,
      contactPhone,
      contactEmail,
      contactMethodPreference = 'phone',
      rewardOffered = false,
      rewardAmount,
    } = body;

    // Validate required fields
    if (!type || !itemName || !itemDescription || !category || !locationName || !contactPhone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type, itemName, itemDescription, category, locationName, contactPhone' },
        { status: 400 }
      );
    }

    if (type !== 'lost' && type !== 'found') {
      return NextResponse.json(
        { success: false, error: 'Type must be "lost" or "found"' },
        { status: 400 }
      );
    }

    const { data: item, error: insertError } = await supabase
      .from('lost_found')
      .insert({
        user_id: user.id,
        type,
        item_name: itemName.trim(),
        item_description: itemDescription.trim(),
        category,
        color: color || null,
        brand: brand || null,
        distinctive_features: distinctiveFeatures || null,
        location_name: locationName.trim(),
        location_lat: locationLat || null,
        location_lng: locationLng || null,
        lost_found_at: lostFoundAt || null,
        images: images || [],
        contact_phone: contactPhone,
        contact_email: contactEmail || null,
        contact_method_preference: contactMethodPreference,
        status: 'open',
        reward_offered: rewardOffered,
        reward_amount: rewardAmount || null,
        view_count: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating lost/found item:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create lost/found report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      item: {
        id: item.id,
        userId: item.user_id,
        type: item.type,
        itemName: item.item_name,
        itemDescription: item.item_description,
        category: item.category,
        color: item.color,
        brand: item.brand,
        distinctiveFeatures: item.distinctive_features,
        locationName: item.location_name,
        locationLat: item.location_lat,
        locationLng: item.location_lng,
        lostFoundAt: item.lost_found_at,
        images: item.images,
        contactPhone: item.contact_phone,
        contactEmail: item.contact_email,
        contactMethodPreference: item.contact_method_preference,
        status: item.status,
        rewardOffered: item.reward_offered,
        rewardAmount: item.reward_amount,
        viewCount: item.view_count,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Lost/found POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
