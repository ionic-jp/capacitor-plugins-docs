import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { generateArticles, normalizeFootnoteIds } from './generate-articles';

test('normalizes random Zenn footnote ids to stable article-scoped ids', () => {
  const rendered = new JSDOM(`
    <sup class="footnote-ref"><a href="#fn-a1b2-1" id="fnref-a1b2-1">[1]</a></sup>
    <li class="footnote-item" id="fn-a1b2-1">
      Footnote <a href="#fnref-a1b2-1" class="footnote-backref">↩︎</a>
    </li>
  `);

  normalizeFootnoteIds(rendered.window.document, 'example-article');

  assert.ok(rendered.window.document.getElementById('fnref-example-article-1'));
  assert.ok(rendered.window.document.getElementById('fn-example-article-1'));
  assert.equal(
    rendered.window.document
      .querySelector<HTMLAnchorElement>('.footnote-ref a')
      ?.getAttribute('href'),
    '#fn-example-article-1',
  );
  assert.equal(
    rendered.window.document
      .querySelector<HTMLAnchorElement>('.footnote-backref')
      ?.getAttribute('href'),
    '#fnref-example-article-1',
  );
});

test('a stale note revision aborts before generated outputs are changed', async () => {
  const root = await mkdtemp(join(tmpdir(), 'note-revision-'));
  const articlesRoot = join(root, 'projects/web-site/src/articles');
  const generatedArticlesRoot = join(root, 'projects/web-site/src/app/generated/articles');
  const sentinelPath = join(generatedArticlesRoot, 'keep.generated.ts');

  try {
    await Promise.all([
      mkdir(articlesRoot, { recursive: true }),
      mkdir(generatedArticlesRoot, { recursive: true }),
    ]);
    await Promise.all([
      writeFile(
        join(articlesRoot, 'example.md'),
        `---
title: Example translation
description: Example description
source: note
sourceUrl: https://note.com/rdlabo/n/nexample
sourceRevision: reviewed-revision
slug: example
---
Translated body.
`,
        'utf8',
      ),
      writeFile(sentinelPath, 'existing generated output\n', 'utf8'),
    ]);

    await assert.rejects(
      () =>
        generateArticles({
          root,
          fetchZennArticles: async () => [],
          fetchNoteSource: async () => ({
            id: 'nexample',
            title: 'Japanese source',
            url: 'https://note.com/rdlabo/n/nexample',
            publishedAt: '2026-08-19T03:18:54.000Z',
            publishedDate: '2026-08-19',
            sourceRevision: 'changed-revision',
          }),
        }),
      /older note revision/,
    );
    assert.equal(await readFile(sentinelPath, 'utf8'), 'existing generated output\n');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
