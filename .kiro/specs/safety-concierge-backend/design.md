# Design Document: Safety Center Backend & AI Concierge Persistence

## Overview

This feature implements the missing backend API routes for the Safety Center and AI Concierge features in CarnivalXperience. The implementation connects existing UI components to Supabase tables that are already defined in the database schema.

### Key Design Principles

1. **Use Existing Schema**: All tables (safety_contacts, location_shares, incident_reports, family_groups, family_members, lost_found, chat_sessions, chat_messages) already exist
2. **RESTful API Design**: Standard HTTP methods and status codes
3. **Authentication Required**: All endpoints require authenticated users via Supabase Auth
4. **Graceful Fallbacks**: Return appropriate error responses when operations fail

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         API ROUTES                               │
├─────────────────────────────────────────────────────────────────┤
│  /api/safety/                                                    │
│  ├── emergency/route.ts      POST - Create emergency alert       │
│  ├── location-share/route.ts GET, POST - Manage location shares  │
│  ├── location-share/[code]/route.ts GET, PATCH - By share code   │
│  ├── incidents/route.ts      GET, POST - Incident reports        │
│  ├── incidents/[id]/route.ts GET, PATCH - Single incident        │
│  ├── family/route.ts         GET, POST - Family groups           │
│  ├── family/[id]/route.ts    GET, PATCH, DELETE - Single group   │
│  ├── family/[id]/members/route.ts GET, POST - Group members      │
│  └── lost-found/route.ts     GET, POST - Lost/found items        │
│                                                                  │
│  /api/concierge/                                                 │
│  ├── sessions/route.ts       GET, POST - Chat sessions           │
│  ├── sessions/[id]/route.ts  GET, PATCH - Single session         │
│  └── sessions/[id]/messages/route.ts GET, POST - Messages        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE TABLES                             │
├─────────────────────────────────────────────────────────────────┤
│  safety_contacts, location_shares, incident_reports,            │
│  family_groups, family_members, lost_found,                     │
│  chat_sessions, chat_messages                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### API Route Handlers

```typescript
// app/api/safety/emergency/route.ts
interface EmergencyRequest {
  latitude?: number;
  longitude?: number;
  timestamp: string;
}

interface EmergencyResponse {
  success: boolean;
  incident?: IncidentReport;
  error?: string;
}

// app/api/safety/location-share/route.ts
interface CreateLocationShareRequest {
  latitude: number;
  longitude: number;
  name?: string;
  expiresInMinutes?: number; // default 60
  isPublic?: boolean;
}

interface LocationShareResponse {
  success: boolean;
  share?: LocationShare;
  error?: string;
}

// app/api/safety/incidents/route.ts
interface CreateIncidentRequest {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  locationLat: number;
  locationLng: number;
  locationName?: string;
  images?: string[];
}

// app/api/safety/family/route.ts
interface CreateFamilyGroupRequest {
  name: string;
  meetingPointLat?: number;
  meetingPointLng?: number;
  meetingPointName?: string;
  emergencyContact?: string;
}

// app/api/safety/family/[id]/members/route.ts
interface AddFamilyMemberRequest {
  fullName: string;
  role?: 'parent' | 'child' | 'guardian' | 'member';
  phone?: string;
  age?: number;
  photoUrl?: string;
  description?: string;
}

// app/api/safety/lost-found/route.ts
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

// app/api/concierge/sessions/route.ts
interface CreateSessionRequest {
  title?: string;
}

interface SessionResponse {
  success: boolean;
  session?: ChatSession;
  messages?: ChatMessage[];
  error?: string;
}

// app/api/concierge/sessions/[id]/messages/route.ts
interface SendMessageRequest {
  role: 'user' | 'assistant';
  content: string;
}
```

## Data Models

Data models are already defined in the existing types and database schema. Key types used:

```typescript
// From types/safety.ts - extended for API use
interface LocationShare {
  id: string;
  userId: string;
  shareCode: string;
  currentLat: number;
  currentLng: number;
  locationHistory: LocationPoint[];
  name?: string;
  expiresAt: Date;
  updateInterval: number;
  isPublic: boolean;
  viewCount: number;
  lastUpdated: Date;
  createdAt: Date;
}

interface IncidentReport {
  id: string;
  userId: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  locationLat: number;
  locationLng: number;
  locationName?: string;
  images: string[];
  status: 'reported' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed';
  resolutionNotes?: string;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface FamilyGroup {
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

interface FamilyMember {
  id: string;
  groupId: string;
  userId?: string;
  role: 'parent' | 'child' | 'guardian' | 'member';
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

interface ChatSession {
  id: string;
  userId: string;
  title?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatMessage {
  id: string;
  sessionId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Emergency Alert Creates Critical Incident
*For any* emergency alert with location data, the created incident report SHALL have severity 'critical' and location matching the provided coordinates.
**Validates: Requirements 1.1**

### Property 2: Emergency Alert ID Uniqueness
*For any* two emergency alerts created, their incident report IDs SHALL be distinct.
**Validates: Requirements 1.3**

### Property 3: Location Share Code Uniqueness
*For any* two location shares created, their share codes SHALL be distinct.
**Validates: Requirements 2.1**

### Property 4: Location Share Update Appends History
*For any* location share update, the location history SHALL contain all previous locations and the current location SHALL match the latest update.
**Validates: Requirements 2.2**

### Property 5: Location Share Round-Trip
*For any* created location share that has not expired, retrieving it by share code SHALL return data matching the original creation.
**Validates: Requirements 2.3**

### Property 6: Incident Report Round-Trip
*For any* submitted incident report, retrieving it SHALL return all submitted fields unchanged.
**Validates: Requirements 3.1**

### Property 7: Incident Reports Reverse Chronological Order
*For any* user with multiple incident reports, retrieving reports SHALL return them ordered by creation time descending (newest first).
**Validates: Requirements 3.2**

### Property 8: Incident Report Update Persistence
*For any* incident report status update with resolution notes, retrieving the report SHALL reflect the updated status and notes.
**Validates: Requirements 3.3**

### Property 9: Family Group Round-Trip
*For any* created family group with name, meeting point, and emergency contact, retrieving it SHALL return all fields unchanged.
**Validates: Requirements 4.1**

### Property 10: Family Member Round-Trip
*For any* added family member with role, name, and details, retrieving the group's members SHALL include that member with all fields unchanged.
**Validates: Requirements 4.2**

### Property 11: Family Member Missing Status Update
*For any* family member marked as missing with last seen location, retrieving the member SHALL show isMissing=true and the recorded last seen location.
**Validates: Requirements 4.3**

### Property 12: Lost Item Report Round-Trip
*For any* lost item report with description, category, location, images, and contact info, retrieving it SHALL return all fields unchanged.
**Validates: Requirements 5.1**

### Property 13: Chat Session Creation
*For any* new chat started, a chat session SHALL be created in the database with the user's ID.
**Validates: Requirements 6.1**

### Property 14: Chat Message Round-Trip
*For any* message sent in a chat session, retrieving the session's messages SHALL include that message with role, content, and timestamp preserved.
**Validates: Requirements 6.2**

### Property 15: Chat Session Load Most Recent
*For any* user with multiple chat sessions, loading the concierge SHALL return the most recent active session.
**Validates: Requirements 6.3**

## Error Handling

### API Error Responses

All API routes return consistent error responses:

```typescript
interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

// HTTP Status Codes
// 200 - Success
// 201 - Created
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (no auth)
// 403 - Forbidden (not owner)
// 404 - Not Found
// 500 - Internal Server Error
```

### Authentication Handling

```typescript
// All routes check authentication
const supabase = await createClient();
const { data: { user }, error } = await supabase.auth.getUser();

if (error || !user) {
  return NextResponse.json(
    { success: false, error: 'Unauthorized' },
    { status: 401 }
  );
}
```

## Testing Strategy

### Testing Framework

- **Unit Tests**: Jest
- **Property-Based Tests**: fast-check
- **Test Configuration**: Minimum 100 iterations per property test

### Property-Based Testing Approach

Each correctness property will have a corresponding property-based test using fast-check. Tests will use generators to create random valid inputs and verify the properties hold.

**Test File Structure**:
```
__tests__/
├── properties/
│   ├── safety-api.property.test.ts
│   └── concierge-api.property.test.ts
├── unit/
│   ├── safety-routes.test.ts
│   └── concierge-routes.test.ts
```

**Test Annotation Format**:
```typescript
// **Feature: safety-concierge-backend, Property 1: Emergency Alert Creates Critical Incident**
// **Validates: Requirements 1.1**
```

### Unit Testing Approach

Unit tests cover:
- API route handler logic
- Request validation
- Error response formatting
- Database query construction

### Emergency Contact Updates

Replace placeholder phone numbers in UI components with:
- Nigeria Emergency: 112 (existing, keep as-is)
- CarnivalXperience Help Desk: In-app support (clearly labeled)
- Medical Emergency: In-app medical assistance request
