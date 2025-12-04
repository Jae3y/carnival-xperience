'use client';

import { useState } from 'react';
import { Users, Plus, AlertTriangle, CheckCircle, MapPin, Phone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  status: 'safe' | 'missing' | 'found';
  lastLocation?: { lat: number; lng: number };
  lastSeen?: Date;
}

interface FamilyGroup {
  id: string;
  name: string;
  members: FamilyMember[];
  meetingPoint?: { lat: number; lng: number; name: string };
}

interface FamilyFinderProps {
  group?: FamilyGroup;
  onMarkMissing?: (memberId: string) => void;
  onMarkSafe?: (memberId: string) => void;
  onAddMember?: (member: { name: string; phone: string }) => void;
  className?: string;
}

export function FamilyFinder({
  group,
  onMarkMissing,
  onMarkSafe,
  onAddMember,
  className,
}: FamilyFinderProps) {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMember = async () => {
    if (!newMemberName.trim() || !newMemberPhone.trim()) return;
    setIsLoading(true);
    try {
      await onAddMember?.({ name: newMemberName, phone: newMemberPhone });
      setNewMemberName('');
      setNewMemberPhone('');
      setIsAddingMember(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: FamilyMember['status']) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'missing': return 'bg-red-100 text-red-800';
      case 'found': return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusIcon = (status: FamilyMember['status']) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4" />;
      case 'missing': return <AlertTriangle className="h-4 w-4" />;
      case 'found': return <MapPin className="h-4 w-4" />;
    }
  };

  if (!group) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Family Group</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a family group to track your loved ones during the carnival
          </p>
          <Button>Create Family Group</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {group.name}
            </CardTitle>
            <CardDescription>{group.members.length} members</CardDescription>
          </div>
          <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Family Member</DialogTitle>
                <DialogDescription>Add a new member to your family group</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="Enter name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={newMemberPhone} onChange={(e) => setNewMemberPhone(e.target.value)} placeholder="+234..." type="tel" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingMember(false)}>Cancel</Button>
                <Button onClick={handleAddMember} disabled={isLoading || !newMemberName.trim() || !newMemberPhone.trim()}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add Member
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {group.members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', getStatusColor(member.status))}>
                {getStatusIcon(member.status)}
              </div>
              <div>
                <p className="font-medium">{member.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  <span>{member.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getStatusColor(member.status)}>
                {member.status}
              </Badge>
              {member.status === 'safe' ? (
                <Button variant="destructive" size="sm" onClick={() => onMarkMissing?.(member.id)}>
                  Mark Missing
                </Button>
              ) : (
                <Button variant="default" size="sm" onClick={() => onMarkSafe?.(member.id)}>
                  Mark Safe
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

