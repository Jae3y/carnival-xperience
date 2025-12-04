import { createClient } from '@/lib/supabase/client';
import { nanoid } from 'nanoid';

export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface LocationShare {
  id: string;
  userId: string;
  shareCode: string;
  latitude: number;
  longitude: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentReport {
  id: string;
  userId: string;
  type: 'medical' | 'security' | 'lost_person' | 'theft' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  latitude?: number;
  longitude?: number;
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}

// Generate unique share code
export function generateShareCode(): string {
  return nanoid(8).toUpperCase();
}

// Emergency Contacts (using safety_contacts table)
export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('safety_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('is_primary', { ascending: false });

  if (error) throw error;
  return data?.map(mapEmergencyContact) || [];
}

export async function addEmergencyContact(
  userId: string,
  contact: Omit<EmergencyContact, 'id' | 'userId' | 'createdAt'>
): Promise<EmergencyContact> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('safety_contacts')
    .insert({
      user_id: userId,
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      is_primary: contact.isPrimary,
    })
    .select()
    .single();

  if (error) throw error;
  return mapEmergencyContact(data);
}

// Location Sharing
export async function createLocationShare(
  userId: string,
  latitude: number,
  longitude: number,
  expiresInMinutes: number = 60
): Promise<LocationShare> {
  const supabase = createClient();
  const shareCode = generateShareCode();
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  const { data, error } = await supabase
    .from('location_shares')
    .insert({
      user_id: userId,
      share_code: shareCode,
      current_lat: latitude,
      current_lng: longitude,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return mapLocationShare(data);
}

export async function getLocationByShareCode(shareCode: string): Promise<LocationShare | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('location_shares')
    .select('*')
    .eq('share_code', shareCode)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) return null;
  return mapLocationShare(data);
}

export async function updateLocationShare(
  shareCode: string,
  latitude: number,
  longitude: number
): Promise<LocationShare | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('location_shares')
    .update({ current_lat: latitude, current_lng: longitude, last_updated: new Date().toISOString() })
    .eq('share_code', shareCode)
    .select()
    .single();

  if (error || !data) return null;
  return mapLocationShare(data);
}

// Incident Reporting
export async function submitIncidentReport(
  userId: string,
  report: Omit<IncidentReport, 'id' | 'userId' | 'status' | 'createdAt' | 'resolvedAt'>
): Promise<IncidentReport> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('incident_reports')
    .insert({
      user_id: userId,
      type: report.type,
      severity: report.severity,
      description: report.description,
      latitude: report.latitude,
      longitude: report.longitude,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return mapIncidentReport(data);
}

// Mappers
function mapEmergencyContact(data: Record<string, unknown>): EmergencyContact {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    name: data.name as string,
    phone: data.phone as string,
    relationship: data.relationship as string,
    isPrimary: data.is_primary as boolean,
    createdAt: new Date(data.created_at as string),
  };
}

function mapLocationShare(data: Record<string, unknown>): LocationShare {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    shareCode: data.share_code as string,
    latitude: data.current_lat as number,
    longitude: data.current_lng as number,
    expiresAt: new Date(data.expires_at as string),
    isActive: true, // Table doesn't have is_active, shares are active if not expired
    createdAt: new Date(data.created_at as string),
    updatedAt: new Date((data.last_updated || data.created_at) as string),
  };
}

function mapIncidentReport(data: Record<string, unknown>): IncidentReport {
  return {
    id: data.id as string,
    userId: data.user_id as string,
    type: data.type as IncidentReport['type'],
    severity: data.severity as IncidentReport['severity'],
    description: data.description as string,
    latitude: data.latitude as number | undefined,
    longitude: data.longitude as number | undefined,
    status: data.status as IncidentReport['status'],
    createdAt: new Date(data.created_at as string),
    resolvedAt: data.resolved_at ? new Date(data.resolved_at as string) : undefined,
  };
}

