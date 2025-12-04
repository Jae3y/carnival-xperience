import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
import { getUserProfile } from '@/lib/supabase/queries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, User, Phone, Mail, Shield, Trophy, Bell, MapPin } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getUserProfile(user.id);

	  return (
	    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6">
	      <div className="flex items-center justify-between gap-3">
	        <h1 className="bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink bg-clip-text text-3xl font-bold tracking-tight text-transparent">
	          Profile
	        </h1>
	        <Link href="/profile/settings">
	          <Button variant="outline">
	            <Settings className="mr-2 h-4 w-4" />
	            Edit Profile
	          </Button>
	        </Link>
	      </div>

	      {/* Profile Overview */}
	      <Card>
	        <CardHeader className="flex flex-row items-center gap-4">
	          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 ring-2 ring-cx-gold/60">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-primary" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl">{profile?.fullName || 'Carnival Enthusiast'}</CardTitle>
            <CardDescription>@{profile?.username || 'username'}</CardDescription>
            {profile?.bio && <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            {profile?.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{profile.phone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

	      {/* Stats */}
	      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
	              <Trophy className="mx-auto mb-2 h-8 w-8 text-cx-gold" />
              <p className="text-2xl font-bold">{profile?.gamificationStats?.points || 0}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
	              <Shield className="mx-auto mb-2 h-8 w-8 text-cx-flame" />
              <p className="text-2xl font-bold">{profile?.gamificationStats?.badges?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Badges</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
	              <Bell className="mx-auto mb-2 h-8 w-8 text-cx-pink" />
              <p className="text-2xl font-bold">{profile?.emergencyContacts?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Emergency Contacts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
	              <MapPin className="mx-auto mb-2 h-8 w-8 text-cx-gold" />
              <p className="text-2xl font-bold">{profile?.locationSharingEnabled ? 'On' : 'Off'}</p>
              <p className="text-sm text-muted-foreground">Location Sharing</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Emergency Contacts
          </CardTitle>
          <CardDescription>
            People who can be contacted in case of emergency
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.emergencyContacts && profile.emergencyContacts.length > 0 ? (
            <div className="space-y-3">
              {profile.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relationship} • {contact.phone}</p>
                  </div>
                  {contact.isPrimary && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Primary</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No emergency contacts added yet</p>
              <Link href="/profile/settings">
                <Button variant="link" className="mt-2">Add contacts</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

