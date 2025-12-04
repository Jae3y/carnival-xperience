"use client";

import { Shield, MapPin, AlertTriangle, Users, Phone, FileText } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyButton } from '@/components/safety/emergency-button';
import { LocationShare } from '@/components/safety/location-share';
import { IncidentReport } from '@/components/safety/incident-report';
import Link from 'next/link';

const EMERGENCY_CONTACTS = [
  { name: 'Nigeria Emergency', number: '112', description: 'Police, Fire, Ambulance' },
  { name: 'CarnivalXperience Help Desk', number: 'In-App', description: 'Use the AI Concierge for assistance' },
  { name: 'Medical Assistance', number: 'In-App', description: 'Request help via Emergency Button above' },
];

const SAFETY_TIPS = [
  'Stay hydrated and take breaks from the sun',
  'Keep valuables secure and out of sight',
  'Establish meeting points with your group',
  'Save emergency contacts in your phone',
  'Know the location of medical tents',
  'Report suspicious activity immediately',
];

	export default function SafetyPage() {
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
	          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400"
	          animate={
	            shouldReduceMotion
	              ? { opacity: 1 }
	              : { opacity: [0.9, 1, 0.9], scale: [1, 1.05, 1] }
	          }
	          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
	        >
	          <Shield className="h-6 w-6 text-white" />
	        </motion.div>
	        <div>
	          <h1 className="text-2xl font-bold tracking-tight">Safety Center</h1>
	          <p className="text-muted-foreground">
	            Stay safe and feel secure throughout the carnival.
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

	      {/* Quick Actions */}
	      <motion.div
	        className="grid grid-cols-2 gap-4 md:grid-cols-4"
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.15 }}
	      >
	        <Link href="/safety/emergency">
	          <Card className="h-full cursor-pointer">
	            <CardContent className="pt-6 text-center">
	              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
	              <p className="font-medium">Emergency</p>
	            </CardContent>
	          </Card>
	        </Link>
	        <Link href="/safety/reports">
	          <Card className="h-full cursor-pointer">
	            <CardContent className="pt-6 text-center">
	              <FileText className="mx-auto mb-2 h-8 w-8 text-orange-500" />
	              <p className="font-medium">Report</p>
	            </CardContent>
	          </Card>
	        </Link>
	        <Link href="/safety/family">
	          <Card className="h-full cursor-pointer">
	            <CardContent className="pt-6 text-center">
	              <Users className="mx-auto mb-2 h-8 w-8 text-blue-500" />
	              <p className="font-medium">Family</p>
	            </CardContent>
	          </Card>
	        </Link>
	        <Link href="/map">
	          <Card className="h-full cursor-pointer">
	            <CardContent className="pt-6 text-center">
	              <MapPin className="mx-auto mb-2 h-8 w-8 text-green-500" />
	              <p className="font-medium">Safe Zones</p>
	            </CardContent>
	          </Card>
	        </Link>
	      </motion.div>

	      {/* Location Sharing */}
	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.2 }}
	      >
	        <LocationShare />
	      </motion.div>

	      {/* Emergency Contacts */}
	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.25 }}
	      >
	        <Card>
	          <CardHeader>
	            <CardTitle className="flex items-center gap-2">
	              <Phone className="h-5 w-5" />
	              Emergency Contacts
	            </CardTitle>
	            <CardDescription>Important numbers to save</CardDescription>
	          </CardHeader>
	          <CardContent className="space-y-3">
	            {EMERGENCY_CONTACTS.map((contact) => (
	              <a
	                key={contact.name}
	                href={`tel:${contact.number}`}
	                className="flex items-center justify-between rounded-lg border bg-background/60 p-3 transition-colors hover:bg-muted"
	              >
	                <div>
	                  <p className="font-medium">{contact.name}</p>
	                  <p className="text-sm text-muted-foreground">
	                    {contact.description}
	                  </p>
	                </div>
	                <div className="flex items-center gap-2 text-primary">
	                  <Phone className="h-4 w-4" />
	                  <span className="font-medium">{contact.number}</span>
	                </div>
	              </a>
	            ))}
	          </CardContent>
	        </Card>
	      </motion.div>

	      {/* Safety Tips */}
	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.3 }}
	      >
	        <Card>
	          <CardHeader>
	            <CardTitle>Safety Tips</CardTitle>
	            <CardDescription>
	              Stay safe and enjoy the carnival
	            </CardDescription>
	          </CardHeader>
	          <CardContent>
	            <ul className="space-y-2">
	              {SAFETY_TIPS.map((tip, index) => (
	                <li key={index} className="flex items-start gap-2">
	                  <span className="font-bold text-primary">•</span>
	                  <span>{tip}</span>
	                </li>
	              ))}
	            </ul>
	          </CardContent>
	        </Card>
	      </motion.div>

	      {/* Incident Report */}
	      <motion.div
	        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
	        animate={{ opacity: 1, y: 0 }}
	        transition={{ ...sectionTransition, delay: 0.35 }}
	      >
	        <IncidentReport />
	      </motion.div>
	    </motion.div>
	  );
}

