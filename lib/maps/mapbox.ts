// Calabar carnival center coordinates
export const CARNIVAL_CENTER = {
  lat: 4.9517,
  lng: 8.322,
  zoom: 13,
};

export interface MapMarker {
  id: string;
  type: 'event' | 'hotel' | 'vendor' | 'safety' | 'user';
  lat: number;
  lng: number;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface RouteResult {
  distance: number; // in meters
  duration: number; // in seconds
  geometry: GeoJSON.LineString;
  steps: RouteStep[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
  };
}

export async function getDirections(
  origin: [number, number],
  destination: [number, number],
  profile: 'walking' | 'driving' | 'cycling' = 'walking'
): Promise<RouteResult | null> {
  // Simple fallback: calculate straight-line distance and estimated time
  // For production, you could use OpenRouteService API (free tier available)
  try {
    const distance = calculateDistance(origin[1], origin[0], destination[1], destination[0]);
    
    // Estimate duration based on profile (rough estimates)
    const speedMap = {
      walking: 5000 / 3600, // 5 km/h in m/s
      cycling: 15000 / 3600, // 15 km/h in m/s
      driving: 40000 / 3600, // 40 km/h in m/s (city driving)
    };
    
    const duration = distance / speedMap[profile];
    
    return {
      distance,
      duration,
      geometry: {
        type: 'LineString',
        coordinates: [origin, destination],
      },
      steps: [
        {
          instruction: `Head towards destination`,
          distance,
          duration,
          maneuver: {
            type: 'depart',
            location: origin,
          },
        },
        {
          instruction: 'Arrive at destination',
          distance: 0,
          duration: 0,
          maneuver: {
            type: 'arrive',
            location: destination,
          },
        },
      ],
    };
  } catch (error) {
    console.error('Error getting directions:', error);
    return null;
  }
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} hr ${remainingMinutes} min`;
}

