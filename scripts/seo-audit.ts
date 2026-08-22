import { access, constants, readFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import { isValidContentUpdatedAt } from './seo-dates';

export interface SeoAuditTarget {
  name: string;
  origin: string;
  sitemapPath: string;
  browserRoot: string;
  bilingual: boolean;
}

export interface SitemapUrlEntry {
  loc: string;
  lastmod?: string;
}

const DEFAULT_TARGETS: readonly SeoAuditTarget[] = [
  {
    name: 'docs',
    origin: 'https://docs.rdlabo.dev',
    sitemapPath: 'dist/docs/browser/sitemap.xml',
    browserRoot: 'dist/docs/browser',
    bilingual: true,
  },
  {
    name: 'web-site',
    origin: 'https://rdlabo.dev',
    sitemapPath: 'dist/web-site/browser/sitemap.xml',
    browserRoot: 'dist/web-site/browser',
    bilingual: false,
  },
];

export function parseSitemap(xml: string): SitemapUrlEntry[] {
  const document = new JSDOM(xml, { contentType: 'text/xml' }).window.document;
  const parserError = document.querySelector('parsererror');
  if (parserError) {
    throw new Error(`Invalid sitemap XML: ${parserError.textContent?.trim() ?? 'parser error'}`);
  }

  return [...document.querySelectorAll('url')].map((entry) => {
    const loc = entry.querySelector('loc')?.textContent?.trim() ?? '';
    const lastmod = entry.querySelector('lastmod')?.textContent?.trim() || undefined;
    return { loc, lastmod };
  });
}

const REQUIRED_HREFLANG = ['en', 'ja', 'x-default'] as const;
const ALLOWED_HREFLANG = new Set<string>(REQUIRED_HREFLANG);

export function normalizePublicUrl(origin: string, url: string): string {
  const parsed = new URL(url, origin);
  if (parsed.origin !== origin) return url;
  parsed.hash = '';
  parsed.search = '';
  return normalizePublicUrlPathname(parsed);
}

export function normalizeCanonicalUrl(origin: string, url: string): string {
  const parsed = new URL(url, origin);
  if (parsed.origin !== origin) return url;
  return normalizePublicUrlPathname(parsed);
}

function normalizePublicUrlPathname(parsed: URL): string {
  if (parsed.pathname.endsWith('/') && parsed.pathname !== '/') {
    parsed.pathname = parsed.pathname.slice(0, -1);
  }
  return parsed.toString();
}

export function auditHreflangKeys(pageUrl: string, byLang: ReadonlyMap<string, string>): string[] {
  const errors: string[] = [];
  for (const lang of byLang.keys()) {
    if (!ALLOWED_HREFLANG.has(lang)) {
      errors.push(`${pageUrl}: unexpected hreflang="${lang}" alternate link`);
    }
  }
  for (const lang of REQUIRED_HREFLANG) {
    if (!byLang.has(lang)) {
      errors.push(`${pageUrl}: missing hreflang="${lang}" alternate link`);
    }
  }
  return errors;
}

export function validateHreflangAlternateLang(
  pageUrl: string,
  rawLang: string | null,
): string | undefined {
  const lang = rawLang?.trim() ?? '';
  if (!lang) {
    return `${pageUrl}: hreflang alternate link must not have an empty hreflang attribute`;
  }
  return undefined;
}

export function validateHreflangAlternateHref(
  pageUrl: string,
  lang: string,
  rawHref: string | null,
): { ok: true; href: string } | { ok: false; error: string } {
  const href = rawHref?.trim() ?? '';
  if (!href) {
    return {
      ok: false,
      error: `${pageUrl}: hreflang="${lang}" alternate href must not be empty`,
    };
  }
  if (href.startsWith('//')) {
    return {
      ok: false,
      error: `${pageUrl}: hreflang="${lang}" alternate href must be a fully-qualified HTTPS URL (got protocol-relative "${href}")`,
    };
  }
  if (!/^https:\/\//i.test(href)) {
    if (/^http:/i.test(href)) {
      return {
        ok: false,
        error: `${pageUrl}: hreflang="${lang}" alternate href must use HTTPS (got "${href}")`,
      };
    }
    return {
      ok: false,
      error: `${pageUrl}: hreflang="${lang}" alternate href must be a fully-qualified HTTPS URL (got "${href}")`,
    };
  }
  let parsed: URL;
  try {
    parsed = new URL(href);
  } catch {
    return {
      ok: false,
      error: `${pageUrl}: hreflang="${lang}" alternate href must be a fully-qualified HTTPS URL (got "${href}")`,
    };
  }
  if (parsed.protocol !== 'https:') {
    return {
      ok: false,
      error: `${pageUrl}: hreflang="${lang}" alternate href must use HTTPS (got "${href}")`,
    };
  }
  return { ok: true, href: parsed.toString() };
}

export function extractHreflangAlternates(
  document: Document,
  pageUrl: string,
  origin: string,
): { byLang: Map<string, string>; errors: string[] } {
  const errors: string[] = [];
  const byLang = new Map<string, string>();

  for (const link of document.querySelectorAll('link[rel="alternate"][hreflang]')) {
    const langError = validateHreflangAlternateLang(pageUrl, link.getAttribute('hreflang'));
    if (langError) {
      errors.push(langError);
      continue;
    }
    const lang = link.getAttribute('hreflang')!.trim();

    if (byLang.has(lang)) {
      errors.push(`${pageUrl}: duplicate hreflang="${lang}" alternate link`);
      continue;
    }

    const hrefResult = validateHreflangAlternateHref(pageUrl, lang, link.getAttribute('href'));
    if (!hrefResult.ok) {
      errors.push(hrefResult.error);
      continue;
    }

    byLang.set(lang, normalizeCanonicalUrl(origin, hrefResult.href));
  }

  return { byLang, errors };
}

function auditBilingualHreflangMetadata(
  pageUrl: string,
  origin: string,
  byLang: ReadonlyMap<string, string>,
): string[] {
  const errors: string[] = [];
  errors.push(...auditHreflangKeys(pageUrl, byLang));
  const english = byLang.get('en');
  const japanese = byLang.get('ja');
  const defaultHref = byLang.get('x-default');
  if (
    english &&
    defaultHref &&
    normalizeCanonicalUrl(origin, english) !== normalizeCanonicalUrl(origin, defaultHref)
  ) {
    errors.push(`${pageUrl}: x-default alternate must match the English URL`);
  }
  const pagePath = new URL(pageUrl).pathname;
  const isJapanesePage = pagePath === '/ja' || pagePath.startsWith('/ja/');
  if (
    isJapanesePage &&
    japanese &&
    normalizeCanonicalUrl(origin, japanese) !== normalizeCanonicalUrl(origin, pageUrl)
  ) {
    errors.push(`${pageUrl}: Japanese canonical/hreflang mismatch`);
  }
  if (
    !isJapanesePage &&
    english &&
    normalizeCanonicalUrl(origin, english) !== normalizeCanonicalUrl(origin, pageUrl)
  ) {
    errors.push(`${pageUrl}: English canonical/hreflang mismatch`);
  }
  return errors;
}

export function resolveInternalSitemapLink(
  origin: string,
  fromUrl: string,
  href: string,
  sitemapLocs: ReadonlySet<string>,
): string | undefined {
  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith('#') ||
    /^mailto:/i.test(trimmed) ||
    /^tel:/i.test(trimmed) ||
    /^javascript:/i.test(trimmed)
  ) {
    return undefined;
  }

  let resolved: URL;
  try {
    resolved = new URL(trimmed, fromUrl);
  } catch {
    return undefined;
  }

  if (resolved.origin !== origin) return undefined;

  const normalized = normalizePublicUrl(origin, resolved.toString());
  return sitemapLocs.has(normalized) ? normalized : undefined;
}

export function collectInternalSitemapLinks(
  origin: string,
  fromUrl: string,
  document: Document,
  sitemapLocs: ReadonlySet<string>,
): string[] {
  const targets = new Set<string>();
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    const target = resolveInternalSitemapLink(
      origin,
      fromUrl,
      anchor.getAttribute('href') ?? '',
      sitemapLocs,
    );
    if (target) targets.add(target);
  }
  return [...targets];
}

export function auditDuplicateMetadata(
  origin: string,
  valuesByLang: ReadonlyMap<string, ReadonlyMap<string, readonly string[]>>,
  label: 'document title' | 'meta description',
): string[] {
  const errors: string[] = [];
  for (const [lang, byValue] of valuesByLang) {
    for (const [value, urls] of byValue) {
      if (!value || urls.length < 2) continue;
      errors.push(`${origin} (${lang}): duplicate ${label} "${value}" on ${urls.join(', ')}`);
    }
  }
  return errors;
}

export function auditOrphanSitemapPages(
  origin: string,
  inboundLinks: ReadonlyMap<string, ReadonlySet<string>>,
  sitemapLocs: ReadonlySet<string>,
): string[] {
  const rootUrl = normalizePublicUrl(origin, `${origin}/`);
  const errors: string[] = [];
  for (const loc of sitemapLocs) {
    if (loc === rootUrl) continue;
    const inbound = inboundLinks.get(loc);
    if (!inbound || inbound.size === 0) {
      errors.push(`${loc}: orphan sitemap page with no inbound internal links`);
    }
  }
  return errors;
}

export function sitemapUrlToHtmlPath(origin: string, url: string, browserRoot: string): string {
  const parsed = new URL(url);
  if (parsed.origin !== origin) {
    throw new Error(`Expected ${origin} URL, received ${url}`);
  }

  let pathname = parsed.pathname;
  if (pathname.endsWith('/') && pathname !== '/') {
    pathname = pathname.slice(0, -1);
  }

  if (origin === 'https://docs.rdlabo.dev') {
    if (pathname === '' || pathname === '/') {
      return join(browserRoot, 'index.html');
    }
    if (pathname === '/ja') {
      return join(browserRoot, 'ja', 'index.html');
    }
    if (pathname.startsWith('/ja/')) {
      return join(browserRoot, pathname.slice(1), 'index.html');
    }
    return join(browserRoot, pathname.slice(1), 'index.html');
  }

  if (pathname === '' || pathname === '/') {
    return join(browserRoot, 'index.html');
  }
  return join(browserRoot, pathname.slice(1), 'index.html');
}

export function htmlPathToPublicUrl(origin: string, htmlPath: string, browserRoot: string): string {
  const relativePath = relative(browserRoot, htmlPath).replace(/\\/g, '/');
  if (relativePath === 'index.html') return `${origin}/`;
  const withoutIndex = relativePath.replace(/\/index\.html$/, '');
  if (origin === 'https://docs.rdlabo.dev' && withoutIndex === 'ja') {
    return `${origin}/ja`;
  }
  return `${origin}/${withoutIndex}`;
}

function auditJsonLd(document: Document, pageUrl: string): string[] {
  const errors: string[] = [];
  for (const [index, block] of [
    ...document.querySelectorAll('script[type="application/ld+json"]'),
  ].entries()) {
    const raw = block.textContent?.trim();
    if (!raw) {
      errors.push(`${pageUrl}: JSON-LD block ${index + 1} is empty`);
      continue;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      errors.push(
        `${pageUrl}: JSON-LD block ${index + 1} is invalid JSON (${error instanceof Error ? error.message : error})`,
      );
      continue;
    }
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    for (const [nodeIndex, node] of nodes.entries()) {
      if (!node || typeof node !== 'object' || Array.isArray(node)) {
        errors.push(
          `${pageUrl}: JSON-LD block ${index + 1} node ${nodeIndex + 1} must be an object`,
        );
        continue;
      }
      const type = (node as { '@type'?: unknown })['@type'];
      if (typeof type !== 'string' || !type.trim()) {
        errors.push(
          `${pageUrl}: JSON-LD block ${index + 1} node ${nodeIndex + 1} is missing a string @type`,
        );
      }
    }
  }
  return errors;
}

export function auditHtmlPage(
  html: string,
  pageUrl: string,
  options: { bilingual: boolean; hreflangByLang?: ReadonlyMap<string, string> },
): string[] {
  const document = new JSDOM(html).window.document;
  const errors: string[] = [];
  const origin = new URL(pageUrl).origin;
  const titles = [...document.querySelectorAll('title')];
  const descriptions = [...document.querySelectorAll('meta[name="description"]')];
  const canonicals = [...document.querySelectorAll('link[rel="canonical"]')];

  if (titles.length !== 1) {
    errors.push(`${pageUrl}: expected exactly one <title>, found ${titles.length}`);
  } else if (!titles[0]?.textContent?.trim()) {
    errors.push(`${pageUrl}: <title> must not be empty`);
  }

  if (descriptions.length !== 1) {
    errors.push(`${pageUrl}: expected exactly one meta description, found ${descriptions.length}`);
  } else if (!descriptions[0]?.getAttribute('content')?.trim()) {
    errors.push(`${pageUrl}: meta description must not be empty`);
  }

  if (canonicals.length !== 1) {
    errors.push(`${pageUrl}: expected exactly one canonical link, found ${canonicals.length}`);
  } else {
    const canonicalHref = canonicals[0]?.getAttribute('href')?.trim() ?? '';
    if (!canonicalHref) {
      errors.push(`${pageUrl}: canonical href must not be empty`);
    } else {
      const expected = normalizeCanonicalUrl(origin, pageUrl);
      const canonical = normalizeCanonicalUrl(origin, canonicalHref);
      if (canonical !== expected) {
        errors.push(
          `${pageUrl}: canonical mismatch (expected ${expected}, got ${canonical || 'empty'})`,
        );
      }
    }
  }

  if (options.bilingual) {
    let byLang: ReadonlyMap<string, string>;
    if (options.hreflangByLang) {
      byLang = options.hreflangByLang;
    } else {
      const extracted = extractHreflangAlternates(document, pageUrl, origin);
      errors.push(...extracted.errors);
      byLang = extracted.byLang;
    }
    errors.push(...auditBilingualHreflangMetadata(pageUrl, origin, byLang));
  }

  errors.push(...auditJsonLd(document, pageUrl));
  return errors;
}

export function auditSitemapEntries(entries: readonly SitemapUrlEntry[], origin: string): string[] {
  const errors: string[] = [];
  const locs = entries.map((entry) => entry.loc);
  const duplicates = locs.filter((loc, index) => locs.indexOf(loc) !== index);
  for (const loc of new Set(duplicates)) {
    errors.push(`${origin}: duplicate sitemap loc ${loc}`);
  }

  for (const entry of entries) {
    if (!entry.loc) {
      errors.push(`${origin}: sitemap entry is missing <loc>`);
      continue;
    }
    if (entry.lastmod !== undefined && !isValidContentUpdatedAt(entry.lastmod)) {
      errors.push(`${origin}: invalid or future lastmod ${entry.lastmod} for ${entry.loc}`);
    }
  }

  return errors;
}

function serializeHreflangMap(map: ReadonlyMap<string, string>): string {
  return [...map.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([lang, href]) => `${lang}=${href}`)
    .join('|');
}

export function auditHtmlHreflangReciprocity(
  hreflangByPage: ReadonlyMap<string, ReadonlyMap<string, string>>,
  sitemapLocs: ReadonlySet<string>,
): string[] {
  const errors: string[] = [];

  for (const [pageUrl, byLang] of hreflangByPage) {
    errors.push(...auditHreflangKeys(pageUrl, byLang));
    for (const [lang, href] of byLang) {
      if (!sitemapLocs.has(href)) {
        errors.push(
          `${pageUrl}: hreflang="${lang}" must point to a sitemap-listed URL (got ${href})`,
        );
      }
    }
    const english = byLang.get('en');
    const japanese = byLang.get('ja');
    const defaultHref = byLang.get('x-default');
    if (english && defaultHref && english !== defaultHref) {
      errors.push(`${pageUrl}: x-default alternate must match the English URL`);
    }
    if (!english || !japanese) continue;

    const englishMap = hreflangByPage.get(english);
    const japaneseMap = hreflangByPage.get(japanese);
    if (!englishMap) {
      errors.push(`${pageUrl}: hreflang="en" target ${english} is not a sitemap-listed page`);
    }
    if (!japaneseMap) {
      errors.push(`${pageUrl}: hreflang="ja" target ${japanese} is not a sitemap-listed page`);
    }
    if (!englishMap || !japaneseMap) continue;

    const serialized = serializeHreflangMap(byLang);
    if (serializeHreflangMap(englishMap) !== serialized) {
      errors.push(`${pageUrl}: hreflang mapping is not reciprocal with ${english}`);
    }
    if (serializeHreflangMap(japaneseMap) !== serialized) {
      errors.push(`${pageUrl}: hreflang mapping is not reciprocal with ${japanese}`);
    }
  }

  return errors;
}

export async function auditSite(
  target: SeoAuditTarget,
  root = resolve(process.cwd()),
): Promise<string[]> {
  const errors: string[] = [];
  const sitemapPath = join(root, target.sitemapPath);
  const browserRoot = join(root, target.browserRoot);
  const sitemapXml = await readFile(sitemapPath, 'utf8');
  const entries = parseSitemap(sitemapXml);
  errors.push(...auditSitemapEntries(entries, target.origin));

  const sitemapLocs = new Set(entries.map((entry) => normalizePublicUrl(target.origin, entry.loc)));
  const titlesByLang = new Map<string, Map<string, string[]>>();
  const descriptionsByLang = new Map<string, Map<string, string[]>>();
  const inboundLinks = new Map<string, Set<string>>();
  const hreflangByPage = new Map<string, Map<string, string>>();

  for (const entry of entries) {
    const pageUrl = normalizePublicUrl(target.origin, entry.loc);
    const htmlPath = sitemapUrlToHtmlPath(target.origin, pageUrl, browserRoot);
    try {
      await access(htmlPath, constants.F_OK);
    } catch {
      errors.push(`${pageUrl}: sitemap URL missing built HTML at ${relative(root, htmlPath)}`);
      continue;
    }
    const html = await readFile(htmlPath, 'utf8');
    const document = new JSDOM(html).window.document;
    let hreflangByLang: Map<string, string> | undefined;
    if (target.bilingual) {
      const extracted = extractHreflangAlternates(document, pageUrl, target.origin);
      errors.push(...extracted.errors);
      hreflangByLang = extracted.byLang;
      hreflangByPage.set(pageUrl, extracted.byLang);
    }
    errors.push(
      ...auditHtmlPage(html, pageUrl, {
        bilingual: target.bilingual,
        hreflangByLang,
      }),
    );
    const lang = document.documentElement.lang || 'unknown';
    const title = document.querySelector('title')?.textContent?.trim() ?? '';
    const description =
      document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';

    const byTitle = titlesByLang.get(lang) ?? new Map<string, string[]>();
    byTitle.set(title, [...(byTitle.get(title) ?? []), pageUrl]);
    titlesByLang.set(lang, byTitle);

    const byDescription = descriptionsByLang.get(lang) ?? new Map<string, string[]>();
    byDescription.set(description, [...(byDescription.get(description) ?? []), pageUrl]);
    descriptionsByLang.set(lang, byDescription);

    for (const targetUrl of collectInternalSitemapLinks(
      target.origin,
      pageUrl,
      document,
      sitemapLocs,
    )) {
      if (targetUrl === pageUrl) continue;
      const inbound = inboundLinks.get(targetUrl) ?? new Set<string>();
      inbound.add(pageUrl);
      inboundLinks.set(targetUrl, inbound);
    }
  }

  errors.push(...auditDuplicateMetadata(target.origin, titlesByLang, 'document title'));
  errors.push(...auditDuplicateMetadata(target.origin, descriptionsByLang, 'meta description'));
  errors.push(...auditOrphanSitemapPages(target.origin, inboundLinks, sitemapLocs));
  if (target.bilingual) {
    errors.push(...auditHtmlHreflangReciprocity(hreflangByPage, sitemapLocs));
  }

  return errors;
}

export async function runSeoAudit(options?: {
  root?: string;
  targets?: readonly SeoAuditTarget[];
}): Promise<string[]> {
  const root = options?.root ?? resolve(process.cwd());
  const targets = options?.targets ?? DEFAULT_TARGETS;
  const errors: string[] = [];

  for (const target of targets) {
    try {
      await access(join(root, target.sitemapPath), constants.F_OK);
      await access(join(root, target.browserRoot), constants.F_OK);
    } catch {
      errors.push(
        `${target.name}: build output is missing (${target.sitemapPath} or ${target.browserRoot})`,
      );
      continue;
    }
    errors.push(...(await auditSite(target, root)));
  }

  return errors;
}

async function main(): Promise<void> {
  const errors = await runSeoAudit();
  if (errors.length === 0) {
    console.log('SEO audit passed.');
    return;
  }
  console.error(`SEO audit failed with ${errors.length} issue(s):\n`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
