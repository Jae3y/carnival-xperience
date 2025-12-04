'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IncidentReportProps {
  className?: string;
  onSubmitted?: () => void;
}

const INCIDENT_TYPES = [
  { value: 'medical', label: 'Medical Emergency' },
  { value: 'security', label: 'Security Issue' },
  { value: 'lost_person', label: 'Lost Person' },
  { value: 'theft', label: 'Theft/Robbery' },
  { value: 'other', label: 'Other' },
];

const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low - Minor issue', color: 'text-green-600' },
  { value: 'medium', label: 'Medium - Needs attention', color: 'text-yellow-600' },
  { value: 'high', label: 'High - Urgent', color: 'text-orange-600' },
  { value: 'critical', label: 'Critical - Life threatening', color: 'text-red-600' },
];

export function IncidentReport({ className, onSubmitted }: IncidentReportProps) {
  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !severity || !description.trim()) return;

    setIsLoading(true);
    try {
      // Get location if available
      let latitude: number | undefined;
      let longitude: number | undefined;

      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch {
          // Continue without location
        }
      }

      const response = await fetch('/api/safety/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          severity,
          description,
          latitude,
          longitude,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        onSubmitted?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="font-semibold text-lg">Report Submitted</h3>
            <p className="text-muted-foreground">
              Your incident report has been received. Emergency services will respond if needed.
            </p>
            <Button onClick={() => { setIsSubmitted(false); setType(''); setSeverity(''); setDescription(''); }}>
              Submit Another Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Report an Incident
        </CardTitle>
        <CardDescription>
          Report safety concerns or emergencies to carnival security
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Incident Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity..." />
              </SelectTrigger>
              <SelectContent>
                {SEVERITY_LEVELS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <span className={s.color}>{s.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the incident..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !type || !severity || !description.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Submit Report
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

