import { createHash } from 'node:crypto';

export const NOTE_API_URL = (noteId: string) => `https://note.com/api/v3/notes/${noteId}`;

export function noteIdFromUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid note URL: ${value}`);
  }
  const match = /^\/rdlabo\/n\/(n[a-z0-9]+)$/.exec(url.pathname);
  if (url.origin !== 'https://note.com' || !match) {
    throw new Error(`Expected an rdlabo note article URL: ${value}`);
  }
  return match[1];
}

export interface NoteArticleMetadata {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  publishedDate: string;
  sourceRevision: string;
}

interface NoteApiPayload {
  data?: {
    key?: unknown;
    name?: unknown;
    body?: unknown;
    note_url?: unknown;
    publish_at?: unknown;
  };
}

function dateInTokyo(value: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

export function parseNoteArticle(payload: unknown, expectedId: string): NoteArticleMetadata {
  const data = (payload as NoteApiPayload).data;
  if (!data || data.key !== expectedId) {
    throw new Error(`note response does not contain ${expectedId}`);
  }
  if (typeof data.name !== 'string' || !data.name.trim()) {
    throw new Error(`note article ${expectedId} has no title`);
  }
  if (typeof data.body !== 'string' || !data.body.trim()) {
    throw new Error(`note article ${expectedId} has no body`);
  }
  if (typeof data.note_url !== 'string' || !data.note_url.startsWith('https://note.com/')) {
    throw new Error(`note article ${expectedId} has an invalid URL`);
  }
  if (typeof data.publish_at !== 'string') {
    throw new Error(`note article ${expectedId} has no publication date`);
  }
  const published = new Date(data.publish_at);
  if (Number.isNaN(published.valueOf())) {
    throw new Error(`note article ${expectedId} has an invalid publication date`);
  }

  return {
    id: expectedId,
    title: data.name.trim(),
    url: data.note_url,
    publishedAt: published.toISOString(),
    publishedDate: dateInTokyo(published),
    sourceRevision: createHash('sha256')
      .update(JSON.stringify({ title: data.name.trim(), body: data.body }))
      .digest('hex'),
  };
}

export async function fetchNoteArticle(noteUrl: string): Promise<NoteArticleMetadata> {
  const noteId = noteIdFromUrl(noteUrl);
  const response = await fetch(NOTE_API_URL(noteId), {
    headers: { 'user-agent': 'rdlabo-dev/website article generator' },
  });
  if (!response.ok) {
    throw new Error(`Unable to fetch note article ${noteId} (${response.status})`);
  }
  return parseNoteArticle(await response.json(), noteId);
}
