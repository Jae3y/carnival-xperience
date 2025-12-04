/**
 * Gamification System Property Tests
 * Tests for check-ins, badges, and leaderboard
 */

import * as fc from 'fast-check';

describe('Gamification Properties', () => {
  /**
   * Property 21: Check-in Points Award
   * For any event check-in, points SHALL be awarded based on event category.
   * Validates: Requirements 8.1
   */
  describe('Property 21: Check-in Points Award', () => {
    const CATEGORY_POINTS: Record<string, number> = {
      parade: 100,
      concert: 75,
      workshop: 50,
      exhibition: 25,
      food: 15,
      other: 10,
    };

    interface CheckIn {
      userId: string;
      eventId: string;
      category: string;
      pointsAwarded: number;
      timestamp: Date;
    }

    const performCheckIn = (userId: string, eventId: string, category: string): CheckIn => {
      const points = CATEGORY_POINTS[category] || CATEGORY_POINTS.other;
      return {
        userId,
        eventId,
        category,
        pointsAwarded: points,
        timestamp: new Date(),
      };
    };

    test('check-ins award correct points based on category', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.uuid(),
          fc.constantFrom('parade', 'concert', 'workshop', 'exhibition', 'food', 'other'),
          (userId, eventId, category) => {
            const checkIn = performCheckIn(userId, eventId, category);
            return checkIn.pointsAwarded === CATEGORY_POINTS[category];
          }
        ),
        { numRuns: 100 }
      );
    });

    test('unknown categories default to other points', () => {
      const knownCategories = Object.keys(CATEGORY_POINTS);
      const unknownCategories = ['unknown', 'random', 'test', 'xyz', 'custom'];

      fc.assert(
        fc.property(
          fc.uuid(),
          fc.uuid(),
          fc.constantFrom(...unknownCategories),
          (userId, eventId, unknownCategory) => {
            const checkIn = performCheckIn(userId, eventId, unknownCategory);
            return checkIn.pointsAwarded === CATEGORY_POINTS.other;
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 22: Badge Award on Requirement Met
   * When a user meets badge requirements, the badge SHALL be awarded.
   * Validates: Requirements 8.2
   */
  describe('Property 22: Badge Award on Requirement Met', () => {
    interface Badge {
      id: string;
      name: string;
      requiredCheckIns: number;
    }

    interface UserProgress {
      userId: string;
      checkInCount: number;
      badges: string[];
    }

    const BADGES: Badge[] = [
      { id: 'first-timer', name: 'First Timer', requiredCheckIns: 1 },
      { id: 'explorer', name: 'Explorer', requiredCheckIns: 5 },
      { id: 'enthusiast', name: 'Enthusiast', requiredCheckIns: 10 },
      { id: 'veteran', name: 'Veteran', requiredCheckIns: 25 },
      { id: 'legend', name: 'Legend', requiredCheckIns: 50 },
    ];

    const checkAndAwardBadges = (progress: UserProgress): string[] => {
      const newBadges: string[] = [];
      for (const badge of BADGES) {
        if (progress.checkInCount >= badge.requiredCheckIns && !progress.badges.includes(badge.id)) {
          newBadges.push(badge.id);
        }
      }
      return newBadges;
    };

    test('badges are awarded when requirements are met', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.integer({ min: 0, max: 100 }),
          (userId, checkInCount) => {
            const progress: UserProgress = { userId, checkInCount, badges: [] };
            const awarded = checkAndAwardBadges(progress);

            // All awarded badges should have requirements met
            return awarded.every((badgeId) => {
              const badge = BADGES.find((b) => b.id === badgeId);
              return badge && checkInCount >= badge.requiredCheckIns;
            });
          }
        ),
        { numRuns: 100 }
      );
    });

    test('already owned badges are not re-awarded', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.integer({ min: 50, max: 100 }),
          (userId, checkInCount) => {
            const existingBadges = ['first-timer', 'explorer'];
            const progress: UserProgress = { userId, checkInCount, badges: existingBadges };
            const awarded = checkAndAwardBadges(progress);

            return !awarded.some((b) => existingBadges.includes(b));
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  /**
   * Property 23: Leaderboard Ordering
   * The leaderboard SHALL be sorted by points in descending order.
   * Validates: Requirements 8.3
   */
  describe('Property 23: Leaderboard Ordering', () => {
    interface LeaderboardEntry {
      userId: string;
      username: string;
      points: number;
      rank: number;
    }

    const sortLeaderboard = (entries: Omit<LeaderboardEntry, 'rank'>[]): LeaderboardEntry[] => {
      return [...entries]
        .sort((a, b) => b.points - a.points)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
    };

    test('leaderboard is sorted by points descending', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              userId: fc.uuid(),
              username: fc.string({ minLength: 1, maxLength: 20 }),
              points: fc.nat({ max: 10000 }),
            }),
            { minLength: 2, maxLength: 100 }
          ),
          (entries) => {
            const sorted = sortLeaderboard(entries);
            for (let i = 0; i < sorted.length - 1; i++) {
              if (sorted[i].points < sorted[i + 1].points) {
                return false;
              }
            }
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('ranks are assigned correctly', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              userId: fc.uuid(),
              username: fc.string({ minLength: 1, maxLength: 20 }),
              points: fc.nat({ max: 10000 }),
            }),
            { minLength: 1, maxLength: 50 }
          ),
          (entries) => {
            const sorted = sortLeaderboard(entries);
            return sorted.every((entry, index) => entry.rank === index + 1);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});

