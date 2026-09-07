export interface GeocodingResult {
  id: string;
  placeName: string;
  coordinates: [number, number]; // [lng, lat]
  relevance: number;
  placeType: string[];
  address?: string;
  context?: {
    neighborhood?: string;
    locality?: string;
    place?: string;
    region?: string;
    country?: string;
  };
}

export async function geocodeAddress(query: string): Promise<GeocodingResult[]> {
  // Using Nominatim (OpenStreetMap) - free, no API key required
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=ng&limit=5&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CarnivalXperience/1.0', // Required by Nominatim
      },
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.place_id.toString(),
        placeName: item.display_name,
        coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
        relevance: parseFloat(item.importance || 0.5),
        placeType: [item.type],
        address: item.address?.road || item.address?.suburb,
        context: {
          neighborhood: item.address?.suburb || item.address?.neighbourhood,
          locality: item.address?.city || item.address?.town,
          place: item.address?.city || item.address?.town,
          region: item.address?.state,
          country: item.address?.country,
        },
      }));
    }
    return [];
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
}

export async function reverseGeocode(lng: number, lat: number): Promise<GeocodingResult | null> {
  // Using Nominatim (OpenStreetMap) - free, no API key required
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CarnivalXperience/1.0', // Required by Nominatim
      },
    });
    const data = await response.json();

    if (data && data.place_id) {
      return {
        id: data.place_id.toString(),
        placeName: data.display_name,
        coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
        relevance: parseFloat(data.importance || 0.5),
        placeType: [data.type],
        address: data.address?.road || data.address?.suburb,
        context: {
          neighborhood: data.address?.suburb || data.address?.neighbourhood,
          locality: data.address?.city || data.address?.town,
          place: data.address?.city || data.address?.town,
          region: data.address?.state,
          country: data.address?.country,
        },
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}



