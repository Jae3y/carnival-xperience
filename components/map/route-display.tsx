'use client';

import { useState, useEffect } from 'react';
import { Navigation, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getDirections, formatDistance, formatDuration, type RouteResult } from '@/lib/maps/mapbox';

interface RouteDisplayProps {
  origin: [number, number];
  destination: [number, number];
  destinationName?: string;
  profile?: 'walking' | 'driving' | 'cycling';
  onRouteCalculated?: (route: RouteResult) => void;
}

export function RouteDisplay({
  origin,
  destination,
  destinationName = 'Destination',
  profile = 'walking',
  onRouteCalculated,
}: RouteDisplayProps) {
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await getDirections(origin, destination, profile);
        if (result) {
          setRoute(result);
          onRouteCalculated?.(result);
        } else {
          setError('Could not calculate route');
        }
      } catch (err) {
        setError('Error calculating route');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (origin && destination) {
      fetchRoute();
    }
  }, [origin, destination, profile, onRouteCalculated]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-2">
            <Navigation className="h-5 w-5 animate-pulse" />
            <span>Calculating route...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!route) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Navigation className="h-5 w-5" />
          Directions to {destinationName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDistance(route.distance)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{formatDuration(route.duration)}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSteps(!showSteps)}
          >
            {showSteps ? (
              <>Hide Steps <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Show Steps <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </div>

        {showSteps && (
          <div className="space-y-2 border-t pt-4">
            {route.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{step.instruction}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistance(step.distance)} · {formatDuration(step.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

