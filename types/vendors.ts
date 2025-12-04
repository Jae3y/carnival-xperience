export type VendorCategory =
  | 'food'
  | 'drinks'
  | 'crafts'
  | 'clothing'
  | 'souvenirs'
  | 'services'
  | 'entertainment'
  | 'other';

export interface OperatingHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface MenuItem {
  name: string;
  description?: string;
  price: number;
  category?: string;
  available?: boolean;
}

export interface Vendor {
  id: string;
  userId?: string;
  slug: string;
  name: string;
  description?: string;
  category: VendorCategory;
  subcategory?: string;
  locationName: string;
  locationLat: number;
  locationLng: number;
  phone?: string;
  email?: string;
  whatsapp?: string;
  website?: string;
  operatingHours?: OperatingHours;
  menuItems?: MenuItem[];
  images: string[];
  rating?: number;
  reviewCount: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
