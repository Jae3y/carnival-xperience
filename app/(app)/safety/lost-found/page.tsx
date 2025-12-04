'use client';

import { useState, useEffect } from 'react';
import { Package, Search, MapPin, Phone, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LostFoundForm } from '@/components/safety/lost-found-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  itemName: string;
  itemDescription: string;
  category: string;
  locationName: string;
  contactPhone: string;
  status: 'active' | 'matched' | 'resolved';
  createdAt: string;
  images?: string[];
}

const CATEGORY_LABELS: Record<string, string> = {
  phone: 'Phone/Electronics',
  wallet: 'Wallet/Purse',
  bag: 'Bag/Backpack',
  jewelry: 'Jewelry/Watch',
  clothing: 'Clothing',
  documents: 'Documents/ID',
  keys: 'Keys',
  other: 'Other',
};

export default function LostFoundPage() {
  const shouldReduceMotion = useReducedMotion();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('lost');

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/safety/lost-found?type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
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
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lost & Found</h1>
          <p className="text-muted-foreground">
            Report and find lost items at the carnival
          </p>
        </div>
      </motion.div>

      {/* Submit Form */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.1 }}
      >
        <LostFoundForm onSubmitted={loadItems} />
      </motion.div>

      {/* Browse Items */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...sectionTransition, delay: 0.15 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Browse Reports</CardTitle>
            <CardDescription>
              View lost and found items reported by other attendees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'lost' | 'found')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lost">
                  <Search className="h-4 w-4 mr-2" />
                  Lost Items
                </TabsTrigger>
                <TabsTrigger value="found">
                  <Package className="h-4 w-4 mr-2" />
                  Found Items
                </TabsTrigger>
              </TabsList>

              <TabsContent value="lost" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading items...
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No lost items reported</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{item.itemName}</h3>
                              <Badge variant="outline">
                                {CATEGORY_LABELS[item.category] || item.category}
                              </Badge>
                              {item.status === 'matched' && (
                                <Badge className="bg-green-100 text-green-800">
                                  Possible Match
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.itemDescription}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.locationName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-muted-foreground">
                            Contact: {item.contactPhone}
                          </span>
                          <a href={`tel:${item.contactPhone}`}>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="found" className="mt-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading items...
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No found items reported</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border p-4 space-y-2"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{item.itemName}</h3>
                              <Badge variant="outline">
                                {CATEGORY_LABELS[item.category] || item.category}
                              </Badge>
                              {item.status === 'matched' && (
                                <Badge className="bg-green-100 text-green-800">
                                  Possible Match
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.itemDescription}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {item.locationName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-muted-foreground">
                            Contact: {item.contactPhone}
                          </span>
                          <a href={`tel:${item.contactPhone}`}>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
