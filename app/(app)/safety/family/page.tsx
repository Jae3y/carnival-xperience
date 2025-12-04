'use client';

import { useState } from 'react';
import { Users, MapPin, AlertTriangle, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FamilyFinder } from '@/components/safety/family-finder';
import Link from 'next/link';

interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  status: 'safe' | 'missing';
}

interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  meetingPoint: {
    lat: number;
    lng: number;
    name: string;
  };
}

// Mock data for demonstration
const MOCK_FAMILY_GROUP: FamilyGroup = {
  id: '1',
  name: 'My Family',
  members: [
    { id: '1', name: 'John Doe', phone: '+234-XXX-XXX-1234', status: 'safe' },
    { id: '2', name: 'Jane Doe', phone: '+234-XXX-XXX-5678', status: 'safe' },
    { id: '3', name: 'Junior Doe', phone: '+234-XXX-XXX-9012', status: 'safe' },
  ],
  meetingPoint: {
    lat: 4.9517,
    lng: 8.322,
    name: 'Calabar Cultural Centre',
  },
};

const MEETING_POINTS = [
  { id: '1', name: 'Calabar Cultural Centre', lat: 4.9517, lng: 8.322 },
  { id: '2', name: 'Main Stage Area', lat: 4.9530, lng: 8.3200 },
  { id: '3', name: 'Medical Tent #1', lat: 4.9500, lng: 8.3250 },
  { id: '4', name: 'Police Post', lat: 4.9480, lng: 8.3180 },
];

export default function FamilyReunificationPage() {
  const [group, setGroup] = useState(MOCK_FAMILY_GROUP);
  const [selectedMeetingPoint, setSelectedMeetingPoint] = useState(MOCK_FAMILY_GROUP.meetingPoint);

  const handleMarkMissing = (memberId: string) => {
    setGroup((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? { ...m, status: 'missing' as const } : m
      ),
    }));
  };

  const handleMarkSafe = (memberId: string) => {
    setGroup((prev) => ({
      ...prev,
      members: prev.members.map((m) =>
        m.id === memberId ? { ...m, status: 'safe' as const } : m
      ),
    }));
  };

  const handleAddMember = async (member: { name: string; phone: string }) => {
    setGroup((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: Date.now().toString(),
          ...member,
          status: 'safe' as const,
        },
      ],
    }));
  };

  const missingCount = group.members.filter((m) => m.status === 'missing').length;

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Family Reunification</h1>
          <p className="text-muted-foreground">Keep track of your loved ones</p>
        </div>
      </div>

      {/* Alert Banner */}
      {missingCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <p className="font-semibold text-red-800">
                  {missingCount} family member{missingCount > 1 ? 's' : ''} marked as missing
                </p>
                <p className="text-sm text-red-600">
                  Head to the meeting point or contact carnival security
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Family Group */}
      <FamilyFinder
        group={group}
        onMarkMissing={handleMarkMissing}
        onMarkSafe={handleMarkSafe}
        onAddMember={handleAddMember}
      />

      {/* Meeting Point */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Meeting Point
          </CardTitle>
          <CardDescription>
            Designated location to reunite if separated
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-semibold">{selectedMeetingPoint.name}</p>
            <p className="text-sm text-muted-foreground">
              Lat: {selectedMeetingPoint.lat.toFixed(4)}, Lng: {selectedMeetingPoint.lng.toFixed(4)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {MEETING_POINTS.map((point) => (
              <Button
                key={point.id}
                variant={selectedMeetingPoint.name === point.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMeetingPoint(point)}
                className="justify-start"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {point.name}
              </Button>
            ))}
          </div>

          <Link href={`/map?dest=${selectedMeetingPoint.lat},${selectedMeetingPoint.lng}`}>
            <Button className="w-full">
              <Navigation className="h-4 w-4 mr-2" />
              Get Directions to Meeting Point
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Back to Safety */}
      <Link href="/safety">
        <Button variant="outline" className="w-full">
          Back to Safety Center
        </Button>
      </Link>
    </div>
  );
}

