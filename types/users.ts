export interface EmergencyContact {
  id?: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary?: boolean;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  eventReminders: boolean;
  safetyAlerts: boolean;
  communityUpdates: boolean;
}

export interface UserPreferences {
  favoriteCategories: string[];
  budgetRange?: {
    min: number;
    max: number;
  };
  accessibilityNeeds: string[];
}

export interface GamificationStats {
  badges: string[];
  points: number;
  level: number;
}

export interface UserProfile {
  id: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  languagePreference: string;
  notificationPreferences: NotificationPreferences;
  locationSharingEnabled: boolean;
  emergencyContacts: EmergencyContact[];
  preferences: UserPreferences;
  gamificationStats: GamificationStats;
  isVerified: boolean;
  isVendor: boolean;
  isOrganizer: boolean;
  createdAt: Date;
  updatedAt: Date;
}
