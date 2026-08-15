import assert from 'node:assert/strict';
import { access, constants, readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';

test('places locale-specific static 404 pages in the browser output', async () => {
  const [english, japanese] = await Promise.all([
    readFile(new URL('../dist/capacitor-plugins-docs/browser/404.html', import.meta.url), 'utf8'),
    readFile(
      new URL('../dist/capacitor-plugins-docs/browser/ja/404.html', import.meta.url),
      'utf8',
    ),
  ]);
  assert.match(english, /<html lang="en">/);
  assert.match(japanese, /<html lang="ja">/);
  await assert.rejects(() =>
    access(
      new URL('../dist/capacitor-plugins-docs/browser/ja/ja/404.html', import.meta.url),
      constants.F_OK,
    ),
  );
});

test('legacy prerender output redirects to an absolute canonical route', async () => {
  const html = await readFile(
    new URL('../dist/capacitor-plugins-docs/browser/stripe/docs/react/index.html', import.meta.url),
    'utf8',
  );
  assert.match(html, /\/projects\/capacitor-stripe\/docs\/react/);
  assert.doesNotMatch(html, /\/stripe\/docs\/projects\/capacitor-stripe/);
});

test('prerender output includes localized SEO metadata', async () => {
  const html = await readFile(
    new URL(
      '../dist/capacitor-plugins-docs/browser/ja/projects/capacitor-admob/index.html',
      import.meta.url,
    ),
    'utf8',
  );
  assert.match(html, /<html lang="ja"/);
  assert.match(
    html,
    /rel="canonical" href="https:\/\/docs\.rdlabo\.dev\/ja\/projects\/capacitor-admob"/,
  );
  assert.match(html, /hreflang="en"/);
  assert.match(html, /hreflang="ja"/);
  assert.match(
    html,
    /property="og:image" content="https:\/\/docs\.rdlabo\.dev\/assets\/brand\/og-card\.png"/,
  );
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
});

test('Japanese home prerender uses slashless canonical SEO URLs', async () => {
  const html = await readFile(
    new URL('../dist/capacitor-plugins-docs/browser/ja/index.html', import.meta.url),
    'utf8',
  );
  assert.match(html, /rel="canonical" href="https:\/\/docs\.rdlabo\.dev\/ja"/);
  assert.match(html, /property="og:url" content="https:\/\/docs\.rdlabo\.dev\/ja"/);
  assert.match(html, /hreflang="ja" href="https:\/\/docs\.rdlabo\.dev\/ja"/);
  assert.doesNotMatch(html, /rel="canonical" href="https:\/\/docs\.rdlabo\.dev\/ja\/"/);
  assert.doesNotMatch(html, /property="og:url" content="https:\/\/docs\.rdlabo\.dev\/ja\/"/);
  assert.doesNotMatch(html, /hreflang="ja" href="https:\/\/docs\.rdlabo\.dev\/ja\/"/);
  assert.match(html, /hover:opacity-75" href="\/ja"/);
  assert.match(html, /hover:text-\[#c44320\][^>]*href="\/ja"/);
});

test('prerendered docs shell stays layout-neutral before bootstrap', async () => {
  const html = await readFile(
    new URL('../dist/capacitor-plugins-docs/browser/index.html', import.meta.url),
    'utf8',
  );
  const shell = html.match(/<div\b[^>]*\bclass="[^"]*\bdocs-shell\b[^"]*"[^>]*>/)?.[0];
  assert.ok(shell, 'docs-shell must be present in prerendered index.html');
  assert.doesNotMatch(shell, /\blayout-ready\b/);
  assert.match(shell, /lg:grid-cols-\[288px_minmax\(0,1fr\)\]/);

  const toggle = html.match(/<button\b[^>]*\baria-controls="docs-sidebar"[^>]*>/)?.[0];
  assert.ok(toggle, 'sidebar toggle must be present in prerendered index.html');
  assert.doesNotMatch(toggle, /\baria-expanded\b/);

  const sidebar = html.match(/<aside\b[^>]*\bid="docs-sidebar"[^>]*>/)?.[0];
  assert.ok(sidebar, 'docs-sidebar must be present in prerendered index.html');
  assert.match(sidebar, /lg:translate-x-0/);
  assert.doesNotMatch(sidebar, /\binert\b/);

  const css = await readFile(new URL('../src/app/app.css', import.meta.url), 'utf8');
  assert.match(
    css,
    /@media\s*\(\s*max-width:\s*1023px\s*\)[\s\S]*?\.docs-shell:not\(\.layout-ready\)\s+#docs-sidebar\s*\{[\s\S]*?visibility:\s*hidden;[\s\S]*?transform:\s*translateX\(-100%\);/,
  );
});

test('builds bounded English and Japanese search indexes with the component UI', async () => {
  const searchDirectory = new URL(
    '../dist/capacitor-plugins-docs/browser/pagefind/',
    import.meta.url,
  );
  const files = await readdir(searchDirectory, { recursive: true });
  assert.ok(files.includes('pagefind-component-ui.js'));
  assert.ok(files.includes('pagefind-component-ui.css'));
  assert.ok(files.some((file) => /^pagefind\.en_.+\.pf_meta$/.test(file)));
  assert.ok(files.some((file) => /^pagefind\.ja_.+\.pf_meta$/.test(file)));
  assert.equal(
    files.filter((file) => /^fragment\/en_.+\.pf_fragment$/.test(file)).length,
    76,
    'English search index must contain only canonical pages',
  );
  assert.equal(
    files.filter((file) => /^fragment\/ja_.+\.pf_fragment$/.test(file)).length,
    76,
    'Japanese search index must contain only canonical pages',
  );
  const sizes = await Promise.all(
    files.map(async (file) => {
      const entry = await stat(join(searchDirectory.pathname, file));
      return entry.isFile() ? entry.size : 0;
    }),
  );
  assert.ok(
    sizes.reduce((total, size) => total + size, 0) < 5 * 1024 * 1024,
    'Search bundle must remain under 5 MiB',
  );
});
