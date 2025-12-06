import type { LiveUpdate } from '@/types/carnival';

// Sample live updates for Calabar Carnival 2025
// These would typically be created by admins during the actual carnival

export const CALABAR_LIVE_UPDATES: Omit<LiveUpdate, 'id' | 'createdAt'>[] = [
  {
    content: '🎉 Calabar Carnival 2025 is officially LIVE! The opening ceremony at Municipal Garden is underway with spectacular performances. Join us for an unforgettable month of celebration!',
    location: 'Calabar Municipal Garden',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    isPinned: true,
    eventId: 'calabar-opening-ceremony',
  },
  {
    content: '🚨 TRAFFIC UPDATE: Mary Slessor Avenue is now closed for the parade. Please use alternative routes via Murtala Mohammed Highway. Road will reopen at 10 PM.',
    location: 'Mary Slessor Avenue',
    imageUrl: undefined,
    isPinned: true,
    eventId: undefined,
  },
  {
    content: '🎭 The Seagulls Band just took the stage with their Ocean Majesty theme! The crowd is going wild. Their blue wave costumes are absolutely stunning under the lights.',
    location: 'U.J. Esuene Stadium',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80',
    isPinned: false,
    eventId: 'international-carnival-parade',
  },
  {
    content: '🏆 VOTING REMINDER: Don\'t forget to vote for your favorite carnival band! Voting closes at midnight. Head to the Bands page to cast your vote.',
    location: undefined,
    imageUrl: undefined,
    isPinned: false,
    eventId: undefined,
  },
  {
    content: '🎪 The Children\'s Carnival Parade is starting in 30 minutes! Kids from over 50 schools are ready to showcase their amazing costumes and choreography.',
    location: 'Mary Slessor Avenue',
    imageUrl: 'https://images.unsplash.com/photo-1622831877966-18a6c8731a01?w=800&q=80',
    isPinned: false,
    eventId: 'childrens-carnival-parade',
  },
  {
    content: '🔥 Masta Blasta Band is bringing the heat! Their Electric Dreams performance features incredible LED costumes and pyrotechnics. This is what carnival is all about!',
    location: 'Millennium Park',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    isPinned: false,
    eventId: 'international-carnival-parade',
  },
  {
    content: '🍔 Food vendors are now open at all major carnival zones! Try local delicacies like Edikang Ikong, Afang soup, and fresh grilled fish. Don\'t miss the street food experience!',
    location: 'Multiple Locations',
    imageUrl: undefined,
    isPinned: false,
    eventId: undefined,
  },
  {
    content: '🏍️ The Bikers Carnival is absolutely INSANE! Stunt riders are performing jaw-dropping tricks on Mary Slessor Avenue. The crowd is on their feet!',
    location: 'Mary Slessor Avenue',
    imageUrl: 'https://images.unsplash.com/photo-1633380010659-e3405204ca8f?w=800&q=80',
    isPinned: false,
    eventId: 'bikers-carnival',
  },
  {
    content: '💎 Diamond Band just entered with their Royal Elegance theme. The crystal-studded costumes are catching the light beautifully. Truly a sight to behold!',
    location: 'U.J. Esuene Stadium',
    imageUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
    isPinned: false,
    eventId: 'international-carnival-parade',
  },
  {
    content: '📸 Photo opportunity alert! The Christmas Village lights are spectacular tonight. Perfect backdrop for your carnival memories. Tag us with #CalabarCarnival2025',
    location: 'Christmas Village',
    imageUrl: undefined,
    isPinned: false,
    eventId: undefined,
  },
  {
    content: '🌍 The States Cultural Carnival is showcasing Nigeria\'s incredible diversity! We\'ve seen traditional dances from Lagos, Kano, Enugu, and more. Unity in diversity!',
    location: 'U.J. Esuene Stadium',
    imageUrl: 'https://images.unsplash.com/photo-1758875913518-7869eb5e1e91?w=800&q=80',
    isPinned: false,
    eventId: 'states-cultural-carnival',
  },
  {
    content: '⚠️ SAFETY REMINDER: Stay hydrated! Free water stations are available at Millennium Park, Municipal Garden, and U.J. Esuene Stadium. Take care of yourself and others.',
    location: 'Multiple Locations',
    imageUrl: undefined,
    isPinned: false,
    eventId: undefined,
  },
  {
    content: '👖 The Jean Carnival fashion show is underway! Designers are showcasing incredible denim creations that blend African heritage with contemporary style. Fashion meets culture!',
    location: 'Cultural Centre',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    isPinned: false,
    eventId: 'jean-carnival',
  },
  {
    content: '🎵 Live music at the Christmas Village continues until 2 AM! DJ sets, live bands, and special performances. The party doesn\'t stop in Calabar!',
    location: 'Christmas Village',
    imageUrl: undefined,
    isPinned: false,
    eventId: undefined,
  },
  {
    content: '🌟 Heritage Band is honoring Cross River State\'s ancient traditions with authentic Efik and Ejagham ceremonial dances. This is living history on the streets!',
    location: 'Mary Slessor Avenue',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    isPinned: false,
    eventId: 'international-carnival-parade',
  },
];
