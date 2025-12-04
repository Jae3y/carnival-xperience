'use client';

import { useState } from 'react';
import { AlertTriangle, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface EmergencyButtonProps {
  className?: string;
  onEmergencyTriggered?: () => void;
}

const EMERGENCY_NUMBERS: Array<{ name: string; number: string; isInApp?: boolean }> = [
  { name: 'Nigeria Emergency (Police/Fire/Ambulance)', number: '112' },
  { name: 'In-App Security Alert', number: 'Tap below', isInApp: true },
];

export function EmergencyButton({ className, onEmergencyTriggered }: EmergencyButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmergency = async () => {
    setIsLoading(true);
    try {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Submit emergency alert with location
            await fetch('/api/safety/emergency', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: new Date().toISOString(),
              }),
            });
            onEmergencyTriggered?.();
          },
          () => {
            // Submit without location
            fetch('/api/safety/emergency', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ timestamp: new Date().toISOString() }),
            });
            onEmergencyTriggered?.();
          }
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="lg"
        className={cn('h-20 w-full text-lg font-bold shadow-lg', className)}
        onClick={() => setIsOpen(true)}
      >
        <AlertTriangle className="h-8 w-8 mr-3" />
        EMERGENCY
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Emergency Assistance
            </AlertDialogTitle>
            <AlertDialogDescription>
              Select an emergency service to contact or trigger an alert to carnival security.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="grid gap-2 py-4">
            {EMERGENCY_NUMBERS.map((service) => (
              service.isInApp ? (
                <div
                  key={service.name}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                >
                  <span className="font-medium">{service.name}</span>
                  <span className="text-sm text-muted-foreground">{service.number}</span>
                </div>
              ) : (
                <a
                  key={service.name}
                  href={`tel:${service.number}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <span className="font-medium">{service.name}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{service.number}</span>
                  </div>
                </a>
              )
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmergency}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-2" />
              )}
              Alert Carnival Security
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

