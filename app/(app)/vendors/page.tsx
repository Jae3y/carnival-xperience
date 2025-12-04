import { MapPin, Phone, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CALABAR_CARNIVAL_VENDORS } from '@/lib/sample-data/calabar-vendors';

export default function VendorsPage() {
  const vendors = CALABAR_CARNIVAL_VENDORS;

  const categoryColors: Record<string, string> = {
    food: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    drinks: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    crafts: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    clothing: 'bg-pink-500/10 text-pink-700 dark:text-pink-400',
    souvenirs: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
    services: 'bg-green-500/10 text-green-700 dark:text-green-400',
    entertainment: 'bg-red-500/10 text-red-700 dark:text-red-400',
    other: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
      <div>
        <h1 className="bg-gradient-to-r from-cx-gold via-cx-flame to-cx-pink bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          Vendor Directory
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find food, drinks, crafts, services and entertainment around carnival venues
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg">{vendor.name}</CardTitle>
                  <CardDescription className="mt-1">{vendor.locationName}</CardDescription>
                </div>
                {vendor.isVerified && (
                  <Badge variant="secondary" className="shrink-0">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge className={categoryColors[vendor.category] || categoryColors.other}>
                  {vendor.category}
                </Badge>
                {vendor.subcategory && (
                  <span className="text-xs text-muted-foreground">{vendor.subcategory}</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{vendor.description}</p>

              {vendor.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{vendor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({vendor.reviewCount} reviews)
                  </span>
                </div>
              )}

              <div className="space-y-2 text-sm">
                {vendor.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.locationName}</span>
                </div>
                {vendor.operatingHours?.monday && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {vendor.operatingHours.monday.open} - {vendor.operatingHours.monday.close}
                    </span>
                  </div>
                )}
              </div>

              {vendor.menuItems && vendor.menuItems.length > 0 && (
                <div className="border-t pt-3">
                  <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    Popular Items
                  </p>
                  <div className="space-y-1">
                    {vendor.menuItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-semibold">₦{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {vendor.whatsapp && (
                <a
                  href={`https://wa.me/${vendor.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Contact on WhatsApp
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
