import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import {
  buildStagedArticleMarkdown,
  classifyArticleLanguage,
  classifyArticleHtml,
  classifyArticleMarkdown,
  convertZennBodyHtmlToMarkdown,
  extractJinaMarkdownContent,
  extractPreCodeText,
  extractVisibleProseFromMarkdown,
  extractVisibleTextFromHtml,
  isTranslationArticle,
  languageReason,
  loadExistingZennSlugs,
  loadLocalZennArticles,
  parseCliArgs,
  parseZennArticleApiFromJinaProxy,
  parseZennArticleFeedFromJinaProxy,
  resolveArticleTitle,
  validateSourceDirectory,
} from './import-zenn-articles';

test('classifies clearly Japanese prose as japanese', () => {
  const text =
    '業務アプリのオフライン対応をリリースしました。電波がなくても作業を続けることができ、オンラインに復帰したら自動でサーバーと同期するものです。実装負荷が大きすぎる機能をようやく載せられました。';
  const result = classifyArticleLanguage(text);
  assert.equal(result.verdict, 'japanese');
  assert.ok(result.japaneseCount >= 40);
  assert.ok(result.japaneseRatio >= 0.12);
});

test('classifies clearly English prose as english', () => {
  const text =
    'I released offline support for my business app. Users can keep working without a signal, and when they come back online the app syncs with the server automatically.';
  const result = classifyArticleLanguage(text);
  assert.equal(result.verdict, 'english');
  assert.ok(result.japaneseCount < 40);
  assert.ok(result.japaneseRatio < 0.12);
});

test('detects translated articles without confusing articles about translation tooling', () => {
  assert.equal(
    isTranslationArticle(
      '[翻訳] Ionic 6 is here',
      'この記事は Announcing Ionic 6 を、翻訳、加筆したものです。',
    ),
    true,
  );
  assert.equal(
    isTranslationArticle(
      'Angular RFC: Deferred Loadingの翻訳',
      'Angular RFCの内容を日本語で紹介します。',
    ),
    true,
  );
  assert.equal(
    isTranslationArticle(
      'Angular i18nで自動翻訳する方法',
      'このガイドではDeepLを使ってアプリを多言語化します。',
    ),
    false,
  );
});

test('marks mixed-signal articles as borderline instead of discarding them silently', () => {
  const lowCountHighRatio = classifyArticleLanguage('これは短い日本語。', {
    absoluteMinimum: 40,
    ratioMinimum: 0.12,
  });
  assert.equal(lowCountHighRatio.verdict, 'borderline');

  const highCountLowRatio = classifyArticleLanguage(`${'a'.repeat(400)}${'あ'.repeat(50)}`, {
    absoluteMinimum: 40,
    ratioMinimum: 0.12,
  });
  assert.equal(highCountLowRatio.verdict, 'borderline');
});

test('extractVisibleTextFromHtml ignores code blocks for language detection', () => {
  const html = `
    <p>${'これは日本語の本文です。オフライン同期について説明します。'.repeat(4)}</p>
    <pre><code>const value = "english-only-code";</code></pre>
  `;
  const text = extractVisibleTextFromHtml(html);
  assert.match(text, /日本語の本文/);
  assert.doesNotMatch(text, /english-only-code/);
  assert.equal(classifyArticleHtml(html).verdict, 'japanese');
});

test('extractPreCodeText preserves shiki line contents', () => {
  const pre = new JSDOM(
    `<pre><code><span class="line"><span>&lt;ion-select-option</span><span> value=</span><span>"train"</span><span>&gt;電車&lt;/ion-select-option&gt;</span></span>
<span class="line"></span></code></pre>`,
  ).window.document.querySelector('pre');
  assert.ok(pre);
  assert.equal(
    extractPreCodeText(pre),
    '<ion-select-option value="train">電車</ion-select-option>\n',
  );
});

test('convertZennBodyHtmlToMarkdown preserves headings, links, lists, blockquotes, and fenced code', () => {
  const markdown = convertZennBodyHtmlToMarkdown(`
    <h2 id="section">見出し</h2>
    <p><a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">リンク</a>と<code>inline</code>。</p>
    <ul>
      <li>項目A</li>
      <li>項目B</li>
    </ul>
    <blockquote><p>引用文</p></blockquote>
    <pre class="shiki"><code><span class="line"><span>console.log("keep-me");</span></span></code></pre>
  `);

  assert.match(markdown, /^## 見出し/m);
  assert.match(markdown, /\[リンク\]\(https:\/\/example\.com\)/);
  assert.match(markdown, /`inline`/);
  assert.match(markdown, /-+\s+項目A/);
  assert.match(markdown, /-+\s+項目B/);
  assert.match(markdown, /^> 引用文/m);
  assert.match(markdown, /```\nconsole\.log\("keep-me"\);\n```/);
});

test('convertZennBodyHtmlToMarkdown converts tables and details', () => {
  const markdown = convertZennBodyHtmlToMarkdown(`
    <table>
      <tr><th>列1</th><th>列2</th></tr>
      <tr><td>値A</td><td>値B</td></tr>
    </table>
    <details>
      <summary>詳細</summary>
      <p>折りたたみ本文</p>
    </details>
  `);

  assert.match(markdown, /\| 列1 \| 列2 \|/);
  assert.match(markdown, /\| 値A \| 値B \|/);
  assert.match(markdown, /<details>\s*\n<summary>詳細<\/summary>/);
  assert.match(markdown, /折りたたみ本文/);
});

test('buildStagedArticleMarkdown writes required front matter and placeholder description', () => {
  const markdown = buildStagedArticleMarkdown({
    title: '日本語タイトル',
    zennSlug: 'example-slug',
    emoji: '📝',
    publishedDate: '2026-08-21',
    originalUrl: 'https://zenn.dev/rdlabo/articles/example-slug',
    bodyMarkdown: '## 見出し\n\n本文\n',
  });

  assert.match(markdown, /^---\n/);
  assert.match(markdown, /title: "日本語タイトル"/);
  assert.match(markdown, /description: "TODO: Translate from Japanese\."/);
  assert.match(markdown, /zennSlug: example-slug/);
  assert.match(markdown, /emoji: "📝"/);
  assert.match(markdown, /publishedDate: "2026-08-21"/);
  assert.match(markdown, /originalUrl: "https:\/\/zenn\.dev\/rdlabo\/articles\/example-slug"/);
  assert.match(markdown, /## 見出し/);
});

test('languageReason formats metrics for inventory entries', () => {
  assert.equal(
    languageReason({ japaneseCount: 12, letterCount: 100, japaneseRatio: 0.12 }),
    'japaneseCount=12, letterCount=100, japaneseRatio=0.120',
  );
});

test('extractJinaMarkdownContent strips the Jina wrapper prefix', () => {
  assert.equal(
    extractJinaMarkdownContent(`Title: \n\nMarkdown Content:\n{"article":{"slug":"example"}}`),
    '{"article":{"slug":"example"}}',
  );
});

test('parseZennArticleFeedFromJinaProxy parses article URLs, RFC dates, and deduplicates slugs', () => {
  const articles = parseZennArticleFeedFromJinaProxy(`Title:

Markdown Content:
### [Newest title](https://zenn.dev/rdlabo/articles/newest)

[https://zenn.dev/rdlabo/articles/newest](https://zenn.dev/rdlabo/articles/newest)

Thu, 20 Aug 2026 23:21:47 GMT

### [](https://zenn.dev/rdlabo/articles/older)

[https://zenn.dev/rdlabo/articles/older](https://zenn.dev/rdlabo/articles/older)

Tue, 18 Aug 2026 23:30:00 GMT

### [](https://zenn.dev/rdlabo/articles/newest)

[https://zenn.dev/rdlabo/articles/newest](https://zenn.dev/rdlabo/articles/newest)

Wed, 19 Aug 2026 12:00:00 GMT

### [](https://zenn.dev/rdlabo/books/example-book)

[https://zenn.dev/rdlabo/books/example-book](https://zenn.dev/rdlabo/books/example-book)

Fri, 21 Aug 2026 00:00:00 GMT
`);

  assert.deepEqual(articles, [
    {
      slug: 'newest',
      title: 'Newest title',
      url: 'https://zenn.dev/rdlabo/articles/newest',
      publishedAt: '2026-08-20T23:21:47.000Z',
      publishedDate: '2026-08-21',
    },
    {
      slug: 'older',
      title: '',
      url: 'https://zenn.dev/rdlabo/articles/older',
      publishedAt: '2026-08-18T23:30:00.000Z',
      publishedDate: '2026-08-19',
    },
  ]);
});

test('parseZennArticleApiFromJinaProxy parses article JSON from the Jina wrapper', () => {
  const article = parseZennArticleApiFromJinaProxy(`Title:

Markdown Content:
{"article":{"status":"published","title":"日本語タイトル","emoji":"🚀","body_html":"<p>本文</p>","body_letters_count":2}}
`);

  assert.equal(article.status, 'published');
  assert.equal(article.title, '日本語タイトル');
  assert.equal(article.emoji, '🚀');
  assert.equal(article.body_html, '<p>本文</p>');
});

test('resolveArticleTitle prefers feed title, then fallback, then slug', () => {
  assert.equal(resolveArticleTitle('Feed title', 'Fallback title', 'example-slug'), 'Feed title');
  assert.equal(resolveArticleTitle('  ', 'Fallback title', 'example-slug'), 'Fallback title');
  assert.equal(resolveArticleTitle('', '', 'example-slug'), 'example-slug');
});

test('extractVisibleProseFromMarkdown ignores fenced and inline code', () => {
  const markdown = `
${'これは日本語の本文です。オフライン同期について説明します。'.repeat(4)}

\`\`\`ts
const value = "english-only-code";
\`\`\`

インライン \`inlineCode()\` も無視する。
`;
  const prose = extractVisibleProseFromMarkdown(markdown);
  assert.match(prose, /日本語の本文/);
  assert.doesNotMatch(prose, /english-only-code/);
  assert.doesNotMatch(prose, /inlineCode/);
  assert.equal(classifyArticleMarkdown(markdown).verdict, 'japanese');
});

test('loadLocalZennArticles maps files by slug and preserves body markdown exactly', async () => {
  const root = await mkdtemp(join(tmpdir(), 'zenn-source-'));
  try {
    const body =
      '\nIonic Framework 9がリリースされました。\n\n```html\n<ion-select-option value="train">電車</ion-select-option>\n```\n';
    await writeFile(
      join(root, 'ionic-9-components-got-better.md'),
      `---
title: "Ionic9がリリース！"
emoji: "🚀"
type: "tech"
published: true
---${body}`,
      'utf8',
    );

    const articles = await loadLocalZennArticles(root);
    const article = articles.get('ionic-9-components-got-better');
    assert.ok(article);
    assert.equal(article.title, 'Ionic9がリリース！');
    assert.equal(article.emoji, '🚀');
    assert.equal(article.bodyMarkdown, body);

    const staged = buildStagedArticleMarkdown({
      title: article.title,
      zennSlug: article.slug,
      emoji: article.emoji,
      publishedDate: '2026-08-21',
      originalUrl: 'https://zenn.dev/rdlabo/articles/ionic-9-components-got-better',
      bodyMarkdown: article.bodyMarkdown,
    });
    assert.match(
      staged,
      /```html\n<ion-select-option value="train">電車<\/ion-select-option>\n```/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('loadExistingZennSlugs ignores explicitly selected non-Zenn sources', async () => {
  const root = await mkdtemp(join(tmpdir(), 'translated-articles-'));
  try {
    await Promise.all([
      writeFile(
        join(root, 'zenn.md'),
        '---\nzennSlug: zenn-article\n---\nTranslated body\n',
        'utf8',
      ),
      writeFile(
        join(root, 'note.md'),
        '---\nsource: note\nsourceUrl: https://note.com/rdlabo/n/nexample\n---\nTranslated body\n',
        'utf8',
      ),
    ]);

    assert.deepEqual(await loadExistingZennSlugs(root), new Set(['zenn-article']));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('parseCliArgs reads --source and validateSourceDirectory rejects missing paths', async () => {
  assert.deepEqual(parseCliArgs(['--source', '../zenn/articles']), {
    sourceDir: '../zenn/articles',
  });
  assert.throws(() => parseCliArgs(['--source']), /--source requires an articles directory path/);

  const root = await mkdtemp(join(tmpdir(), 'zenn-source-validate-'));
  try {
    const resolved = await validateSourceDirectory(root);
    assert.equal(resolved, root);
    await assert.rejects(
      () => validateSourceDirectory(join(root, 'missing')),
      /--source directory does not exist/,
    );
    const filePath = join(root, 'not-a-dir.md');
    await writeFile(filePath, 'x', 'utf8');
    await assert.rejects(
      () => validateSourceDirectory(filePath),
      /--source path is not a directory/,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
