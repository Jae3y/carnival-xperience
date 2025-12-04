'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import { Loader2, ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import Link from 'next/link';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30).optional(),
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  bio: z.string().max(500).optional(),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface EmergencyContactData {
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactData[]>([]);
  const [newContact, setNewContact] = useState<Partial<EmergencyContactData>>({});
  const [showAddContact, setShowAddContact] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/profile/${user.id}`);
        if (response.ok) {
          const profile = await response.json();
          reset({ username: profile.username, fullName: profile.fullName, bio: profile.bio, phone: profile.phone });
          setEmergencyContacts(profile.emergencyContacts || []);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, emergencyContacts }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to update profile');
      }

      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) return;
    const contact: EmergencyContactData = {
      name: newContact.name,
      phone: newContact.phone,
      relationship: newContact.relationship,
      isPrimary: emergencyContacts.length === 0,
    };
    setEmergencyContacts([...emergencyContacts, contact]);
    setNewContact({});
    setShowAddContact(false);
  };

  const removeContact = (index: number) => {
    setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  if (authLoading || isLoading) {
    return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/profile"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
      </div>

      {error && <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">{error}</div>}
      {success && <div className="p-3 text-sm text-green-600 bg-green-50 rounded-md">{success}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Personal Information</CardTitle><CardDescription>Update your profile details</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="username" {...register('username')} />
                {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="+234..." {...register('phone')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea id="bio" className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Tell us about yourself..." {...register('bio')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div><CardTitle>Emergency Contacts</CardTitle><CardDescription>People to contact in emergencies</CardDescription></div>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAddContact(true)}><Plus className="h-4 w-4 mr-1" />Add</Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{contact.name} {contact.isPrimary && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded ml-2">Primary</span>}</p>
                  <p className="text-sm text-muted-foreground">{contact.relationship} • {contact.phone}</p>
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => removeContact(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            {showAddContact && (
              <div className="p-4 border rounded-lg space-y-3">
                <Input placeholder="Name" value={newContact.name || ''} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} />
                <Input placeholder="Phone" value={newContact.phone || ''} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} />
                <Input placeholder="Relationship" value={newContact.relationship || ''} onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })} />
                <div className="flex gap-2">
                  <Button type="button" onClick={addEmergencyContact}>Add Contact</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowAddContact(false)}>Cancel</Button>
                </div>
              </div>
            )}
            {emergencyContacts.length === 0 && !showAddContact && <p className="text-center text-muted-foreground py-4">No emergency contacts added</p>}
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save Changes</>}
        </Button>
      </form>
    </div>
  );
}

