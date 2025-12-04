'use client';

import { useState, useEffect } from 'react';
import { FileText, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IncidentReport } from '@/components/safety/incident-report';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface IncidentReport {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  status: 'reported' | 'acknowledged' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  locationName?: string;
}

const SEVERITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

const STATUS_ICONS = {
  reported: Clock,
  acknowledged: AlertCircle,
  'in-progress': Clock,
  resolved: CheckCircle,
  closed: XCircle,
};

export default function ReportsPage() {
  const shouldReduceMotion = useReducedMotion();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await fetch('/api/safety/incidents');
      if (response.ok) {
        const data = await response.json();
        setReports(data.incidents || []);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Incident Reports</h1>
          <p className="text-muted-foreground">
            View and submit safety incident reports
          </p>
        </div>
      </motion.div>

      {/* Submit New Report */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.1 }}
      >
        <IncidentReport onSubmitted={loadReports} />
      </motion.div>

      {/* Previous Reports */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
            <CardDescription>
              Track the status of your submitted incident reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading reports...
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No reports submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => {
                  const StatusIcon = STATUS_ICONS[report.status];
                  return (
                    <div
                      key={report.id}
                      className="rounded-lg border p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className={SEVERITY_COLORS[report.severity]}>
                              {report.severity}
                            </Badge>
                            <Badge variant="outline">
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {report.status}
                            </Badge>
                          </div>
                          <p className="font-medium capitalize">{report.type.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                          {report.locationName && (
                            <p className="text-xs text-muted-foreground">
                              📍 {report.locationName}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
