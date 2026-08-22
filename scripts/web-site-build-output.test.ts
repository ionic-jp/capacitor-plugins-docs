import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import {
  ARTICLE_SUMMARIES,
  ARTICLE_YEARS,
} from '../projects/web-site/src/app/generated/article-catalog.generated';

const browserRoot = new URL('../dist/web-site/browser/', import.meta.url);

test('prerenders the web-site home, archive, and translated articles', async () => {
  const home = await readFile(new URL('index.html', browserRoot), 'utf8');
  assert.match(home, /Featured OSS/);
  assert.match(home, /https:\/\/docs\.rdlabo\.dev/);
  assert.match(home, /rel="canonical" href="https:\/\/rdlabo\.dev"/);

  for (const article of ARTICLE_SUMMARIES) {
    const html = await readFile(
      new URL(`articles/${article.slug}/index.html`, browserRoot),
      'utf8',
    );
    assert.match(html, new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
    assert.match(html, new RegExp(article.originalUrl.replaceAll('.', '\\.')));
    assert.match(
      html,
      new RegExp(`Read the original article in Japanese on ${article.sourceName}`),
    );
    if (article.slug === 'ionic-9-components-got-better') {
      assert.match(html, /class="article-link-card"/);
      assert.match(html, /Announcing Ionic Framework 9/);
      assert.match(html, /ionic-9-feature-image-1024x512\.png/);
    }
  }

  for (const year of ARTICLE_YEARS) {
    const archive = await readFile(
      new URL(`articles/archive/${year}/index.html`, browserRoot),
      'utf8',
    );
    assert.match(archive, new RegExp(`Articles from ${year}`));
  }
});

test('ships crawler and static-not-found assets', async () => {
  const [robots, sitemap, notFound] = await Promise.all([
    readFile(new URL('robots.txt', browserRoot), 'utf8'),
    readFile(new URL('sitemap.xml', browserRoot), 'utf8'),
    readFile(new URL('404.html', browserRoot), 'utf8'),
  ]);
  assert.match(robots, /https:\/\/rdlabo\.dev\/sitemap\.xml/);
  assert.match(sitemap, /https:\/\/rdlabo\.dev\/articles/);
  assert.match(notFound, /<meta name="robots" content="noindex"/);
});

test('builds the English search index with the component UI', async () => {
  const searchDirectory = new URL('../dist/web-site/browser/pagefind/', import.meta.url);
  const files = await readdir(searchDirectory, { recursive: true });
  assert.ok(files.includes('pagefind-component-ui.js'));
  assert.ok(files.includes('pagefind-component-ui.css'));
  assert.ok(files.some((file) => /^pagefind\.en_.+\.pf_meta$/.test(file)));
  assert.equal(
    files.filter((file) => /^fragment\/en_.+\.pf_fragment$/.test(file)).length,
    2 + ARTICLE_YEARS.length + ARTICLE_SUMMARIES.length,
    'Search index must contain the home, article list, every archive, and every article',
  );
});
