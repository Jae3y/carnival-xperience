'use client';

import { CulturalContent } from '@/types/carnival';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

interface CulturalSectionProps {
  content: CulturalContent;
}

export function CulturalSection({ content }: CulturalSectionProps) {
  // Split content into paragraphs for better formatting
  const paragraphs = content.content.split('\n\n').filter(p => p.trim());

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
          {content.title}
        </CardTitle>
        {content.category && (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-full w-fit">
            {content.category.charAt(0).toUpperCase() + content.category.slice(1)}
          </span>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {content.imageUrl && (
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <Image
              src={content.imageUrl}
              alt={content.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {paragraphs.map((paragraph, index) => {
            // Check if paragraph is a list item (starts with **)
            if (paragraph.includes('**')) {
              return (
                <div key={index} className="space-y-2">
                  {paragraph.split('\n').map((line, lineIndex) => {
                    // Handle bold text with **
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={lineIndex} className="text-base leading-relaxed">
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
                      <p key={lineIndex} className="text-base leading-relaxed">
                        {line}
                      </p>
                    ) : null;
                  })}
                </div>
              );
            }

            // Regular paragraph
            return (
              <p key={index} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
