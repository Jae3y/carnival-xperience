# Requirements Document

## Introduction

This feature extends the CarnivalXperience platform by implementing missing backend API routes for the Safety Center and AI Concierge features. The Safety Center requires API endpoints to persist emergency alerts, location shares, incident reports, family group management, and lost/found items to Supabase. The AI Concierge requires endpoints to persist chat sessions and messages, enabling conversation history across sessions. Additionally, placeholder emergency contact information will be replaced with realistic in-app help desk details.

## Glossary

- **Safety Center**: The platform section providing emergency assistance, location sharing, incident reporting, and family reunification features
- **AI Concierge**: The GPT-4 powered chatbot assistant that helps users navigate the carnival
- **Chat Session**: A conversation thread between a user and the AI Concierge
- **Location Share**: A temporary, secure link that allows others to view a user's real-time location
- **Incident Report**: A user-submitted report of a safety concern with severity, location, and description
- **Family Group**: A collection of users linked together for safety tracking and reunification
- **Lost/Found Item**: A report of a lost or found item with description and contact information

## Requirements

### Requirement 1: Safety Emergency API

**User Story:** As a carnival attendee in distress, I want to trigger an emergency alert that records my location and notifies help, so that I can receive assistance quickly.

#### Acceptance Criteria

1. WHEN a user triggers the emergency button THEN the CarnivalXperience Platform SHALL create an incident report with critical severity and the user's current location
2. WHEN the emergency API receives a request without authentication THEN the CarnivalXperience Platform SHALL return a 401 unauthorized response
3. WHEN the emergency API successfully creates an alert THEN the CarnivalXperience Platform SHALL return the created incident report with a unique ID

### Requirement 2: Location Share API

**User Story:** As a carnival attendee, I want to create and manage location shares through API endpoints, so that my friends and family can track my location.

#### Acceptance Criteria

1. WHEN a user creates a location share THEN the CarnivalXperience Platform SHALL generate a unique share code and persist the share to the database
2. WHEN a user updates their location share THEN the CarnivalXperience Platform SHALL update the current coordinates and append to location history
3. WHEN a user retrieves a location share by code THEN the CarnivalXperience Platform SHALL return the share data if not expired
4. WHEN a location share has expired THEN the CarnivalXperience Platform SHALL return a 404 not found response

### Requirement 3: Incident Report API

**User Story:** As a carnival attendee, I want to submit and track incident reports through API endpoints, so that safety issues are documented and addressed.

#### Acceptance Criteria

1. WHEN a user submits an incident report THEN the CarnivalXperience Platform SHALL persist the report with type, severity, description, location, and optional images
2. WHEN a user retrieves their incident reports THEN the CarnivalXperience Platform SHALL return all reports for that user in reverse chronological order
3. WHEN an incident report is updated THEN the CarnivalXperience Platform SHALL persist the status change and resolution notes

### Requirement 4: Family Group API

**User Story:** As a parent or guardian, I want to manage family groups through API endpoints, so that I can track and coordinate with family members.

#### Acceptance Criteria

1. WHEN a user creates a family group THEN the CarnivalXperience Platform SHALL persist the group with name, meeting point, and emergency contact
2. WHEN a user adds a family member THEN the CarnivalXperience Platform SHALL persist the member with role, name, and optional details
3. WHEN a user marks a family member as missing THEN the CarnivalXperience Platform SHALL update the member status and record last seen location
4. WHEN a user retrieves family groups THEN the CarnivalXperience Platform SHALL return all groups the user created or belongs to

### Requirement 5: Lost and Found API

**User Story:** As a carnival attendee, I want to report lost or found items through API endpoints, so that items can be matched and returned.

#### Acceptance Criteria

1. WHEN a user reports a lost item THEN the CarnivalXperience Platform SHALL persist the report with description, category, location, images, and contact information
2. WHEN a user reports a found item THEN the CarnivalXperience Platform SHALL persist the report and check for potential matches
3. WHEN a user retrieves lost/found items THEN the CarnivalXperience Platform SHALL return items filtered by type and status

### Requirement 6: AI Concierge Session Persistence

**User Story:** As a carnival attendee, I want my AI concierge conversations to be saved, so that I can continue conversations across sessions.

#### Acceptance Criteria

1. WHEN a user starts a new chat THEN the CarnivalXperience Platform SHALL create a chat session in the database
2. WHEN a user sends a message THEN the CarnivalXperience Platform SHALL persist the message with role, content, and timestamp
3. WHEN a user opens the concierge page THEN the CarnivalXperience Platform SHALL load the most recent active session with message history
4. WHEN a user retrieves chat sessions THEN the CarnivalXperience Platform SHALL return all sessions for that user with message counts

### Requirement 7: Emergency Contact Information

**User Story:** As a carnival attendee, I want to see realistic emergency contact information, so that I can reach help when needed.

#### Acceptance Criteria

1. WHEN a user views emergency contacts THEN the CarnivalXperience Platform SHALL display the Nigeria Emergency number (112) and CarnivalXperience Help Desk contact
2. WHEN emergency contacts contain placeholder text THEN the CarnivalXperience Platform SHALL replace placeholders with clearly-labeled in-app help desk details
