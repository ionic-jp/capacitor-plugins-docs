import { activationLine, normalizeHeadingId, selectActiveHeading } from './scroll-spy';

describe('scroll-spy', () => {
  describe('normalizeHeadingId', () => {
    it('normalizes punctuation and dots consistently', () => {
      expect(normalizeHeadingId('Hello, World!')).toBe('hello-world');
      expect(normalizeHeadingId('file.name.ts')).toBe('file-name-ts');
      expect(normalizeHeadingId('  Foo...Bar  ')).toBe('foo-bar');
      expect(normalizeHeadingId('A.B / C?')).toBe('a-b-c');
    });
  });

  describe('selectActiveHeading', () => {
    it('selects the first heading when all headings are below the activation line', () => {
      expect(
        selectActiveHeading(
          [
            { id: 'intro', top: 120 },
            { id: 'setup', top: 240 },
          ],
          50,
        ),
      ).toBe('intro');
    });

    it('selects the last heading at or above the activation line', () => {
      expect(
        selectActiveHeading(
          [
            { id: 'intro', top: 10 },
            { id: 'setup', top: 80 },
            { id: 'usage', top: 200 },
          ],
          80,
        ),
      ).toBe('setup');
    });

    it('returns an empty string for empty positions', () => {
      expect(selectActiveHeading([], 100)).toBe('');
    });
  });

  describe('activationLine', () => {
    it('clamps to 96 and 280 and is 28% in between', () => {
      expect(activationLine(100)).toBe(96);
      expect(activationLine(2000)).toBe(280);
      expect(activationLine(500)).toBe(140);
    });
  });
});
