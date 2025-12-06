import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getEventBySlug } from '@/lib/supabase/queries';
import { isEventLive } from '@/lib/events';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LiveBadge } from '@/components/events/live-badge';
import { CountdownTimer } from '@/components/events/countdown-timer';
import { ShareButtons } from '@/components/carnival/share-buttons';
import { Calendar, MapPin, Users, Ticket, Share2, Heart, ArrowLeft, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const isLive = isEventLive(event);
  const eventDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/events">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
      </Link>

      {/* Hero Image */}
      <div className="relative aspect-video rounded-xl overflow-hidden">
        {event.featuredImage ? (
          <Image src={event.featuredImage} alt={event.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <span className="text-8xl">🎭</span>
          </div>
        )}
        {isLive && (
          <div className="absolute top-4 left-4">
            <LiveBadge size="lg" />
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary capitalize">
                {event.category}
              </span>
              {event.isFeatured && (
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold">{event.name}</h1>
            {event.tagline && <p className="text-lg text-muted-foreground mt-2">{event.tagline}</p>}
          </div>

          <div className="prose prose-gray max-w-none">
            <p>{event.description}</p>
            {event.longDescription && <div dangerouslySetInnerHTML={{ __html: event.longDescription }} />}
          </div>

          {/* Tags */}
          {event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span key={tag} className="text-sm px-3 py-1 rounded-full bg-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Share Buttons */}
          <Card>
            <CardContent className="pt-6">
              <ShareButtons
                url={`/events/${slug}`}
                title={event.name}
                description={event.description}
                image={event.featuredImage || undefined}
                hashtags={['CalabarCarnival', 'CalabarCarnival2025', ...event.tags]}
              />
            </CardContent>
          </Card>

          {/* Cultural Context */}
          {(event.culturalSignificance || event.historicalContext) && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold">Cultural Significance</h3>
                {event.culturalSignificance && (
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">About This Event</h4>
                    <p className="text-sm leading-relaxed">{event.culturalSignificance}</p>
                  </div>
                )}
                {event.historicalContext && (
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">Historical Context</h4>
                    <p className="text-sm leading-relaxed">{event.historicalContext}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Participating Bands */}
          {event.participatingBands && event.participatingBands.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Participating Bands</h3>
                <div className="flex flex-wrap gap-2">
                  {event.participatingBands.map((band) => (
                    <Link key={band} href="/bands">
                      <span className="text-sm px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer">
                        {band}
                      </span>
                    </Link>
                  ))}
                </div>
                <Link href="/bands">
                  <Button variant="outline" size="sm" className="mt-4">
                    Vote for Your Favorite Band
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Accessibility & Amenities */}
          {(event.accessibilityFeatures.length > 0 || event.amenities.length > 0) && (
            <Card>
              <CardContent className="pt-6">
                {event.accessibilityFeatures.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Accessibility</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.accessibilityFeatures.map((feature) => (
                        <span key={feature} className="text-sm px-2 py-1 rounded bg-green-100 text-green-700">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {event.amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {event.amenities.map((amenity) => (
                        <span key={amenity} className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-700">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              {!isLive && <CountdownTimer event={event} />}

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{eventDate.toLocaleDateString('en-NG', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-sm text-muted-foreground">{eventDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">{event.venueName}</p>
                    {event.address && <p className="text-sm text-muted-foreground">{event.address}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{event.attendanceCount} attending</span>
                </div>

                {event.ticketRequired && (
                  <div className="flex items-center gap-3">
                    <Ticket className="h-5 w-5 text-muted-foreground" />
                    <span>{event.isFree ? 'Free Entry' : `₦${event.ticketPrice?.toLocaleString()}`}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1"><Heart className="h-4 w-4 mr-2" />Save</Button>
                <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
              </div>

              {event.liveStreamUrl && isLive && (
                <Button className="w-full" variant="destructive" asChild>
                  <a href={event.liveStreamUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />Watch Live Stream
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

