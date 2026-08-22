import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import fm from 'front-matter';
import { JSDOM } from 'jsdom';
import TurndownService from 'turndown';
import { fetchZennArticleFeed, ZENN_USERNAME, type ZennArticleMetadata } from './zenn-articles';

export const USER_AGENT = 'rdlabo-dev/website zenn import staging';
export const ZENN_ARTICLE_API_URL = 'https://zenn.dev/api/articles';
export const ZENN_FEED_PROXY_URL = `https://r.jina.ai/http://zenn.dev/${ZENN_USERNAME}/feed?all=1`;
export const zennArticleApiProxyUrl = (slug: string) =>
  `https://r.jina.ai/http://zenn.dev/api/articles/${slug}`;
export const STAGING_ROOT = join(resolve(process.cwd()), 'tmp/zenn-import');
export const ARTICLES_ROOT = join(resolve(process.cwd()), 'projects/web-site/src/articles');
export const FETCH_CONCURRENCY = 1;
export const PLACEHOLDER_DESCRIPTION = 'TODO: Translate from Japanese.';

export const JAPANESE_ABSOLUTE_MINIMUM = 40;
export const JAPANESE_RATIO_MINIMUM = 0.12;

const JAPANESE_SCRIPT_PATTERN = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g;
const LETTER_PATTERN = /[A-Za-z\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g;

export type LanguageVerdict = 'japanese' | 'english' | 'borderline';

export interface LanguageMetrics {
  japaneseCount: number;
  letterCount: number;
  japaneseRatio: number;
}

export interface LanguageClassification extends LanguageMetrics {
  verdict: LanguageVerdict;
}

export interface ZennArticleApiRecord {
  status: string;
  title: string;
  emoji: string;
  body_html: string;
  body_letters_count: number;
}

export type InventorySource = 'local-markdown' | 'zenn-api';

export interface InventoryEntry {
  slug: string;
  title: string;
  publishedDate: string;
  reason?: string;
  metrics?: LanguageMetrics;
  status?: string;
  source?: InventorySource;
}

export interface LocalZennArticle {
  slug: string;
  title: string;
  emoji: string;
  bodyMarkdown: string;
}

export interface StageZennArticlesOptions {
  sourceDir?: string;
}

export interface ImportInventory {
  generatedAt: string;
  totals: {
    feed: number;
    staged: number;
    existing: number;
    skippedEnglish: number;
    skippedTranslation: number;
    skippedNonPublic: number;
    borderline: number;
  };
  staged: InventoryEntry[];
  existing: InventoryEntry[];
  skippedEnglish: InventoryEntry[];
  skippedTranslation: InventoryEntry[];
  skippedNonPublic: InventoryEntry[];
  borderline: InventoryEntry[];
}

interface ArticleFrontMatter {
  source?: string;
  zennSlug?: string;
}

export function extractVisibleTextFromHtml(bodyHtml: string): string {
  const document = new JSDOM(`<body>${bodyHtml}</body>`).window.document;
  for (const selector of ['script', 'style', 'pre', 'code', 'noscript']) {
    document.querySelectorAll(selector).forEach((node) => node.remove());
  }
  return document.body.textContent?.replace(/\s+/g, ' ').trim() ?? '';
}

export function countJapaneseCharacters(text: string): number {
  return [...text.matchAll(JAPANESE_SCRIPT_PATTERN)].length;
}

export function countLetters(text: string): number {
  return [...text.matchAll(LETTER_PATTERN)].length;
}

export function classifyArticleLanguage(
  text: string,
  options: {
    absoluteMinimum?: number;
    ratioMinimum?: number;
  } = {},
): LanguageClassification {
  const absoluteMinimum = options.absoluteMinimum ?? JAPANESE_ABSOLUTE_MINIMUM;
  const ratioMinimum = options.ratioMinimum ?? JAPANESE_RATIO_MINIMUM;
  const japaneseCount = countJapaneseCharacters(text);
  const letterCount = countLetters(text);
  const japaneseRatio = letterCount === 0 ? 0 : japaneseCount / letterCount;
  const belowAbsoluteMinimum = japaneseCount < absoluteMinimum;
  const belowRatioMinimum = japaneseRatio < ratioMinimum;

  let verdict: LanguageVerdict;
  if (belowAbsoluteMinimum && belowRatioMinimum) {
    verdict = 'english';
  } else if (!belowAbsoluteMinimum && !belowRatioMinimum) {
    verdict = 'japanese';
  } else {
    verdict = 'borderline';
  }

  return { verdict, japaneseCount, letterCount, japaneseRatio };
}

export function classifyArticleHtml(bodyHtml: string): LanguageClassification {
  return classifyArticleLanguage(extractVisibleTextFromHtml(bodyHtml));
}

export function extractVisibleProseFromMarkdown(markdown: string): string {
  const withoutFences = markdown.replace(/```[\s\S]*?```/g, ' ');
  const withoutInlineCode = withoutFences.replace(/`[^`\n]+`/g, ' ');
  return withoutInlineCode.replace(/\s+/g, ' ').trim();
}

export function classifyArticleMarkdown(markdown: string): LanguageClassification {
  return classifyArticleLanguage(extractVisibleProseFromMarkdown(markdown));
}

export function isTranslationArticle(title: string, body: string): boolean {
  const normalizedTitle = title.trim();
  if (/^(?:\[翻訳\]|翻訳[:：]|\[?translation\]?[:：]?)/i.test(normalizedTitle)) return true;
  if (/の翻訳(?:$|[」』】\s])/u.test(normalizedTitle)) return true;

  const introduction = body.slice(0, 1_500).replace(/\s+/g, ' ');
  return (
    /(?:この記事|本記事)は.{0,160}(?:を、?翻訳(?:、?加筆)?したもの|の翻訳(?:記事)?です)/u.test(
      introduction,
    ) || /translated from|translation of/i.test(introduction)
  );
}

export function resolveArticleTitle(
  feedTitle: string,
  fallbackTitle: string,
  slug: string,
): string {
  const fromFeed = feedTitle.trim();
  if (fromFeed) return fromFeed;
  const fromFallback = fallbackTitle.trim();
  if (fromFallback) return fromFallback;
  return slug;
}

export function extractJinaMarkdownContent(text: string): string {
  const marker = 'Markdown Content:';
  const index = text.indexOf(marker);
  if (index === -1) {
    throw new Error('Jina response is missing Markdown Content wrapper');
  }
  return text.slice(index + marker.length).trimStart();
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

const JINA_FEED_ARTICLE_PATTERN =
  /###\s*(?:\[([^\]]*)\])?\((https:\/\/zenn\.dev\/rdlabo\/articles\/([^)]+))\)[^\n]*\n(?:\s*\[[^\]]+\]\([^)]+\)\s*\n)?\s*([A-Za-z]{3},\s+\d{1,2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2}:\d{2}\s+GMT)/g;

export function parseZennArticleFeedFromJinaProxy(markdown: string): ZennArticleMetadata[] {
  const content = extractJinaMarkdownContent(markdown);
  const articles: ZennArticleMetadata[] = [];

  for (const match of content.matchAll(JINA_FEED_ARTICLE_PATTERN)) {
    const title = match[1]?.trim() ?? '';
    const url = match[2];
    const slug = match[3];
    const publishedAt = match[4];
    const published = new Date(publishedAt);
    if (Number.isNaN(published.valueOf())) {
      throw new Error(`Zenn article ${url} has an invalid pubDate: ${publishedAt}`);
    }

    articles.push({
      slug,
      title,
      url,
      publishedAt: published.toISOString(),
      publishedDate: dateInTokyo(published),
    });
  }

  const unique = new Map<string, ZennArticleMetadata>();
  for (const article of articles) {
    if (!unique.has(article.slug)) {
      unique.set(article.slug, article);
    }
  }

  return [...unique.values()].sort((left, right) =>
    right.publishedAt.localeCompare(left.publishedAt),
  );
}

export function parseZennArticleApiFromJinaProxy(text: string): ZennArticleApiRecord {
  const payload = JSON.parse(extractJinaMarkdownContent(text)) as {
    article?: ZennArticleApiRecord;
  };
  if (!payload.article) {
    throw new Error('Jina Zenn API response is missing article data');
  }
  return payload.article;
}

export function extractPreCodeText(pre: Element): string {
  const lineSpans = pre.querySelectorAll('span.line');
  if (lineSpans.length > 0) {
    return Array.from(lineSpans)
      .map((line) => line.textContent ?? '')
      .join('\n');
  }

  const code = pre.querySelector('code');
  if (code) return code.textContent ?? '';
  return pre.textContent ?? '';
}

function escapeTableCell(value: string): string {
  return value.trim().replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function tableToMarkdown(table: HTMLTableElement): string {
  const rows = Array.from(table.querySelectorAll('tr')).map((row) =>
    Array.from(row.querySelectorAll('th, td')).map((cell) =>
      escapeTableCell(cell.textContent ?? ''),
    ),
  );
  if (rows.length === 0) return '';

  const [header, ...body] = rows;
  if (!header || header.length === 0) return '';

  const separator = header.map(() => '---');
  const lines = [
    `| ${header.join(' | ')} |`,
    `| ${separator.join(' | ')} |`,
    ...body.map((cells) => `| ${cells.join(' | ')} |`),
  ];
  return `\n\n${lines.join('\n')}\n\n`;
}

function createTurndownService(): TurndownService {
  const service = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
    emDelimiter: '*',
    strongDelimiter: '**',
  });

  service.addRule('zennPre', {
    filter: (node) => node.nodeName === 'PRE',
    replacement: (_content, node) => {
      const text = extractPreCodeText(node as Element);
      return `\n\n\`\`\`\n${text}\n\`\`\`\n\n`;
    },
  });

  service.addRule('zennTable', {
    filter: 'table',
    replacement: (_content, node) => tableToMarkdown(node as HTMLTableElement),
  });

  service.addRule('zennDetails', {
    filter: 'details',
    replacement: (_content, node) => {
      const element = node as Element;
      const summary = element.querySelector('summary');
      const summaryText = summary?.textContent?.trim() ?? '';
      const clone = element.cloneNode(true) as Element;
      clone.querySelector('summary')?.remove();
      const innerMarkdown = service.turndown(clone.innerHTML).trim();
      return `\n\n<details>\n<summary>${summaryText}</summary>\n\n${innerMarkdown}\n\n</details>\n\n`;
    },
  });

  return service;
}

const turndownService = createTurndownService();

export function convertZennBodyHtmlToMarkdown(bodyHtml: string): string {
  const document = new JSDOM(`<body>${bodyHtml}</body>`).window.document;
  const markdown = turndownService.turndown(document.body.innerHTML).trim();
  return `${markdown}\n`;
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

export function buildStagedArticleMarkdown(input: {
  title: string;
  zennSlug: string;
  emoji: string;
  publishedDate: string;
  originalUrl: string;
  bodyMarkdown: string;
  description?: string;
}): string {
  const frontMatter = [
    '---',
    `title: ${yamlString(input.title)}`,
    `description: ${yamlString(input.description ?? PLACEHOLDER_DESCRIPTION)}`,
    `zennSlug: ${input.zennSlug}`,
    `emoji: ${yamlString(input.emoji)}`,
    `publishedDate: ${yamlString(input.publishedDate)}`,
    `originalUrl: ${yamlString(input.originalUrl)}`,
    '---',
    '',
  ].join('\n');

  return `${frontMatter}${input.bodyMarkdown.replace(/^\n+/, '')}`;
}

export function languageReason(metrics: LanguageMetrics): string {
  return `japaneseCount=${metrics.japaneseCount}, letterCount=${metrics.letterCount}, japaneseRatio=${metrics.japaneseRatio.toFixed(3)}`;
}

export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];

  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

export async function loadExistingZennSlugs(root = ARTICLES_ROOT): Promise<Set<string>> {
  let files: string[];
  try {
    files = (await readdir(root)).filter((file) => file.endsWith('.md'));
  } catch {
    return new Set();
  }

  const slugs = await Promise.all(
    files.map(async (file) => {
      const parsed = fm<ArticleFrontMatter>(await readFile(join(root, file), 'utf8'));
      if (parsed.attributes.source && parsed.attributes.source !== 'zenn') return undefined;
      const slug = parsed.attributes.zennSlug?.trim();
      if (!slug) {
        throw new Error(`${join(root, file)} must declare a non-empty zennSlug in front matter`);
      }
      return slug;
    }),
  );

  return new Set(slugs.filter((slug): slug is string => Boolean(slug)));
}

export async function validateSourceDirectory(sourceDir: string): Promise<string> {
  const resolved = resolve(sourceDir);
  let directoryStat;
  try {
    directoryStat = await stat(resolved);
  } catch {
    throw new Error(`--source directory does not exist: ${resolved}`);
  }
  if (!directoryStat.isDirectory()) {
    throw new Error(`--source path is not a directory: ${resolved}`);
  }
  return resolved;
}

export function parseCliArgs(argv: readonly string[]): StageZennArticlesOptions {
  const sourceIndex = argv.indexOf('--source');
  if (sourceIndex === -1) return {};

  const sourcePath = argv[sourceIndex + 1];
  if (!sourcePath || sourcePath.startsWith('-')) {
    throw new Error('--source requires an articles directory path');
  }

  return { sourceDir: sourcePath };
}

interface LocalZennFrontMatter {
  title?: string;
  emoji?: string;
}

function extractZennBodyMarkdown(raw: string): string {
  const match = raw.match(/^---\r?\n[\s\S]*?\r?\n---/);
  if (!match) return raw;
  return raw.slice(match.index! + match[0].length);
}

export async function loadLocalZennArticles(
  sourceDir: string,
): Promise<Map<string, LocalZennArticle>> {
  const resolved = await validateSourceDirectory(sourceDir);
  const files = (await readdir(resolved)).filter((file) => file.endsWith('.md'));
  const articles = new Map<string, LocalZennArticle>();

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(join(resolved, file), 'utf8');
    const parsed = fm<LocalZennFrontMatter>(raw);
    articles.set(slug, {
      slug,
      title: parsed.attributes.title?.trim() ?? '',
      emoji: parsed.attributes.emoji?.trim() ?? '',
      bodyMarkdown: extractZennBodyMarkdown(raw),
    });
  }

  return articles;
}

function parseRetryAfterMs(response: Response): number {
  const header = response.headers.get('retry-after');
  if (!header) return 1_000;

  const seconds = Number(header);
  if (!Number.isNaN(seconds)) return seconds * 1_000;

  const date = Date.parse(header);
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now());

  return 1_000;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

async function fetchDirectZennArticleDetail(slug: string): Promise<ZennArticleApiRecord | null> {
  const url = `${ZENN_ARTICLE_API_URL}/${slug}`;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await fetch(url, {
      headers: { 'user-agent': USER_AGENT },
    });

    if (response.ok) {
      const payload = (await response.json()) as { article?: ZennArticleApiRecord };
      if (!payload.article) {
        throw new Error(`Zenn article ${slug} API response is missing article data`);
      }
      return payload.article;
    }

    const retryable = response.status === 429 || response.status === 502 || response.status === 503;
    if (!retryable) {
      throw new Error(
        `Unable to fetch Zenn article ${slug} (${response.status} ${response.statusText})`,
      );
    }

    if (attempt === 1) return null;

    const retryAfterMs = parseRetryAfterMs(response);
    if (retryAfterMs > 5_000) return null;
    await sleep(retryAfterMs);
  }

  return null;
}

export async function fetchZennArticleDetailViaProxy(slug: string): Promise<ZennArticleApiRecord> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await fetch(zennArticleApiProxyUrl(slug), {
      headers: { 'user-agent': USER_AGENT },
    });
    if (response.ok) return parseZennArticleApiFromJinaProxy(await response.text());

    const retryable = response.status === 429 || response.status === 502 || response.status === 503;
    if (!retryable || attempt === 4) {
      throw new Error(
        `Unable to fetch Zenn article ${slug} via proxy (${response.status} ${response.statusText})`,
      );
    }
    const retryAfterMs = parseRetryAfterMs(response);
    await sleep(Math.min(Math.max(retryAfterMs, 2_000 * 2 ** attempt), 20_000));
  }

  throw new Error(`Unable to fetch Zenn article ${slug} via proxy`);
}

export async function fetchZennArticleDetail(slug: string): Promise<ZennArticleApiRecord> {
  const direct = await fetchDirectZennArticleDetail(slug);
  if (direct) return direct;
  return fetchZennArticleDetailViaProxy(slug);
}

function inventoryEntry(
  metadata: ZennArticleMetadata,
  extra: Partial<InventoryEntry> = {},
): InventoryEntry {
  return {
    slug: metadata.slug,
    title: metadata.title,
    publishedDate: metadata.publishedDate,
    ...extra,
  };
}

async function fetchZennArticleFeedViaProxy(): Promise<ZennArticleMetadata[]> {
  const response = await fetch(ZENN_FEED_PROXY_URL, {
    headers: { 'user-agent': USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(
      `Unable to fetch Zenn RSS via proxy (${response.status} ${response.statusText})`,
    );
  }
  return parseZennArticleFeedFromJinaProxy(await response.text());
}

export async function fetchZennArticleFeedWithFallback(): Promise<ZennArticleMetadata[]> {
  try {
    return await fetchZennArticleFeed();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const retryable =
      message.includes('429') ||
      message.includes('503') ||
      message.includes('502') ||
      message.includes('Unable to fetch Zenn RSS');
    if (!retryable) throw error;
    return fetchZennArticleFeedViaProxy();
  }
}

function recordLanguageSkip(
  inventory: ImportInventory,
  metadata: ZennArticleMetadata,
  title: string,
  classification: LanguageClassification,
  source: InventorySource,
): void {
  const metrics = {
    japaneseCount: classification.japaneseCount,
    letterCount: classification.letterCount,
    japaneseRatio: classification.japaneseRatio,
  };

  if (classification.verdict === 'english') {
    inventory.skippedEnglish.push(
      inventoryEntry(metadata, {
        title,
        metrics,
        reason: languageReason(metrics),
        source,
      }),
    );
    return;
  }

  if (classification.verdict === 'borderline') {
    inventory.borderline.push(
      inventoryEntry(metadata, {
        title,
        metrics,
        reason: languageReason(metrics),
        source,
      }),
    );
  }
}

export async function stageZennArticles(
  options: StageZennArticlesOptions = {},
): Promise<ImportInventory> {
  await rm(STAGING_ROOT, { recursive: true, force: true });
  await mkdir(STAGING_ROOT, { recursive: true });

  const localArticles = options.sourceDir
    ? await loadLocalZennArticles(options.sourceDir)
    : new Map<string, LocalZennArticle>();

  const [feedArticles, existingSlugs] = await Promise.all([
    fetchZennArticleFeedWithFallback(),
    loadExistingZennSlugs(),
  ]);

  const inventory: ImportInventory = {
    generatedAt: new Date().toISOString(),
    totals: {
      feed: feedArticles.length,
      staged: 0,
      existing: 0,
      skippedEnglish: 0,
      skippedTranslation: 0,
      skippedNonPublic: 0,
      borderline: 0,
    },
    staged: [],
    existing: [],
    skippedEnglish: [],
    skippedTranslation: [],
    skippedNonPublic: [],
    borderline: [],
  };

  const candidates = feedArticles.filter((article) => {
    if (existingSlugs.has(article.slug)) {
      inventory.existing.push(
        inventoryEntry(article, { reason: 'already translated in projects/web-site/src/articles' }),
      );
      return false;
    }
    return true;
  });

  const localCandidates = candidates.filter((metadata) => localArticles.has(metadata.slug));
  const apiCandidates = candidates.filter((metadata) => !localArticles.has(metadata.slug));

  for (const metadata of localCandidates) {
    const local = localArticles.get(metadata.slug);
    if (!local) continue;

    const title = resolveArticleTitle(metadata.title, local.title, metadata.slug);
    if (isTranslationArticle(title, local.bodyMarkdown)) {
      inventory.skippedTranslation.push(
        inventoryEntry(metadata, {
          title,
          reason: 'Japanese article translates an existing non-Japanese source',
          source: 'local-markdown',
        }),
      );
      continue;
    }
    const classification = classifyArticleMarkdown(local.bodyMarkdown);
    const metrics = {
      japaneseCount: classification.japaneseCount,
      letterCount: classification.letterCount,
      japaneseRatio: classification.japaneseRatio,
    };

    if (classification.verdict !== 'japanese') {
      recordLanguageSkip(inventory, metadata, title, classification, 'local-markdown');
      continue;
    }

    const stagedMarkdown = buildStagedArticleMarkdown({
      title,
      zennSlug: metadata.slug,
      emoji: local.emoji || '✦',
      publishedDate: metadata.publishedDate,
      originalUrl: metadata.url,
      bodyMarkdown: local.bodyMarkdown,
    });

    await writeFile(join(STAGING_ROOT, `${metadata.slug}.md`), stagedMarkdown, 'utf8');
    inventory.staged.push(
      inventoryEntry(metadata, {
        title,
        reason: languageReason(metrics),
        metrics,
        source: 'local-markdown',
      }),
    );
  }

  const apiDetails = await mapWithConcurrency(
    apiCandidates,
    FETCH_CONCURRENCY,
    async (metadata) => ({
      metadata,
      detail: await fetchZennArticleDetail(metadata.slug),
    }),
  );

  for (const { metadata, detail } of apiDetails) {
    const title = resolveArticleTitle(metadata.title, detail.title, metadata.slug);

    if (detail.status !== 'published') {
      inventory.skippedNonPublic.push(
        inventoryEntry(metadata, {
          title,
          status: detail.status,
          reason: `status is ${detail.status}`,
        }),
      );
      continue;
    }

    const visibleText = extractVisibleTextFromHtml(detail.body_html);
    if (isTranslationArticle(title, visibleText)) {
      inventory.skippedTranslation.push(
        inventoryEntry(metadata, {
          title,
          reason: 'Japanese article translates an existing non-Japanese source',
          source: 'zenn-api',
        }),
      );
      continue;
    }

    const classification = classifyArticleHtml(detail.body_html);
    const metrics = {
      japaneseCount: classification.japaneseCount,
      letterCount: classification.letterCount,
      japaneseRatio: classification.japaneseRatio,
    };

    if (classification.verdict !== 'japanese') {
      recordLanguageSkip(inventory, metadata, title, classification, 'zenn-api');
      continue;
    }

    const stagedMarkdown = buildStagedArticleMarkdown({
      title,
      zennSlug: metadata.slug,
      emoji: detail.emoji || '✦',
      publishedDate: metadata.publishedDate,
      originalUrl: metadata.url,
      bodyMarkdown: convertZennBodyHtmlToMarkdown(detail.body_html),
    });

    await writeFile(join(STAGING_ROOT, `${metadata.slug}.md`), stagedMarkdown, 'utf8');
    inventory.staged.push(
      inventoryEntry(metadata, {
        title,
        reason: languageReason(metrics),
        metrics,
        source: 'zenn-api',
      }),
    );
  }

  inventory.totals.existing = inventory.existing.length;
  inventory.totals.skippedNonPublic = inventory.skippedNonPublic.length;
  inventory.totals.skippedEnglish = inventory.skippedEnglish.length;
  inventory.totals.skippedTranslation = inventory.skippedTranslation.length;
  inventory.totals.borderline = inventory.borderline.length;
  inventory.totals.staged = inventory.staged.length;

  await writeFile(
    join(STAGING_ROOT, 'inventory.json'),
    `${JSON.stringify(inventory, null, 2)}\n`,
    'utf8',
  );

  return inventory;
}

const executedDirectly =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (executedDirectly) {
  void (async () => {
    try {
      const options = parseCliArgs(process.argv.slice(2));
      await stageZennArticles(options);
    } catch (error: unknown) {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  })();
}
