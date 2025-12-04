# Implementation Plan

- [x] 1. Safety Emergency API



  - [x] 1.1 Create emergency alert endpoint

    - Create `app/api/safety/emergency/route.ts` with POST handler
    - Validate authentication and request body
    - Create incident report with critical severity in Supabase
    - Return created incident with unique ID
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 1.2 Write property tests for emergency API

    - **Property 1: Emergency Alert Creates Critical Incident**
    - **Property 2: Emergency Alert ID Uniqueness**
    - **Validates: Requirements 1.1, 1.3**

- [x] 2. Location Share API



  - [x] 2.1 Create location share endpoints

    - Create `app/api/safety/location-share/route.ts` with GET and POST handlers
    - POST: Generate unique share code, persist to location_shares table
    - GET: Return user's active location shares
    - _Requirements: 2.1_

  - [x] 2.2 Create location share by code endpoint

    - Create `app/api/safety/location-share/[code]/route.ts` with GET and PATCH handlers
    - GET: Return share data if not expired, 404 if expired
    - PATCH: Update coordinates and append to location history
    - _Requirements: 2.2, 2.3, 2.4_

  - [x] 2.3 Write property tests for location share API

    - **Property 3: Location Share Code Uniqueness**
    - **Property 4: Location Share Update Appends History**
    - **Property 5: Location Share Round-Trip**
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 3. Incident Report API



  - [x] 3.1 Create incident report endpoints

    - Create `app/api/safety/incidents/route.ts` with GET and POST handlers
    - POST: Persist incident with type, severity, description, location, images
    - GET: Return user's incidents in reverse chronological order
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 Create single incident endpoint

    - Create `app/api/safety/incidents/[id]/route.ts` with GET and PATCH handlers
    - GET: Return single incident by ID
    - PATCH: Update status and resolution notes
    - _Requirements: 3.3_

  - [x] 3.3 Write property tests for incident API

    - **Property 6: Incident Report Round-Trip**
    - **Property 7: Incident Reports Reverse Chronological Order**
    - **Property 8: Incident Report Update Persistence**
    - **Validates: Requirements 3.1, 3.2, 3.3**

- [x] 4. Checkpoint - Ensure all tests pass


  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Family Group API



  - [x] 5.1 Create family group endpoints

    - Create `app/api/safety/family/route.ts` with GET and POST handlers
    - POST: Create family group with name, meeting point, emergency contact
    - GET: Return user's family groups
    - _Requirements: 4.1, 4.4_

  - [x] 5.2 Create single family group endpoint

    - Create `app/api/safety/family/[id]/route.ts` with GET, PATCH, DELETE handlers
    - GET: Return single group with members
    - PATCH: Update group details
    - DELETE: Soft delete (set is_active=false)
    - _Requirements: 4.1_

  - [x] 5.3 Create family members endpoint

    - Create `app/api/safety/family/[id]/members/route.ts` with GET and POST handlers
    - POST: Add member with role, name, details
    - GET: Return group members
    - _Requirements: 4.2_
  - [x] 5.4 Create single member endpoint


    - Create `app/api/safety/family/[id]/members/[memberId]/route.ts` with PATCH handler
    - PATCH: Update member details, mark missing/found with last seen location
    - _Requirements: 4.3_


  - [x] 5.5 Write property tests for family API





    - **Property 9: Family Group Round-Trip**
    - **Property 10: Family Member Round-Trip**
    - **Property 11: Family Member Missing Status Update**
    - **Validates: Requirements 4.1, 4.2, 4.3**

- [x] 6. Lost and Found API



  - [x] 6.1 Create lost/found endpoints

    - Create `app/api/safety/lost-found/route.ts` with GET and POST handlers
    - POST: Create lost/found report with all fields
    - GET: Return items filtered by type and status
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 6.2 Write property test for lost/found API

    - **Property 12: Lost Item Report Round-Trip**
    - **Validates: Requirements 5.1**

- [x] 7. Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. AI Concierge Session Persistence


  - [x] 8.1 Create chat session endpoints


    - Create `app/api/concierge/sessions/route.ts` with GET and POST handlers
    - POST: Create new chat session
    - GET: Return user's sessions with message counts
    - _Requirements: 6.1, 6.4_

  - [x] 8.2 Create single session endpoint

    - Create `app/api/concierge/sessions/[id]/route.ts` with GET and PATCH handlers
    - GET: Return session with messages (most recent active by default)
    - PATCH: Update session title or active status
    - _Requirements: 6.3_

  - [x] 8.3 Create messages endpoint

    - Create `app/api/concierge/sessions/[id]/messages/route.ts` with GET and POST handlers
    - POST: Add message with role and content
    - GET: Return session messages in chronological order
    - _Requirements: 6.2_

  - [x] 8.4 Write property tests for concierge API

    - **Property 13: Chat Session Creation**
    - **Property 14: Chat Message Round-Trip**
    - **Property 15: Chat Session Load Most Recent**
    - **Validates: Requirements 6.1, 6.2, 6.3**

- [x] 9. Wire Concierge UI to Persistence



  - [x] 9.1 Update chat interface to use session persistence

    - Modify `components/ai/chat-interface.tsx` to load/create sessions
    - Save messages to database on send
    - Load message history on mount
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 10. Update Emergency Contact Information



  - [x] 10.1 Replace placeholder emergency contacts

    - Update `app/(app)/safety/page.tsx` with realistic contacts
    - Replace `+234-XXX-XXX-XXXX` with "In-App Help Desk" labels
    - Keep Nigeria Emergency 112 as-is
    - _Requirements: 7.1, 7.2_

  - [x] 10.2 Update emergency button contacts

    - Update `components/safety/emergency-button.tsx` with realistic contacts
    - Add clear labels for in-app assistance options
    - _Requirements: 7.1, 7.2_

- [x] 11. Fix lib/safety/emergency.ts Table References



  - [x] 11.1 Update table names in emergency.ts

    - Change `emergency_contacts` to `safety_contacts`
    - Update column mappings to match actual schema
    - Fix location_shares column names (latitude→current_lat, longitude→current_lng)
    - _Requirements: All_

- [x] 12. Run Tests and Build



  - [x] 12.1 Run all tests

    - Execute `npm test` to run Jest tests
    - Verify all property tests pass
    - _Requirements: All_

  - [x] 12.2 Run linting

    - Execute `npm run lint` to check for issues
    - Fix any linting errors
    - _Requirements: All_

  - [x] 12.3 Run build

    - Execute `npm run build` to verify production build
    - Document any remaining backend gaps
    - _Requirements: All_

- [x] 13. Final Checkpoint - Ensure all tests pass



  - Ensure all tests pass, ask the user if questions arise.
