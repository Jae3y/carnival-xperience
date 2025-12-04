'use client';

import { useState } from 'react';
import { Search, Package, Camera, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LostFoundFormProps {
  className?: string;
  onSubmitted?: () => void;
}

const CATEGORIES = [
  { value: 'phone', label: 'Phone/Electronics' },
  { value: 'wallet', label: 'Wallet/Purse' },
  { value: 'bag', label: 'Bag/Backpack' },
  { value: 'jewelry', label: 'Jewelry/Watch' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'documents', label: 'Documents/ID' },
  { value: 'keys', label: 'Keys' },
  { value: 'other', label: 'Other' },
];

export function LostFoundForm({ className, onSubmitted }: LostFoundFormProps) {
  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description.trim() || !contactPhone.trim()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('contactPhone', contactPhone);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      // Get location if available
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          formData.append('latitude', position.coords.latitude.toString());
          formData.append('longitude', position.coords.longitude.toString());
        } catch {
          // Continue without location
        }
      }

      const response = await fetch('/api/safety/lost-found', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        onSubmitted?.();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCategory('');
    setDescription('');
    setContactPhone('');
    setImageFile(null);
  };

  if (isSubmitted) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
            <h3 className="font-semibold text-lg">Report Submitted</h3>
            <p className="text-muted-foreground">
              {type === 'lost'
                ? "We'll notify you if a matching item is found."
                : "We'll check for matching lost item reports."}
            </p>
            <Button onClick={resetForm}>Submit Another Report</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Report Lost or Found Item</CardTitle>
        <CardDescription>Help reunite items with their owners</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={type} onValueChange={(v) => setType(v as 'lost' | 'found')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lost">
              <Search className="h-4 w-4 mr-2" />
              I Lost Something
            </TabsTrigger>
            <TabsTrigger value="found">
              <Package className="h-4 w-4 mr-2" />
              I Found Something
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={type === 'lost' ? 'Describe what you lost...' : 'Describe what you found...'}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Photo (optional)</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="flex-1" />
                <Button type="button" variant="outline" size="icon">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Upload a photo to help with AI matching</p>
            </div>

            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+234..." type="tel" />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !category || !description.trim() || !contactPhone.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Report
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}

