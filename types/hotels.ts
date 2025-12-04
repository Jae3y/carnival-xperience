export type PriceRange = 'budget' | 'mid-range' | 'luxury';
export type StarRating = 1 | 2 | 3 | 4 | 5;
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type BookingStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';

export interface RoomType {
  type: string;
  description?: string;
  price: number;
  available: number;
  maxOccupancy: number;
  amenities: string[];
  images: string[];
}

export interface HotelPolicies {
  checkIn?: string;
  checkOut?: string;
  checkInTime?: string;
  checkOutTime?: string;
  cancellation?: string;
  cancellationPolicy?: string;
  payment?: string[];
  additionalInfo?: string;
}

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  description?: string;
  address: string;
  locationLat: number;
  locationLng: number;
  phone: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  starRating: StarRating;
  priceRange: PriceRange;
  pricePerNightMin: number;
  pricePerNightMax: number;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  roomTypes: RoomType[];
  policies: HotelPolicies;
  images: string[];
  virtualTourUrl?: string;
  distanceFromCenter: number;
  verified: boolean;
  paystackSubaccountCode?: string;
  commissionRate: number;
  rating?: number;
  reviewCount: number;
  carnivalSpecialRate?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelBooking {
  id: string;
  bookingReference: string;
  hotelId: string;
  userId: string;
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  roomType: string;
  roomCount: number;
  guestCount: number;
  pricePerNight: number;
  totalAmount: number;
  platformFee: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentMethod?: string;
  paidAt?: Date;
  status: BookingStatus;
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingRequest {
  hotelId: string;
  checkInDate: Date;
  checkOutDate: Date;
  roomType: string;
  roomCount: number;
  guestCount: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests?: string;
}
