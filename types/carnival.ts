// Carnival Enhancement Types
// Requirements: 1.1, 2.1, 3.1, 4.1

export interface Band {
  id: string;
  name: string;
  description?: string;
  theme?: string;
  imageUrl?: string;
  voteCount: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BandVote {
  id: string;
  bandId: string;
  userId: string;
  year: number;
  createdAt: Date;
}

export interface CulturalContent {
  id: string;
  title: string;
  content: string;
  category?: string;
  imageUrl?: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiveUpdate {
  id: string;
  content: string;
  eventId?: string;
  location?: string;
  imageUrl?: string;
  isPinned: boolean;
  createdAt: Date;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
  eventId?: string;
  photographer?: string;
  location?: string;
  takenAt?: Date;
  createdAt: Date;
  likesCount: number;
}
