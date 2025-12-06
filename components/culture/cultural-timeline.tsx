'use client';

import { CulturalContent } from '@/types/carnival';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

interface CulturalTimelineProps {
  items: CulturalContent[];
}

export function CulturalTimeline({ items }: CulturalTimelineProps) {
  // Sort items by orderIndex to ensure proper timeline order
  const sortedItems = [...items].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-red-500 to-orange-600 hidden md:block" />

      <div className="space-y-8">
        {sortedItems.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Timeline dot */}
            <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-orange-500 border-4 border-background hidden md:block z-10" />

            {/* Content card */}
            <div className="md:ml-20">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center md:hidden">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                          {item.title}
                        </h3>
                        {item.category && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                            {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                          </span>
                        )}
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {item.content.split('\n\n').slice(0, 2).map((paragraph, pIndex) => {
                          // Handle paragraphs with bold text
                          if (paragraph.includes('**')) {
                            return (
                              <div key={pIndex} className="space-y-1">
                                {paragraph.split('\n').map((line, lineIndex) => {
                                  if (line.includes('**')) {
                                    const parts = line.split('**');
                                    return (
                                      <p key={lineIndex} className="text-sm leading-relaxed">
                                        {parts.map((part, partIndex) => 
                                          partIndex % 2 === 1 ? (
                                            <strong key={partIndex} className="font-bold text-orange-600 dark:text-orange-400">
                                              {part}
                                            </strong>
                                          ) : (
                                            <span key={partIndex}>{part}</span>
                                          )
                                        )}
                                      </p>
                                    );
                                  }
                                  return line.trim() ? (
                                    <p key={lineIndex} className="text-sm leading-relaxed">
                                      {line}
                                    </p>
                                  ) : null;
                                })}
                              </div>
                            );
                          }

                          return (
                            <p key={pIndex} className="text-sm leading-relaxed text-muted-foreground">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
