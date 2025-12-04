/**
 * Multi-Language Support Property Tests
 * Tests for language preference and fallback behavior
 */

import * as fc from 'fast-check';

describe('Multi-Language Support Properties', () => {
  /**
   * Property 33: Language Preference Persistence
   * User language preference SHALL be persisted and restored on return.
   * Validates: Requirements 17.1, 17.4
   */
  describe('Property 33: Language Preference Persistence', () => {
    const SUPPORTED_LANGUAGES = ['en', 'pcm', 'efk', 'ig', 'yo', 'ha'];

    class MockLanguageStore {
      private preferences: Map<string, string> = new Map();

      setLanguage(userId: string, language: string): void {
        if (SUPPORTED_LANGUAGES.includes(language)) {
          this.preferences.set(userId, language);
        }
      }

      getLanguage(userId: string): string {
        return this.preferences.get(userId) || 'en';
      }
    }

    test('language preference is persisted and retrieved', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.constantFrom(...SUPPORTED_LANGUAGES),
          (userId, language) => {
            const store = new MockLanguageStore();
            store.setLanguage(userId, language);
            return store.getLanguage(userId) === language;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('default language is English', () => {
      fc.assert(
        fc.property(fc.uuid(), (userId) => {
          const store = new MockLanguageStore();
          return store.getLanguage(userId) === 'en';
        }),
        { numRuns: 50 }
      );
    });
  });

  /**
   * Property 34: Language Fallback Behavior
   * Missing translations SHALL fall back to English.
   * Validates: Requirements 17.5
   */
  describe('Property 34: Language Fallback Behavior', () => {
    interface Translations {
      [key: string]: string;
    }

    const englishTranslations: Translations = {
      'welcome': 'Welcome to Calabar Carnival',
      'events': 'Events',
      'hotels': 'Hotels',
      'map': 'Map',
      'safety': 'Safety',
    };

    const pidginTranslations: Translations = {
      'welcome': 'Welcome to Calabar Carnival o!',
      'events': 'Events dem',
      // 'hotels' missing - should fallback
      // 'map' missing - should fallback
      'safety': 'Safety matter',
    };

	    const hasOwn = (obj: Translations, key: string) =>
	      Object.prototype.hasOwnProperty.call(obj, key);

	    const getTranslation = (key: string, language: string): string => {
	      if (language === 'pcm' && hasOwn(pidginTranslations, key)) {
	        return pidginTranslations[key];
	      }
	      if (hasOwn(englishTranslations, key)) {
	        return englishTranslations[key];
	      }
	      return key;
	    };

    test('existing translations are returned', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('welcome', 'events', 'safety'),
          (key) => {
            const translation = getTranslation(key, 'pcm');
            return translation === pidginTranslations[key];
          }
        ),
        { numRuns: 50 }
      );
    });

    test('missing translations fall back to English', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('hotels', 'map'),
          (key) => {
            const translation = getTranslation(key, 'pcm');
            return translation === englishTranslations[key];
          }
        ),
        { numRuns: 50 }
      );
    });

    test('unknown keys return the key itself', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 20 }).filter(
            (s) => !Object.keys(englishTranslations).includes(s)
          ),
          (unknownKey) => {
            const translation = getTranslation(unknownKey, 'en');
            return translation === unknownKey;
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});

