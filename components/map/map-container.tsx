'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CARNIVAL_CENTER, type MapMarker } from '@/lib/maps/mapbox';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapContainerProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  showUserLocation?: boolean;
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

const markerColors: Record<string, string> = {
  event: '#8B5CF6',
  hotel: '#3B82F6',
  vendor: '#10B981',
  safety: '#EF4444',
  user: '#F59E0B',
};

export function MapContainer({
  markers = [],
  onMarkerClick,
  showUserLocation = true,
  className = '',
  initialCenter = CARNIVAL_CENTER,
  initialZoom = CARNIVAL_CENTER.zoom,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [, setUserLocation] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView(
      [initialCenter.lat, initialCenter.lng],
      initialZoom
    );

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add zoom control
    L.control.zoom({ position: 'topright' }).addTo(map.current);

    // Add scale control
    L.control.scale({ position: 'bottomleft' }).addTo(map.current);

    if (showUserLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map.current) {
            const userMarker = L.marker([position.coords.latitude, position.coords.longitude], {
              icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div style="background: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [22, 22],
                iconAnchor: [11, 11],
              }),
            }).addTo(map.current);
            markersRef.current.push(userMarker);
          }
        },
        (error) => console.error('Geolocation error:', error)
      );
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [initialCenter.lat, initialCenter.lng, initialZoom, showUserLocation]);

  // Update markers when they change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const iconHtml = `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: ${markerData.color || markerColors[markerData.type] || '#6B7280'};
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        ">
          ${getMarkerIcon(markerData.type)}
        </div>
      `;

      const marker = L.marker([markerData.lat, markerData.lng], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: iconHtml,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        }),
      }).addTo(map.current!);

      // Add popup
      const popupContent = `<strong>${markerData.title}</strong>${markerData.description ? `<p>${markerData.description}</p>` : ''}`;
      marker.bindPopup(popupContent);

      // Add click handler
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(markerData));
      }

      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick]);

  return <div ref={mapContainer} className={`w-full h-full min-h-[400px] ${className}`} />;
}

function getMarkerIcon(type: string): string {
  const icons: Record<string, string> = {
    event: '🎭',
    hotel: '🏨',
    vendor: '🍔',
    safety: '🚨',
    user: '📍',
  };
  return `<span style="font-size: 14px;">${icons[type] || '📍'}</span>`;
}

