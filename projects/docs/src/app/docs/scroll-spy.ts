export interface HeadingPosition {
  id: string;
  top: number;
}

export function normalizeHeadingId(id: string): string {
  return id
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function selectActiveHeading(
  positions: readonly HeadingPosition[],
  activationY: number,
): string {
  if (positions.length === 0) return '';
  let active = positions[0].id;
  for (const position of positions) {
    if (position.top > activationY) break;
    active = position.id;
  }
  return active;
}

export function activationLine(viewportHeight: number): number {
  return Math.min(280, Math.max(96, viewportHeight * 0.28));
}
