import { createClient } from './server';
import type { UserProfile, EmergencyContact, Event, EventCategory, Hotel, HotelBooking, BookingRequest } from '@/types';
import { CALABAR_CARNIVAL_EVENTS } from '@/lib/sample-data/calabar-events';
import { CALABAR_CARNIVAL_HOTELS } from '@/lib/sample-data/calabar-hotels';

// User Profile Queries
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    username: data.username,
    fullName: data.full_name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    phone: data.phone,
    languagePreference: data.language_preference || 'en',
    notificationPreferences: data.notification_preferences || { push: true, email: true, sms: false },
    locationSharingEnabled: data.location_sharing_enabled || false,
    emergencyContacts: data.emergency_contacts || [],
    preferences: data.preferences || { favoriteCategories: [], accessibilityNeeds: [] },
    gamificationStats: data.gamification_stats || { badges: [], points: 0, level: 1 },
    isVerified: data.is_verified || false,
    isVendor: data.is_vendor || false,
    isOrganizer: data.is_organizer || false,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    username: string;
    fullName: string;
    avatarUrl: string;
    bio: string;
    phone: string;
    languagePreference: string;
    notificationPreferences: Record<string, boolean>;
    locationSharingEnabled: boolean;
    emergencyContacts: EmergencyContact[];
    preferences: Record<string, unknown>;
  }>
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const dbUpdates: Record<string, unknown> = {};
  if (updates.username !== undefined) dbUpdates.username = updates.username;
  if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
  if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
  if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
  if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
  if (updates.languagePreference !== undefined) dbUpdates.language_preference = updates.languagePreference;
  if (updates.notificationPreferences !== undefined) dbUpdates.notification_preferences = updates.notificationPreferences;
  if (updates.locationSharingEnabled !== undefined) dbUpdates.location_sharing_enabled = updates.locationSharingEnabled;
  if (updates.emergencyContacts !== undefined) dbUpdates.emergency_contacts = updates.emergencyContacts;
  if (updates.preferences !== undefined) dbUpdates.preferences = updates.preferences;

  const { error } = await supabase
    .from('user_profiles')
    .update(dbUpdates)
    .eq('id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function createUserProfile(
  userId: string,
  data: { fullName?: string; email?: string }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { error } = await supabase.from('user_profiles').insert({
    id: userId,
    full_name: data.fullName,
    language_preference: 'en',
    notification_preferences: { push: true, email: true, sms: false },
    location_sharing_enabled: false,
    emergency_contacts: [],
    preferences: { favoriteCategories: [], accessibilityNeeds: [] },
    gamification_stats: { badges: [], points: 0, level: 1 },
    is_verified: false,
    is_vendor: false,
    is_organizer: false,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

// Emergency Contacts
export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  const profile = await getUserProfile(userId);
  return profile?.emergencyContacts || [];
}

export async function updateEmergencyContacts(
  userId: string,
  contacts: EmergencyContact[]
): Promise<{ success: boolean; error?: string }> {
  return updateUserProfile(userId, { emergencyContacts: contacts });
}

// Event Queries
interface GetEventsOptions {
  category?: EventCategory;
  startDate?: Date;
  endDate?: Date;
  isFeatured?: boolean;
  isTrending?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

function mapEventFromDb(data: Record<string, unknown>): Event {
  return {
    id: data.id as string,
    slug: data.slug as string,
    name: data.name as string,
    tagline: data.tagline as string | undefined,
    description: data.description as string,
    longDescription: data.long_description as string | undefined,
    category: data.category as EventCategory,
    subcategory: data.subcategory as string | undefined,
    tags: (data.tags as string[]) || [],
    venueName: data.venue_name as string,
    venueDescription: data.venue_description as string | undefined,
    locationLat: data.location_lat as number,
    locationLng: data.location_lng as number,
    address: data.address as string | undefined,
    capacity: data.capacity as number | undefined,
    attendanceCount: (data.attendance_count as number) || 0,
    startTime: new Date(data.start_time as string),
    endTime: new Date(data.end_time as string),
    timezone: (data.timezone as string) || 'Africa/Lagos',
    featuredImage: data.featured_image as string | undefined,
    images: (data.images as string[]) || [],
    videoUrl: data.video_url as string | undefined,
    liveStreamUrl: data.live_stream_url as string | undefined,
    organizerId: data.organizer_id as string | undefined,
    organizerName: data.organizer_name as string | undefined,
    isFree: (data.is_free as boolean) || false,
    ticketRequired: (data.ticket_required as boolean) || false,
    ticketPrice: data.ticket_price as number | undefined,
    ticketsAvailable: data.tickets_available as number | undefined,
    isFeatured: (data.is_featured as boolean) || false,
    isTrending: (data.is_trending as boolean) || false,
    isLive: (data.is_live as boolean) || false,
    accessibilityFeatures: (data.accessibility_features as string[]) || [],
    amenities: (data.amenities as string[]) || [],
    viewCount: (data.view_count as number) || 0,
    saveCount: (data.save_count as number) || 0,
    shareCount: (data.share_count as number) || 0,
    rating: data.rating as number | undefined,
    reviewCount: (data.review_count as number) || 0,
    status: (data.status as Event['status']) || 'upcoming',
    createdAt: new Date(data.created_at as string),
    updatedAt: new Date(data.updated_at as string),
  };
}

function getSampleEvents(options: GetEventsOptions = {}): Event[] {
  const { category, startDate, endDate, isFeatured, isTrending, search, limit = 20, offset = 0 } = options;

  let events = CALABAR_CARNIVAL_EVENTS.filter((event) => event.status === 'upcoming');

  if (category) events = events.filter((event) => event.category === category);
  if (startDate)
    events = events.filter((event) => new Date(event.startTime).getTime() >= startDate.getTime());
  if (endDate)
    events = events.filter((event) => new Date(event.endTime).getTime() <= endDate.getTime());
  if (isFeatured !== undefined) events = events.filter((event) => event.isFeatured === isFeatured);
  if (isTrending !== undefined) events = events.filter((event) => event.isTrending === isTrending);
  if (search) {
    const term = search.toLowerCase();
    events = events.filter((event) =>
      event.name.toLowerCase().includes(term) ||
      (event.description && event.description.toLowerCase().includes(term)) ||
      event.tags?.some((tag) => tag.toLowerCase().includes(term)),
    );
  }

  const startIndex = offset;
  const endIndex = offset + limit;
  return events.slice(startIndex, endIndex);
}

export async function getEvents(options: GetEventsOptions = {}): Promise<Event[]> {
  const supabase = await createClient();
  const { category, startDate, endDate, isFeatured, isTrending, search, limit = 20, offset = 0 } = options;

  let query = supabase.from('events').select('*').eq('status', 'upcoming').order('start_time', { ascending: true });

  if (category) query = query.eq('category', category);
  if (startDate) query = query.gte('start_time', startDate.toISOString());
  if (endDate) query = query.lte('end_time', endDate.toISOString());
  if (isFeatured !== undefined) query = query.eq('is_featured', isFeatured);
  if (isTrending !== undefined) query = query.eq('is_trending', isTrending);
  if (search) query = query.ilike('name', `%${search}%`);

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return getSampleEvents(options);
  }

  return data.map(mapEventFromDb);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('events').select('*').eq('slug', slug).single();
  if (!error && data) return mapEventFromDb(data);

  const fallback = CALABAR_CARNIVAL_EVENTS.find((event) => event.slug === slug) || null;
  return fallback || null;
}

export async function getEventById(id: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('events').select('*').eq('id', id).single();
  if (!error && data) return mapEventFromDb(data);

  const fallback = CALABAR_CARNIVAL_EVENTS.find((event) => event.id === id) || null;
  return fallback || null;
}

export async function saveEvent(userId: string, eventId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('saved_events').insert({ user_id: userId, event_id: eventId });
  if (error) return { success: false, error: error.message };
  await supabase.rpc('increment_event_save_count', { event_id: eventId });
  return { success: true };
}

export async function unsaveEvent(userId: string, eventId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('saved_events').delete().eq('user_id', userId).eq('event_id', eventId);
  if (error) return { success: false, error: error.message };
  await supabase.rpc('decrement_event_save_count', { event_id: eventId });
  return { success: true };
}

export async function getSavedEvents(userId: string): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('saved_events')
    .select('events(*)')
    .eq('user_id', userId);
  if (error || !data) return [];
  return data.map((item) => mapEventFromDb(item.events as unknown as Record<string, unknown>));
}

export async function isEventSaved(userId: string, eventId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('saved_events')
    .select('id')
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single();
  return !!data;
}

// Hotel Queries
interface GetHotelsOptions {
  priceRange?: Hotel['priceRange'];
  starRating?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'distance' | 'price' | 'rating';
  limit?: number;
  offset?: number;
}

function mapHotelFromDb(data: Record<string, unknown>): Hotel {
  return {
    id: data.id as string,
    slug: data.slug as string,
    name: data.name as string,
    description: data.description as string | undefined,
    address: data.address as string,
    locationLat: data.location_lat as number,
    locationLng: data.location_lng as number,
    phone: data.phone as string,
    email: data.email as string | undefined,
    website: data.website as string | undefined,
    whatsapp: data.whatsapp as string | undefined,
    starRating: data.star_rating as Hotel['starRating'],
    priceRange: data.price_range as Hotel['priceRange'],
    pricePerNightMin: data.price_per_night_min as number,
    pricePerNightMax: data.price_per_night_max as number,
    totalRooms: data.total_rooms as number,
    availableRooms: data.available_rooms as number,
    amenities: (data.amenities as string[]) || [],
    roomTypes: (data.room_types as Hotel['roomTypes']) || [],
    policies: data.policies as Hotel['policies'],
    images: (data.images as string[]) || [],
    virtualTourUrl: data.virtual_tour_url as string | undefined,
    distanceFromCenter: data.distance_from_center as number,
    verified: (data.verified as boolean) || false,
    paystackSubaccountCode: data.paystack_subaccount_code as string | undefined,
    commissionRate: (data.commission_rate as number) || 0.1,
    rating: data.rating as number | undefined,
    reviewCount: (data.review_count as number) || 0,
    carnivalSpecialRate: data.carnival_special_rate as number | undefined,
    isActive: (data.is_active as boolean) || true,
    createdAt: new Date(data.created_at as string),
    updatedAt: new Date(data.updated_at as string),
  };
}

function getSampleHotels(options: GetHotelsOptions = {}): Hotel[] {
  const { priceRange, starRating, minPrice, maxPrice, search, sortBy = 'distance', limit = 20, offset = 0 } = options;

  let hotels = CALABAR_CARNIVAL_HOTELS.filter((hotel) => hotel.isActive);

  if (priceRange) hotels = hotels.filter((hotel) => hotel.priceRange === priceRange);
  if (starRating) hotels = hotels.filter((hotel) => hotel.starRating >= starRating);
  if (minPrice) hotels = hotels.filter((hotel) => hotel.pricePerNightMin >= minPrice);
  if (maxPrice) hotels = hotels.filter((hotel) => hotel.pricePerNightMax <= maxPrice);
  if (search) {
    const term = search.toLowerCase();
    hotels = hotels.filter((hotel) =>
      hotel.name.toLowerCase().includes(term) ||
      hotel.address.toLowerCase().includes(term) ||
      (hotel.description && hotel.description.toLowerCase().includes(term)),
    );
  }

  if (sortBy === 'distance') hotels = [...hotels].sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
  else if (sortBy === 'price') hotels = [...hotels].sort((a, b) => a.pricePerNightMin - b.pricePerNightMin);
  else if (sortBy === 'rating') hotels = [...hotels].sort((a, b) => (b.rating || 0) - (a.rating || 0));

  const startIndex = offset;
  const endIndex = offset + limit;
  return hotels.slice(startIndex, endIndex);
}

export async function getHotels(options: GetHotelsOptions = {}): Promise<Hotel[]> {
  const supabase = await createClient();
  const { priceRange, starRating, minPrice, maxPrice, search, sortBy = 'distance', limit = 20, offset = 0 } = options;

  let query = supabase.from('hotels').select('*').eq('is_active', true);

  if (priceRange) query = query.eq('price_range', priceRange);
  if (starRating) query = query.gte('star_rating', starRating);
  if (minPrice) query = query.gte('price_per_night_min', minPrice);
  if (maxPrice) query = query.lte('price_per_night_max', maxPrice);
  if (search) query = query.ilike('name', `%${search}%`);

  if (sortBy === 'distance') query = query.order('distance_from_center', { ascending: true });
  else if (sortBy === 'price') query = query.order('price_per_night_min', { ascending: true });
  else if (sortBy === 'rating') query = query.order('rating', { ascending: false, nullsFirst: false });

  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return getSampleHotels(options);
  }

  return data.map(mapHotelFromDb);
}

export async function getHotelBySlug(slug: string): Promise<Hotel | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('hotels').select('*').eq('slug', slug).single();
  if (!error && data) return mapHotelFromDb(data);

  const fallback = CALABAR_CARNIVAL_HOTELS.find((hotel) => hotel.slug === slug) || null;
  return fallback || null;
}

export async function getHotelById(id: string): Promise<Hotel | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('hotels').select('*').eq('id', id).single();
  if (!error && data) return mapHotelFromDb(data);

  const fallback = CALABAR_CARNIVAL_HOTELS.find((hotel) => hotel.id === id) || null;
  return fallback || null;
}

export async function checkHotelAvailability(
  hotelId: string,
  checkIn: Date,
  checkOut: Date,
  roomType: string,
  roomCount: number
): Promise<{ available: boolean; availableRooms: number }> {
  const supabase = await createClient();

  // Get hotel room info
  const hotel = await getHotelById(hotelId);
  if (!hotel) return { available: false, availableRooms: 0 };

  const room = hotel.roomTypes.find(r => r.type === roomType);
  if (!room) return { available: false, availableRooms: 0 };

  // Check existing bookings for the date range
  const { data: bookings } = await supabase
    .from('hotel_bookings')
    .select('room_count')
    .eq('hotel_id', hotelId)
    .eq('room_type', roomType)
    .in('status', ['pending', 'confirmed', 'checked-in'])
    .or(`check_in_date.lte.${checkOut.toISOString()},check_out_date.gte.${checkIn.toISOString()}`);

  const bookedRooms = bookings?.reduce((sum, b) => sum + (b.room_count as number), 0) || 0;
  const availableRooms = room.available - bookedRooms;

  return {
    available: availableRooms >= roomCount,
    availableRooms: Math.max(0, availableRooms),
  };
}

function generateBookingReference(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CX-${timestamp}-${random}`;
}

export async function createBooking(
  userId: string,
  request: BookingRequest
): Promise<{ success: boolean; booking?: HotelBooking; error?: string }> {
  const supabase = await createClient();

  // Check availability first
  const availability = await checkHotelAvailability(
    request.hotelId,
    request.checkInDate,
    request.checkOutDate,
    request.roomType,
    request.roomCount
  );

  if (!availability.available) {
    return { success: false, error: 'Rooms not available for selected dates' };
  }

  const hotel = await getHotelById(request.hotelId);
  if (!hotel) return { success: false, error: 'Hotel not found' };

  const room = hotel.roomTypes.find(r => r.type === request.roomType);
  if (!room) return { success: false, error: 'Room type not found' };

  const nights = Math.ceil((request.checkOutDate.getTime() - request.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.price * nights * request.roomCount;
  const platformFee = totalAmount * hotel.commissionRate;

  const bookingReference = generateBookingReference();

  const { data, error } = await supabase
    .from('hotel_bookings')
    .insert({
      booking_reference: bookingReference,
      hotel_id: request.hotelId,
      user_id: userId,
      check_in_date: request.checkInDate.toISOString(),
      check_out_date: request.checkOutDate.toISOString(),
      nights,
      room_type: request.roomType,
      room_count: request.roomCount,
      guest_count: request.guestCount,
      price_per_night: room.price,
      total_amount: totalAmount,
      platform_fee: platformFee,
      guest_name: request.guestName,
      guest_email: request.guestEmail,
      guest_phone: request.guestPhone,
      special_requests: request.specialRequests,
      payment_status: 'pending',
      status: 'pending',
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  return {
    success: true,
    booking: mapBookingFromDb(data),
  };
}

function mapBookingFromDb(data: Record<string, unknown>): HotelBooking {
  return {
    id: data.id as string,
    bookingReference: data.booking_reference as string,
    hotelId: data.hotel_id as string,
    userId: data.user_id as string,
    checkInDate: new Date(data.check_in_date as string),
    checkOutDate: new Date(data.check_out_date as string),
    nights: data.nights as number,
    roomType: data.room_type as string,
    roomCount: data.room_count as number,
    guestCount: data.guest_count as number,
    pricePerNight: data.price_per_night as number,
    totalAmount: data.total_amount as number,
    platformFee: data.platform_fee as number,
    guestName: data.guest_name as string,
    guestEmail: data.guest_email as string,
    guestPhone: data.guest_phone as string,
    specialRequests: data.special_requests as string | undefined,
    paymentStatus: data.payment_status as HotelBooking['paymentStatus'],
    paymentReference: data.payment_reference as string | undefined,
    paymentMethod: data.payment_method as string | undefined,
    paidAt: data.paid_at ? new Date(data.paid_at as string) : undefined,
    status: data.status as HotelBooking['status'],
    cancellationReason: data.cancellation_reason as string | undefined,
    cancelledAt: data.cancelled_at ? new Date(data.cancelled_at as string) : undefined,
    createdAt: new Date(data.created_at as string),
    updatedAt: new Date(data.updated_at as string),
  };
}

export async function getUserBookings(userId: string): Promise<HotelBooking[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hotel_bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapBookingFromDb);
}

export async function getBookingByReference(reference: string): Promise<HotelBooking | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('hotel_bookings')
    .select('*')
    .eq('booking_reference', reference)
    .single();

  if (error || !data) return null;
  return mapBookingFromDb(data);
}
