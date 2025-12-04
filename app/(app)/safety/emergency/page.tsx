'use client';

import { AlertTriangle, Phone, MapPin, Clock, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyButton } from '@/components/safety/emergency-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const EMERGENCY_SERVICES = [
  {
    name: 'Nigeria Emergency Services',
    number: '112',
    description: 'Police, Fire, Ambulance',
    icon: Phone,
    color: 'text-red-600',
  },
  {
    name: 'Carnival Security',
    number: 'In-App Alert',
    description: 'Use emergency button above',
    icon: Shield,
    color: 'text-orange-600',
  },
  {
    name: 'Medical Assistance',
    number: 'In-App Request',
    description: 'Request medical help',
    icon: AlertTriangle,
    color: 'text-blue-600',
  },
];

const MEDICAL_TENTS = [
  { name: 'Medical Tent #1', location: 'Near Main Stage', lat: 4.9530, lng: 8.3200 },
  { name: 'Medical Tent #2', location: 'Cultural Centre', lat: 4.9517, lng: 8.322 },
  { name: 'Medical Tent #3', location: 'Food Court Area', lat: 4.9500, lng: 8.3250 },
];

export default function EmergencyPage() {
  const shouldReduceMotion = useReducedMotion();

  const sectionTransition = {
    duration: 0.3,
    ease: 'easeOut',
  };

  return (
    <motion.div
      className="container space-y-6 py-6"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={sectionTransition}
    >
      {/* Header */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.05 }}
      >
        <motion.div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500"
          animate={
            shouldReduceMotion
              ? { opacity: 1 }
              : { opacity: [0.9, 1, 0.9], scale: [1, 1.05, 1] }
          }
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <AlertTriangle className="h-6 w-6 text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Emergency Services</h1>
          <p className="text-muted-foreground">
            Quick access to emergency assistance
          </p>
        </div>
      </motion.div>

      {/* Emergency Button */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.1 }}
      >
        <EmergencyButton />
      </motion.div>

      {/* Emergency Services */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
            <CardDescription>Available 24/7 during the carnival</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {EMERGENCY_SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-lg border bg-background/60 p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <div className={`${service.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <Phone className="h-4 w-4" />
                    <span className="font-medium">{service.number}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Medical Tents */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Medical Tent Locations
            </CardTitle>
            <CardDescription>Find the nearest medical assistance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MEDICAL_TENTS.map((tent) => (
              <div
                key={tent.name}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{tent.name}</p>
                  <p className="text-sm text-muted-foreground">{tent.location}</p>
                </div>
                <Link href={`/map?dest=${tent.lat},${tent.lng}`}>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Directions
                  </Button>
                </Link>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Tips */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.25 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              What to Do in an Emergency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </span>
                <div>
                  <p className="font-medium">Stay Calm</p>
                  <p className="text-sm text-muted-foreground">
                    Take a deep breath and assess the situation
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </span>
                <div>
                  <p className="font-medium">Call for Help</p>
                  <p className="text-sm text-muted-foreground">
                    Use the emergency button or call 112
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  3
                </span>
                <div>
                  <p className="font-medium">Share Your Location</p>
                  <p className="text-sm text-muted-foreground">
                    Enable location services for faster response
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  4
                </span>
                <div>
                  <p className="font-medium">Follow Instructions</p>
                  <p className="text-sm text-muted-foreground">
                    Listen to emergency responders and security staff
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>
      </motion.div>

      {/* Back Button */}
      <Link href="/safety">
        <Button variant="outline" className="w-full">
          Back to Safety Center
        </Button>
      </Link>
    </motion.div>
  );
}
