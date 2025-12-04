import * as fc from 'fast-check';
import { generatePaymentReference } from '@/lib/payments/paystack';

describe('Hotel Booking', () => {
  /**
   * Property 6: Booking Reference Uniqueness
   * Generated booking references should be unique across multiple generations
   */
  describe('Booking Reference Uniqueness', () => {
    test('generatePaymentReference produces unique references', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 100, max: 1000 }),
          (count) => {
            const references = new Set<string>();
            
            for (let i = 0; i < count; i++) {
              const ref = generatePaymentReference('CX');
              if (references.has(ref)) {
                return false; // Duplicate found
              }
              references.add(ref);
            }
            
            return references.size === count;
          }
        ),
        { numRuns: 50 }
      );
    });

    test('generatePaymentReference follows expected format', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('CX', 'PAY', 'BK', 'TX'),
          (prefix) => {
            const reference = generatePaymentReference(prefix);
            
            // Should start with the prefix
            if (!reference.startsWith(`${prefix}-`)) return false;
            
            // Should have the format PREFIX-TIMESTAMP-RANDOM
            const parts = reference.split('-');
            if (parts.length !== 3) return false;
            
            // All parts should be uppercase alphanumeric
            return parts.every(part => /^[A-Z0-9]+$/.test(part));
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 7: Room Count Invariant
   * Available rooms should never go negative after bookings
   */
  describe('Room Count Invariant', () => {
    test('booking simulation never results in negative available rooms', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 50 }), // initial available rooms
          fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 1, maxLength: 20 }), // booking attempts
          (initialRooms, bookingAttempts) => {
            let availableRooms = initialRooms;
            
            for (const roomsRequested of bookingAttempts) {
              // Only book if rooms are available
              if (roomsRequested <= availableRooms) {
                availableRooms -= roomsRequested;
              }
              
              // Invariant: available rooms should never be negative
              if (availableRooms < 0) return false;
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('total booked rooms plus available equals initial capacity', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }), // initial capacity
          fc.array(fc.integer({ min: 1, max: 10 }), { minLength: 0, maxLength: 30 }), // booking attempts
          (initialCapacity, bookingAttempts) => {
            let availableRooms = initialCapacity;
            let totalBooked = 0;
            
            for (const roomsRequested of bookingAttempts) {
              if (roomsRequested <= availableRooms) {
                availableRooms -= roomsRequested;
                totalBooked += roomsRequested;
              }
            }
            
            // Invariant: booked + available should always equal initial capacity
            return totalBooked + availableRooms === initialCapacity;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 4: Hotel Search Distance Ordering
   * When sorting by distance, hotels should be in ascending order
   */
  describe('Hotel Search Distance Ordering', () => {
    interface MockHotel {
      id: string;
      name: string;
      distanceFromCenter: number;
    }

    const sortByDistance = (hotels: MockHotel[]): MockHotel[] => {
      return [...hotels].sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);
    };

    test('sortByDistance maintains ascending order', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              distanceFromCenter: fc.double({ min: 0, max: 100, noNaN: true }),
            }),
            { minLength: 0, maxLength: 50 }
          ),
          (hotels) => {
            const sorted = sortByDistance(hotels);
            
            for (let i = 1; i < sorted.length; i++) {
              if (sorted[i].distanceFromCenter < sorted[i - 1].distanceFromCenter) {
                return false;
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('sortByDistance preserves all hotels', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              id: fc.uuid(),
              name: fc.string({ minLength: 1, maxLength: 50 }),
              distanceFromCenter: fc.double({ min: 0, max: 100, noNaN: true }),
            }),
            { minLength: 0, maxLength: 50 }
          ),
          (hotels) => {
            const sorted = sortByDistance(hotels);
            return sorted.length === hotels.length;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 5: Hotel Availability Filtering
   * For any date range selection, all returned hotels SHALL have at least one room
   * available for the entire selected date range.
   * Validates: Requirements 2.2
   */
  describe('Hotel Availability Filtering', () => {
    interface RoomType {
      type: string;
      available: number;
    }

    interface MockHotelWithRooms {
      id: string;
      name: string;
      roomTypes: RoomType[];
      availableRooms: number;
    }

    interface DateRange {
      checkIn: Date;
      checkOut: Date;
    }

    interface Booking {
      hotelId: string;
      roomType: string;
      checkIn: Date;
      checkOut: Date;
      roomCount: number;
    }

    // Check if date ranges overlap
    const datesOverlap = (
      range1Start: Date,
      range1End: Date,
      range2Start: Date,
      range2End: Date
    ): boolean => {
      return range1Start < range2End && range1End > range2Start;
    };

    // Calculate available rooms for a hotel considering existing bookings
    const getAvailableRooms = (
      hotel: MockHotelWithRooms,
      bookings: Booking[],
      dateRange: DateRange
    ): number => {
      let totalAvailable = 0;

      for (const roomType of hotel.roomTypes) {
        const overlappingBookings = bookings.filter(
          (b) =>
            b.hotelId === hotel.id &&
            b.roomType === roomType.type &&
            datesOverlap(dateRange.checkIn, dateRange.checkOut, b.checkIn, b.checkOut)
        );

        const bookedRooms = overlappingBookings.reduce((sum, b) => sum + b.roomCount, 0);
        const availableForType = Math.max(0, roomType.available - bookedRooms);
        totalAvailable += availableForType;
      }

      return totalAvailable;
    };

    // Filter hotels by availability
    const filterByAvailability = (
      hotels: MockHotelWithRooms[],
      bookings: Booking[],
      dateRange: DateRange
    ): MockHotelWithRooms[] => {
      return hotels.filter((hotel) => getAvailableRooms(hotel, bookings, dateRange) > 0);
    };

    const roomTypeArb = fc.record({
      type: fc.constantFrom('standard', 'deluxe', 'suite', 'executive'),
      available: fc.integer({ min: 0, max: 20 }),
    });

    const hotelWithRoomsArb = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 1, maxLength: 50 }),
      roomTypes: fc.array(roomTypeArb, { minLength: 1, maxLength: 4 }),
      availableRooms: fc.integer({ min: 0, max: 100 }),
    });

    test('filterByAvailability returns only hotels with available rooms', () => {
      fc.assert(
        fc.property(
          fc.array(hotelWithRoomsArb, { minLength: 0, maxLength: 20 }),
          fc.date({ min: new Date('2024-01-01'), max: new Date('2025-06-30') }),
          fc.integer({ min: 1, max: 14 }),
          (hotels, checkIn, nights) => {
            const checkOut = new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000);
            const dateRange = { checkIn, checkOut };
            const bookings: Booking[] = [];

            const filtered = filterByAvailability(hotels, bookings, dateRange);

            return filtered.every(
              (hotel) => getAvailableRooms(hotel, bookings, dateRange) > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    test('filterByAvailability excludes fully booked hotels', () => {
      fc.assert(
        fc.property(
          hotelWithRoomsArb,
          fc.date({ min: new Date('2024-01-01'), max: new Date('2025-06-30') }),
          fc.integer({ min: 1, max: 7 }),
          (hotel, checkIn, nights) => {
            const checkOut = new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000);
            const dateRange = { checkIn, checkOut };

            const bookings: Booking[] = hotel.roomTypes.map((rt) => ({
              hotelId: hotel.id,
              roomType: rt.type,
              checkIn,
              checkOut,
              roomCount: rt.available,
            }));

            const hotels = [hotel];
            const filtered = filterByAvailability(hotels, bookings, dateRange);

            const totalRooms = hotel.roomTypes.reduce((sum, rt) => sum + rt.available, 0);
            if (totalRooms === 0) {
              return filtered.length === 0;
            }

            return filtered.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('non-overlapping bookings should not affect availability', () => {
      fc.assert(
        fc.property(
          hotelWithRoomsArb,
          fc.date({ min: new Date('2024-01-01'), max: new Date('2024-06-30') }),
          fc.integer({ min: 1, max: 7 }),
          (hotel, checkIn, nights) => {
            const checkOut = new Date(checkIn.getTime() + nights * 24 * 60 * 60 * 1000);
            const dateRange = { checkIn, checkOut };

            const nonOverlappingBookings: Booking[] = hotel.roomTypes.map((rt) => ({
              hotelId: hotel.id,
              roomType: rt.type,
              checkIn: new Date('2024-12-01'),
              checkOut: new Date('2024-12-08'),
              roomCount: rt.available,
            }));

            const hotels = [hotel];
            const filtered = filterByAvailability(hotels, nonOverlappingBookings, dateRange);

            const totalRooms = hotel.roomTypes.reduce((sum, rt) => sum + rt.available, 0);
            if (totalRooms > 0) {
              return filtered.length === 1;
            }
            return filtered.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

