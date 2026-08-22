import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertUpdatedAtOnOrAfterPublishedDate,
  assertValidContentUpdatedAt,
  formatSitemapLastmod,
  isValidContentUpdatedAt,
} from './seo-dates';

test('isValidContentUpdatedAt accepts real calendar dates and rejects invalid values', () => {
  const now = new Date('2026-08-23T12:00:00.000Z');
  assert.equal(isValidContentUpdatedAt('2026-08-23', now), true);
  assert.equal(isValidContentUpdatedAt('2024-02-29', now), true);
  assert.equal(isValidContentUpdatedAt('2026-08-24', now), false);
  assert.equal(isValidContentUpdatedAt('2026-13-01', now), false);
  assert.equal(isValidContentUpdatedAt('2026-02-30', now), false);
  assert.equal(isValidContentUpdatedAt('08-23-2026', now), false);
});

test('future-date validation follows the site Asia/Tokyo calendar day', () => {
  const justAfterMidnightInTokyo = new Date('2026-08-22T15:30:00.000Z');
  assert.equal(isValidContentUpdatedAt('2026-08-23', justAfterMidnightInTokyo), true);
  assert.equal(isValidContentUpdatedAt('2026-08-24', justAfterMidnightInTokyo), false);
});

test('assertValidContentUpdatedAt throws with actionable context', () => {
  assert.throws(
    () => assertValidContentUpdatedAt('not-a-date', 'projects/stripe/payment-sheet (en)'),
    /projects\/stripe\/payment-sheet \(en\)/,
  );
});

test('formatSitemapLastmod emits lastmod only for explicit dates', () => {
  assert.equal(formatSitemapLastmod(undefined), '');
  assert.equal(formatSitemapLastmod('2026-08-23'), '\n    <lastmod>2026-08-23</lastmod>');
});

test('assertUpdatedAtOnOrAfterPublishedDate rejects updatedAt before publishedDate', () => {
  assert.equal(
    assertUpdatedAtOnOrAfterPublishedDate('2024-06-15', '2024-06-01', 'example.md'),
    '2024-06-15',
  );
  assert.throws(
    () => assertUpdatedAtOnOrAfterPublishedDate('2024-05-01', '2024-06-01', 'example.md'),
    /example\.md must declare updatedAt on or after the source publishedDate \(2024-06-01\), got 2024-05-01/,
  );
});
