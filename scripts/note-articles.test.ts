import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { noteIdFromUrl, parseNoteArticle } from './note-articles';

test('noteIdFromUrl accepts only canonical rdlabo article URLs', () => {
  assert.equal(noteIdFromUrl('https://note.com/rdlabo/n/na69e5aad6840'), 'na69e5aad6840');
  assert.throws(
    () => noteIdFromUrl('https://note.com/someone-else/n/na69e5aad6840'),
    /Expected an rdlabo note article URL/,
  );
});

test('parseNoteArticle returns stable metadata and a body revision', () => {
  const article = parseNoteArticle(
    {
      data: {
        key: 'nexample',
        name: ' Example article ',
        body: '<p>Japanese source</p>',
        note_url: 'https://note.com/rdlabo/n/nexample',
        publish_at: '2026-08-19T12:18:54.000+09:00',
      },
    },
    'nexample',
  );

  assert.deepEqual(article, {
    id: 'nexample',
    title: 'Example article',
    url: 'https://note.com/rdlabo/n/nexample',
    publishedAt: '2026-08-19T03:18:54.000Z',
    publishedDate: '2026-08-19',
    sourceRevision: createHash('sha256')
      .update(JSON.stringify({ title: 'Example article', body: '<p>Japanese source</p>' }))
      .digest('hex'),
  });
});

test('parseNoteArticle rejects a mismatched article id', () => {
  assert.throws(
    () => parseNoteArticle({ data: { key: 'nother' } }, 'nexample'),
    /does not contain nexample/,
  );
});
