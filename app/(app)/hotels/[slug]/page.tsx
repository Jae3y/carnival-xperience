import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getHotelBySlug } from '@/lib/supabase/queries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Mail, Globe, ArrowLeft, Wifi, Car, Coffee, Dumbbell, Waves, Utensils, Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface HotelDetailPageProps {
  params: Promise<{ slug: string }>;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5" />,
  parking: <Car className="h-5 w-5" />,
  breakfast: <Coffee className="h-5 w-5" />,
  gym: <Dumbbell className="h-5 w-5" />,
  pool: <Waves className="h-5 w-5" />,
  restaurant: <Utensils className="h-5 w-5" />,
};

export default async function HotelDetailPage({ params }: HotelDetailPageProps) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Link href="/hotels">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hotels
        </Button>
      </Link>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          {hotel.images[0] ? (
            <Image src={hotel.images[0]} alt={hotel.name} fill className="object-cover" priority />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-8xl">🏨</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {hotel.images.slice(1, 5).map((img, i) => (
            <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
              <Image src={img} alt={`${hotel.name} ${i + 2}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex">
                {Array.from({ length: hotel.starRating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {hotel.verified && <Badge className="bg-green-500">Verified</Badge>}
              {hotel.carnivalSpecialRate && <Badge className="bg-orange-500">Carnival Special</Badge>}
            </div>
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-2">
              <MapPin className="h-4 w-4" />
              <span>{hotel.address}</span>
              <span>•</span>
              <span>{hotel.distanceFromCenter.toFixed(1)} km from carnival center</span>
            </div>
            {hotel.rating && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-2xl font-bold">{hotel.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({hotel.reviewCount} reviews)</span>
              </div>
            )}
          </div>

          {/* Description */}
          {hotel.description && (
            <Card>
              <CardHeader><CardTitle>About</CardTitle></CardHeader>
              <CardContent><p>{hotel.description}</p></CardContent>
            </Card>
          )}

          {/* Amenities */}
          <Card>
            <CardHeader><CardTitle>Amenities</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    {amenityIcons[amenity.toLowerCase()] || <Check className="h-5 w-5" />}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Room Types */}
          <Card>
            <CardHeader><CardTitle>Room Types</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {hotel.roomTypes.map((room) => (
                <div key={room.type} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{room.type}</h4>
                      {room.description && <p className="text-sm text-muted-foreground">{room.description}</p>}
                      <p className="text-sm mt-1">Max {room.maxOccupancy} guests</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">₦{room.price.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                      <p className="text-sm text-green-600">{room.available} available</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Policies */}
          <Card>
            <CardHeader><CardTitle>Policies</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Check-in:</strong> {hotel.policies.checkIn || hotel.policies.checkInTime || 'N/A'}</p>
              <p><strong>Check-out:</strong> {hotel.policies.checkOut || hotel.policies.checkOutTime || 'N/A'}</p>
              <p><strong>Cancellation:</strong> {hotel.policies.cancellation || hotel.policies.cancellationPolicy || 'N/A'}</p>
              {hotel.policies.payment && <p><strong>Payment:</strong> {hotel.policies.payment.join(', ')}</p>}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-3xl font-bold">₦{hotel.pricePerNightMin.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">per night</p>
              </div>
              <Button className="w-full" size="lg">Book Now</Button>
              <div className="space-y-2 text-sm">
                {hotel.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{hotel.phone}</div>}
                {hotel.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4" />{hotel.email}</div>}
                {hotel.website && <div className="flex items-center gap-2"><Globe className="h-4 w-4" /><a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit Website</a></div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

