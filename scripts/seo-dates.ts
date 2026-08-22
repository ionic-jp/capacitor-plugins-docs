const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const SITE_TIME_ZONE = 'Asia/Tokyo';

function currentSiteDate(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SITE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const value = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function formatContentUpdatedAt(value: Date): string {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, '0');
  const day = String(value.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isValidContentUpdatedAt(
  value: string,
  now = new Date(),
): value is `${number}-${number}-${number}` {
  const match = ISO_DATE.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return false;
  }

  return value <= currentSiteDate(now);
}

export function assertValidContentUpdatedAt(
  value: string,
  context: string,
  now = new Date(),
): string {
  if (!isValidContentUpdatedAt(value, now)) {
    throw new Error(
      `${context} must declare updatedAt as a real YYYY-MM-DD calendar date that is not in the future`,
    );
  }
  return value;
}

export function formatSitemapLastmod(updatedAt: string | undefined): string {
  return updatedAt ? `\n    <lastmod>${updatedAt}</lastmod>` : '';
}

export function assertUpdatedAtOnOrAfterPublishedDate(
  updatedAt: string,
  publishedDate: string,
  context: string,
): string {
  if (updatedAt < publishedDate) {
    throw new Error(
      `${context} must declare updatedAt on or after the source publishedDate (${publishedDate}), got ${updatedAt}`,
    );
  }
  return updatedAt;
}
