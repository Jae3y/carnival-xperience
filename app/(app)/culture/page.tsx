import { createClient } from '@/lib/supabase/server';
import { CulturalSection } from '@/components/culture/cultural-section';
import { CulturalTimeline } from '@/components/culture/cultural-timeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CulturalContent } from '@/types/carnival';
import { BookOpen, Clock, Music, Palette, Users, MapPin, History } from 'lucide-react';

export const metadata = {
  title: 'Cultural Heritage | CarnivalXperience',
  description: 'Discover the rich cultural heritage and traditions of Calabar Carnival and Cross River State',
};

export default async function CulturePage() {
  const supabase = await createClient();
  
  // Fetch cultural content from database
  const { data: culturalContent, error } = await supabase
    .from('cultural_content')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching cultural content:', error);
  }

  const content = (culturalContent || []) as CulturalContent[];

  // Categorize content
  const historyContent = content.filter(c => c.category === 'history');
  const dancesContent = content.filter(c => c.category === 'dances');
  const costumesContent = content.filter(c => c.category === 'costumes');
  const musicContent = content.filter(c => c.category === 'music');
  const heritageContent = content.filter(c => c.category === 'heritage');
  const timelineContent = content.filter(c => c.category === 'timeline');
  const communityContent = content.filter(c => c.category === 'community');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-red-600 to-orange-600 bg-clip-text text-transparent">
          Cultural Heritage
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Explore the rich traditions, history, and cultural significance of Calabar Carnival 
          and Cross River State - The People's Paradise
        </p>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 mb-8">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">All</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="dances" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Dances</span>
          </TabsTrigger>
          <TabsTrigger value="costumes" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="hidden sm:inline">Costumes</span>
          </TabsTrigger>
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            <span className="hidden sm:inline">Music</span>
          </TabsTrigger>
          <TabsTrigger value="heritage" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Heritage</span>
          </TabsTrigger>
          <TabsTrigger value="community" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Community</span>
          </TabsTrigger>
        </TabsList>

        {/* All Content */}
        <TabsContent value="all" className="space-y-8">
          <div className="space-y-8">
            {content.map((item) => (
              <CulturalSection key={item.id} content={item} />
            ))}
          </div>
        </TabsContent>

        {/* Timeline View */}
        <TabsContent value="timeline">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Carnival Journey</h2>
            <p className="text-muted-foreground">
              Follow the evolution of Calabar Carnival from its inception to today
            </p>
          </div>
          <CulturalTimeline items={content} />
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-8">
          {historyContent.length > 0 ? (
            historyContent.map((item) => (
              <CulturalSection key={item.id} content={item} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No history content available yet.
            </p>
          )}
        </TabsContent>

        {/* Dances */}
        <TabsContent value="dances" className="space-y-8">
          {dancesContent.length > 0 ? (
            dancesContent.map((item) => (
              <CulturalSection key={item.id} content={item} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No dance content available yet.
            </p>
          )}
        </TabsContent>

        {/* Costumes */}
        <TabsContent value="costumes" className="space-y-8">
          {costumesContent.length > 0 ? (
            costumesContent.map((item) => (
              <CulturalSection key={item.id} content={item} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No costume content available yet.
            </p>
          )}
        </TabsContent>

        {/* Music */}
        <TabsContent value="music" className="space-y-8">
          {musicContent.length > 0 ? (
            musicContent.map((item) => (
              <CulturalSection key={item.id} content={item} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No music content available yet.
            </p>
          )}
        </TabsContent>

        {/* Heritage */}
        <TabsContent value="heritage" className="space-y-8">
          {heritageContent.length > 0 ? (
            heritageContent.map((item) => (
              <CulturalSection key={item.id} content={item} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No heritage content available yet.
            </p>
          )}
        </TabsContent>

        {/* Community */}
        <TabsContent value="community" className="space-y-8">
          {communityContent.length > 0 ? (
            communityContent.map((item) => (
              <CulturalSection key={item.id} content={item} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">
              No community content available yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
