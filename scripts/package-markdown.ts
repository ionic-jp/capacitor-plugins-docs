import { splitDocgenReadme } from './docgen-readme';

const LANDING_START = /^## Overview[ \t]*$/m;
const LANDING_END = /^## Index[ \t]*$/m;
const OMIT_OPEN = /<!--\s*rdlabo-docs-omit\s*-->/;
const OMIT_CLOSE = /<!--\s*\/rdlabo-docs-omit\s*-->/;

function firstMatch(
  pattern: RegExp,
  markdown: string,
  from: number,
): { index: number; length: number } | undefined {
  const match = markdown.slice(from).match(pattern);
  if (!match || match.index === undefined) return undefined;
  return { index: from + match.index, length: match[0].length };
}

/**
 * Drops README regions wrapped in `<!-- rdlabo-docs-omit -->` … `<!-- /rdlabo-docs-omit -->`.
 * The markers are HTML comments, so GitHub still shows the content between them.
 * Markers inside fenced code blocks are ignored; omit regions may contain fences.
 */
export function stripRdlaboDocsOmit(markdown: string): string {
  let i = 0;
  let inFence = false;
  let output = '';
  while (i < markdown.length) {
    if (inFence) {
      const end = markdown.indexOf('```', i);
      if (end < 0) {
        output += markdown.slice(i);
        break;
      }
      output += markdown.slice(i, end + 3);
      i = end + 3;
      inFence = false;
      continue;
    }

    const fenceAt = markdown.indexOf('```', i);
    const open = firstMatch(OMIT_OPEN, markdown, i);
    const close = firstMatch(OMIT_CLOSE, markdown, i);
    const nextFence = fenceAt < 0 ? Number.POSITIVE_INFINITY : fenceAt;
    const nextOpen = open?.index ?? Number.POSITIVE_INFINITY;
    const nextClose = close?.index ?? Number.POSITIVE_INFINITY;
    const next = Math.min(nextFence, nextOpen, nextClose);
    if (next === Number.POSITIVE_INFINITY) {
      output += markdown.slice(i);
      break;
    }
    if (next === nextFence) {
      output += markdown.slice(i, nextFence + 3);
      i = nextFence + 3;
      inFence = true;
      continue;
    }
    if (next === nextClose) {
      throw new Error('rdlabo-docs-omit close marker without an open marker');
    }
    output += markdown.slice(i, nextOpen);
    const afterOpen = nextOpen + (open?.length ?? 0);
    const closeInner = firstMatch(OMIT_CLOSE, markdown, afterOpen);
    if (!closeInner) {
      throw new Error('unclosed rdlabo-docs-omit block');
    }
    i = closeInner.index + closeInner.length;
  }
  return output
    .replace(/^\s+/, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+$/, '\n');
}

function landingFromOverview(markdown: string): string | undefined {
  const start = markdown.search(LANDING_START);
  if (start < 0) return undefined;
  const rest = markdown.slice(start);
  const end = rest.search(LANDING_END);
  return (end < 0 ? rest : rest.slice(0, end)).trim();
}

export function extractPackageReadmeParts(markdown: string): { readme: string; api?: string } {
  const stripped = stripLeadingH1(stripRdlaboDocsOmit(markdown));
  const landing = (landingFromOverview(stripped) ?? stripped).trim();
  if (!landing) {
    throw new Error('package README is empty after rdlabo-docs-omit');
  }
  const split = splitDocgenReadme(`${landing}\n`);
  return {
    readme: `${(split?.readme ?? landing).trim()}\n`,
    api: split?.api,
  };
}

export function extractPackageReadme(markdown: string): string {
  return extractPackageReadmeParts(markdown).readme;
}

export function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^# [^\n]+\r?\n+/, '');
}

export function apiAnchorFragments(api: Map<string, string>): Map<string, string> {
  const fragments = new Map<string, string>();
  for (const [name, markdown] of api) {
    const heading = markdown.match(/^#### `([^`]+)` (.+)$/m);
    if (!heading) continue;
    const kindSlug = heading[1].replaceAll(' ', '-');
    fragments.set(name.toLowerCase(), `${kindSlug}-${heading[2]}`.toLowerCase());
  }
  return fragments;
}

const LEGACY_GITHUB_OWNER = ['rdlabo', 'team'].join('-');

export function normalizePackageMarkdown(markdown: string): string {
  return markdown
    .replaceAll(`https://github.com/${LEGACY_GITHUB_OWNER}/`, 'https://github.com/rdlabo-dev/')
    .replaceAll(`${LEGACY_GITHUB_OWNER}/`, 'rdlabo-dev/');
}

export function rewritePackageDocLinks(
  markdown: string,
  apiAnchors: Map<string, string>,
  landingSlug = 'readme',
): string {
  return markdown.replace(/\]\((?!https?:|mailto:)([^)]+)\)/g, (match, target: string) => {
    const hashIndex = target.indexOf('#');
    const path = hashIndex < 0 ? target : target.slice(0, hashIndex);
    const hash = hashIndex < 0 ? '' : target.slice(hashIndex);
    const hashId = hash.slice(1).toLowerCase();

    if (!path || path === '../README.md' || path === './README.md') {
      if (hashId === 'api') return '](/docs/api)';
      const apiFragment = hashId ? apiAnchors.get(hashId) : undefined;
      if (apiFragment) return `](/docs/api#${apiFragment})`;
      return `](/docs/${landingSlug}${hash})`;
    }

    const docFile = path.match(/^(?:\.\.\/)?(?:\.\/)?(?:docs\/)?((?:[a-z0-9-]+\/)*[a-z0-9-]+)\.md$/i);
    if (docFile) return `](/docs/${docFile[1]}${hash})`;
    return match;
  });
}
