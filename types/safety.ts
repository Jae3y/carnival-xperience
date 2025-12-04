export interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: Date;
  accuracy?: number;
}

export interface Geofence {
  centerLat: number;
  centerLng: number;
  radiusMeters: number;
}

export interface LocationShare {
  id: string;
  userId: string;
  shareCode: string;
  currentLat: number;
  currentLng: number;
  locationHistory: LocationPoint[];
  name?: string;
  expiresAt: Date;
  updateInterval: number;
  sharedWithEmails: string[];
  isPublic: boolean;
  passwordProtected: boolean;
  accessPassword?: string;
  geofence?: Geofence;
  sosEnabled: boolean;
  viewCount: number;
  lastUpdated: Date;
  createdAt: Date;
}

export type FamilyMemberRole = 'parent' | 'child' | 'guardian' | 'member';

export interface FamilyGroup {
  id: string;
  createdBy: string;
  name: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  meetingPointName?: string;
  emergencyContact?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface FamilyMember {
  id: string;
  groupId: string;
  userId?: string;
  role: FamilyMemberRole;
  fullName: string;
  phone?: string;
  age?: number;
  photoUrl?: string;
  description?: string;
  isMissing: boolean;
  lastSeenLat?: number;
  lastSeenLng?: number;
  lastSeenAt?: Date;
  foundAt?: Date;
  createdAt: Date;
}

export type ItemCategory =
  | 'phone'
  | 'wallet'
  | 'bag'
  | 'jewelry'
  | 'documents'
  | 'keys'
  | 'clothing'
  | 'electronics'
  | 'other';

export type LostFoundStatus = 'open' | 'matched' | 'resolved' | 'claimed' | 'expired';

export interface LostFoundItem {
  id: string;
  userId: string;
  type: 'lost' | 'found';
  itemName: string;
  itemDescription: string;
  category: ItemCategory;
  color?: string;
  brand?: string;
  distinctiveFeatures?: string;
  locationName: string;
  locationLat?: number;
  locationLng?: number;
  lostFoundAt?: Date;
  images: string[];
  aiImageEmbedding?: number[];
  aiDescription?: string;
  aiSuggestedMatches: string[];
  contactPhone: string;
  contactEmail?: string;
  contactMethodPreference: 'phone' | 'email';
  status: LostFoundStatus;
  matchedWithId?: string;
  resolvedAt?: Date;
  rewardOffered: boolean;
  rewardAmount?: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed';

export interface IncidentReport {
  id: string;
  userId: string;
  type: string;
  severity: IncidentSeverity;
  description: string;
  locationLat: number;
  locationLng: number;
  locationName?: string;
  images: string[];
  status: IncidentStatus;
  resolutionNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}
