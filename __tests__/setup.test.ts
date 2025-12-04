import * as fc from 'fast-check';

describe('Test Setup Verification', () => {
  it('should have Jest working correctly', () => {
    expect(true).toBe(true);
  });

  it('should have custom matchers working', () => {
    const validUUID = '550e8400-e29b-41d4-a716-446655440000';
    expect(validUUID).toBeValidUUID();
    
    expect(50).toBeWithinRange(0, 100);
  });

  it('should have fast-check working for property-based testing', () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a; // Commutative property
      })
    );
  });

  it('should generate valid event categories', () => {
    const validCategories = ['parade', 'music', 'culture', 'kids', 'exhibition', 'sports', 'nightlife', 'workshop', 'competition'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...validCategories),
        (category) => {
          return validCategories.includes(category);
        }
      )
    );
  });
});

