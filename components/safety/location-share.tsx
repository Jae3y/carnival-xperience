'use client';

import { useState, useEffect } from 'react';
import { Share2, Copy, Check, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LocationShareProps {
  className?: string;
}

export function LocationShare({ className }: LocationShareProps) {
  const [shareCode, setShareCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [duration, setDuration] = useState('60');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, []);

  const createShare = async () => {
    if (!location) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/safety/location-share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: location.lat,
          longitude: location.lng,
          expiresInMinutes: parseInt(duration),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setShareCode(data.shareCode);
        setExpiresAt(new Date(data.expiresAt));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = async () => {
    if (!shareCode) return;
    const link = `${window.location.origin}/share/${shareCode}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (!shareCode) return;
    const link = `${window.location.origin}/share/${shareCode}`;
    if (navigator.share) {
      await navigator.share({
        title: 'My Location',
        text: 'Track my location at Calabar Carnival',
        url: link,
      });
    } else {
      copyLink();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Share Your Location
        </CardTitle>
        <CardDescription>
          Let friends and family track your location during the carnival
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!shareCode ? (
          <>
            <div className="space-y-2">
              <Label>Share Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={createShare} disabled={isLoading || !location} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Share2 className="h-4 w-4 mr-2" />
              )}
              Create Share Link
            </Button>

            {!location && (
              <p className="text-sm text-muted-foreground text-center">
                Enable location access to share your position
              </p>
            )}
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={`${window.location.origin}/share/${shareCode}`} readOnly />
                <Button variant="outline" size="icon" onClick={copyLink}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {expiresAt && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expires: {expiresAt.toLocaleTimeString()}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={shareLink} className="flex-1">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={() => setShareCode(null)} className="flex-1">
                Create New
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

