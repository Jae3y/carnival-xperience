# CarnivalXperience 🎭

A comprehensive platform for discovering, booking, and safely experiencing the Calabar Carnival. Built with Next.js, Supabase, and AI-powered features.

## Overview

CarnivalXperience is a full-stack web application designed to enhance the carnival experience by providing:

- **Event Discovery**: Browse and filter carnival events with real-time countdown timers
- **Hotel Marketplace**: Search and book accommodations with integrated payment processing
- **Interactive Maps**: Explore carnival venues, hotels, and vendors using free OpenStreetMap tiles
- **Safety Hub**: Emergency contacts, family tracking, location sharing, and incident reporting
- **AI Concierge**: Chat-based assistant powered by OpenAI for personalized recommendations
- **Community Features**: Social gamification, user reviews, and vendor ratings

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Maps**: Leaflet + OpenStreetMap (no API key required)
- **AI**: OpenAI API integration
- **Payments**: Paystack integration
- **Testing**: Jest, Fast-Check (property-based testing)
- **Authentication**: Supabase Auth with OAuth support

## Features

### 🎪 Event Management
- Browse carnival events with filters (date, category, location)
- Real-time countdown timers for upcoming events
- Save favorite events to profile
- Event details with location and directions

### 🏨 Hotel Booking
- Search hotels by location and availability
- View room details and pricing
- Integrated booking system with Paystack payments
- Booking confirmation and management

### 🗺️ Interactive Maps
- View events, hotels, and vendors on an interactive map
- Get directions with distance and time estimates
- Geolocation support for user location
- Custom markers for different venue types

### 🚨 Safety Features
- Emergency contact system with one-tap calling
- Family member tracking and location sharing
- Incident reporting and documentation
- Lost & found item management
- Location sharing with time-limited access codes

### 🤖 AI Concierge
- Chat interface for personalized recommendations
- Voice command support (ready for implementation)
- Real-time conversation history
- Context-aware responses

### 👥 Community & Gamification
- User profiles with preferences
- Social features and community engagement
- Vendor ratings and reviews
- Gamification elements (badges, points)

## 🚀 Quick Start (Hackathon Demo)

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)
- OpenAI API key (optional - for AI concierge only)

### Installation (5 minutes)

1. Clone the repository:
```bash
git clone https://github.com/Jae3y/carnival-xperience.git
cd carnival-xperience
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` (minimum required):
```env
# Required for basic demo
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for AI concierge)
OPENAI_API_KEY=your_openai_api_key

# Optional (for hotel bookings)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### 🎬 Demo Ready!

The app comes with sample data for:
- 120+ carnival events
- 40+ hotels
- 12 vendors
- Interactive map with markers

See `HACKATHON_DEMO_GUIDE.md` for a complete 3-minute demo script!

## Project Structure

```
carnival-xperience/
├── app/                      # Next.js app directory
│   ├── (app)/               # Protected routes
│   ├── (auth)/              # Authentication routes
│   ├── api/                 # API endpoints
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── events/              # Event-related components
│   ├── hotels/              # Hotel-related components
│   ├── map/                 # Map components
│   ├── safety/              # Safety feature components
│   ├── ai/                  # AI concierge components
│   └── ui/                  # Reusable UI components
├── lib/                     # Utility functions
│   ├── maps/                # Map utilities (Leaflet, geocoding)
│   ├── ai/                  # AI integration
│   ├── payments/            # Payment processing
│   ├── safety/              # Safety utilities
│   └── supabase/            # Database queries
├── types/                   # TypeScript type definitions
├── __tests__/               # Test files
├── supabase/                # Database migrations
└── .kiro/specs/             # Feature specifications
```

## Database Schema

The application uses Supabase PostgreSQL with the following main tables:

- **users**: User profiles and authentication
- **events**: Carnival events and details
- **hotels**: Hotel listings and availability
- **bookings**: Hotel reservations
- **safety_incidents**: Incident reports
- **family_members**: Family tracking data
- **location_shares**: Shared location access
- **concierge_sessions**: AI chat history
- **vendors**: Vendor information and ratings

See `supabase/migrations/` for complete schema definitions.

## Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run property-based tests
npm test -- properties
```

The project includes:
- Unit tests for core functionality
- Property-based tests using Fast-Check for universal correctness properties
- Integration tests for API endpoints

## API Endpoints

### Events
- `GET /api/events` - List all events
- `POST /api/events/[eventId]/save` - Save event to profile
- `DELETE /api/events/[eventId]/unsave` - Remove saved event

### Hotels
- `GET /api/hotels` - List hotels
- `POST /api/bookings` - Create booking

### Safety
- `POST /api/safety/emergency` - Report emergency
- `POST /api/safety/incidents` - Report incident
- `POST /api/safety/family` - Manage family members
- `POST /api/safety/location-share` - Create location share link

### Concierge
- `POST /api/concierge/sessions` - Create chat session
- `POST /api/concierge/sessions/[id]/messages` - Send message

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
docker build -t carnival-xperience .
docker run -p 3000:3000 carnival-xperience
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## Specifications

Detailed feature specifications are available in `.kiro/specs/`:
- `carnivalxperience/` - Main platform specifications
- `safety-concierge-backend/` - Safety and AI features

Each spec includes:
- Requirements document with acceptance criteria
- Design document with architecture and correctness properties
- Implementation tasks and checklist

## 🎉 Hackathon Status: READY!

### ✅ Fully Implemented (95% Complete - Demo-Ready)
- ✨ **Landing Page** - Animated hero with live countdown to Calabar Carnival
- 🎭 **Event Discovery** - 120+ events with filters, categories, and countdown timers
- 🏨 **Hotel Marketplace** - 40+ hotels with search, booking, and availability indicators
- 🍔 **Vendor Directory** - 12 vendors across 7 categories (food, drinks, crafts, services)
- 🗺️ **Interactive Map** - Leaflet + OpenStreetMap (NO API KEY NEEDED!)
- 🚨 **Safety Hub** - Emergency contacts, location sharing, incident reporting, family tracking
- 🤖 **AI Concierge** - Chat-based recommendations powered by OpenAI
- 👤 **User Authentication** - Login/signup with Supabase Auth
- 📱 **Mobile Responsive** - Beautiful UI that works on any device
- 🎨 **Dark/Light Theme** - Accessible design with theme toggle

### ⚠️ Optional Features (Not Required for Demo)
- Payment processing (Paystack integration ready, needs testing)
- Real-time notifications (schema ready, UI pending)
- PWA offline features (service worker configured)
- Voice commands (UI exists, not wired up)

### 📋 Future Enhancements
- Real-time crowd density heatmaps
- Push notifications for event reminders
- Advanced analytics dashboard
- Vendor management portal
- Multi-language support (Pidgin, Efik, Igbo, Yoruba, Hausa)
- Mobile app (React Native)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@carnivalxperience.com

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Maps powered by [Leaflet](https://leafletjs.com/) and [OpenStreetMap](https://www.openstreetmap.org/)
- Database by [Supabase](https://supabase.com/)
- AI by [OpenAI](https://openai.com/)
- Payments by [Paystack](https://paystack.com/)