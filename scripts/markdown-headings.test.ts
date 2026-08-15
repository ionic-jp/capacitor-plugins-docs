import assert from 'node:assert/strict';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { normalizeImportedReadmeHeadings } from './markdown-headings';

test('removes the README title and preserves nested heading levels after another h1', () => {
  const document = new JSDOM(`
    <h1 id="package">Package</h1>
    <h2 id="install">Installation</h2>
    <h1 id="faq">FAQ</h1>
    <h2 id="question">Question</h2>
    <h3 id="detail">Detail</h3>
  `).window.document;

  normalizeImportedReadmeHeadings(document);

  const page = document.createElement('main');
  page.innerHTML = `<h1>Page title</h1>${document.body.innerHTML}`;
  assert.equal(page.querySelectorAll('h1').length, 1);
  assert.deepEqual(
    Array.from(page.querySelectorAll('h1, h2, h3, h4')).map((heading) => [
      heading.tagName,
      heading.id,
    ]),
    [
      ['H1', ''],
      ['H2', 'install'],
      ['H2', 'faq'],
      ['H3', 'question'],
      ['H4', 'detail'],
    ],
  );
});
