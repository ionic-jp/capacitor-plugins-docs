import { access } from 'node:fs/promises';
import { join } from 'node:path';

export interface RepositoryCoordinates {
  owner: string;
  repo: string;
}

export const DOCS_PORTAL_REPOSITORY_URL = 'https://github.com/rdlabo-dev/docs';
export const DOCS_PORTAL_REF = 'main';

const portalDocsRoot = join(process.cwd(), 'src');

async function portalEnglishTrackedLocally(
  sourceDirectory: string,
  file: string,
): Promise<boolean> {
  try {
    await access(join(portalDocsRoot, sourceDirectory, 'docs', file));
    return true;
  } catch {
    return false;
  }
}

export interface FetchedEnglishMarkdown {
  content: string;
  repositoryPath: string;
  repositoryRef: string;
  repositoryUrl: string;
}

export function parseRepositoryUrl(repositoryUrl: string): RepositoryCoordinates {
  const match = repositoryUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/);
  if (!match) {
    throw new Error(`Unsupported repository URL: ${repositoryUrl}`);
  }
  return { owner: match[1], repo: match[2] };
}

export function repositoryRawUrl(repositoryUrl: string, ref: string, path: string): string {
  const { owner, repo } = parseRepositoryUrl(repositoryUrl);
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${path}`;
}

export function repositorySourceLabel(repositoryUrl: string, ref: string, path: string): string {
  const { owner, repo } = parseRepositoryUrl(repositoryUrl);
  return `${owner}/${repo}@${ref}/${path}`;
}

export async function fetchRepositoryFile(
  repositoryUrl: string,
  ref: string,
  path: string,
  cache = new Map<string, string>(),
): Promise<string | undefined> {
  const key = `${repositoryUrl}@${ref}:${path}`;
  if (cache.has(key)) {
    return cache.get(key);
  }

  const response = await fetch(repositoryRawUrl(repositoryUrl, ref, path));
  if (response.status === 404) {
    return undefined;
  }
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${repositorySourceLabel(repositoryUrl, ref, path)}: HTTP ${response.status}`,
    );
  }

  const content = await response.text();
  cache.set(key, content);
  return content;
}

async function fetchFirstRepositoryPath(
  repositoryUrl: string,
  ref: string,
  paths: readonly string[],
  cache: Map<string, string>,
): Promise<FetchedEnglishMarkdown | undefined> {
  for (const repositoryPath of paths) {
    const content = await fetchRepositoryFile(repositoryUrl, ref, repositoryPath, cache);
    if (content !== undefined) {
      return { content, repositoryPath, repositoryRef: ref, repositoryUrl };
    }
  }
  return undefined;
}

function packageEnglishPaths(sourceDirectory: string, file: string): string[] {
  return [`docs/${file}`, `${sourceDirectory}/docs/${file}`];
}

export async function fetchEnglishProjectMarkdown(
  project: {
    repositoryUrl: string;
    englishDocsRef?: string;
    packageName: string;
    sourceDirectory: string;
  },
  file: string,
  cache = new Map<string, string>(),
): Promise<FetchedEnglishMarkdown> {
  const ref = project.englishDocsRef ?? 'main';
  const fromPackage = await fetchFirstRepositoryPath(
    project.repositoryUrl,
    ref,
    packageEnglishPaths(project.sourceDirectory, file),
    cache,
  );
  if (fromPackage) {
    return fromPackage;
  }

  if (await portalEnglishTrackedLocally(project.sourceDirectory, file)) {
    const portalPath = `src/${project.sourceDirectory}/docs/${file}`;
    const fromPortal = await fetchFirstRepositoryPath(
      DOCS_PORTAL_REPOSITORY_URL,
      DOCS_PORTAL_REF,
      [portalPath],
      cache,
    );
    if (fromPortal) {
      return fromPortal;
    }
  }

  if (file === 'readme.md') {
    const fromReadme = await fetchFirstRepositoryPath(
      project.repositoryUrl,
      ref,
      ['README.md'],
      cache,
    );
    if (fromReadme) {
      return fromReadme;
    }
  }

  throw new Error(
    `${project.packageName} is missing English ${file} at ${project.repositoryUrl}@${ref}`,
  );
}

export async function fetchEnglishProjectReadme(
  project: {
    repositoryUrl: string;
    englishDocsRef?: string;
    packageName: string;
    sourceDirectory: string;
  },
  cache = new Map<string, string>(),
): Promise<FetchedEnglishMarkdown | undefined> {
  const ref = project.englishDocsRef ?? 'main';
  return (
    (await fetchFirstRepositoryPath(
      project.repositoryUrl,
      ref,
      packageEnglishPaths(project.sourceDirectory, 'readme.md'),
      cache,
    )) ??
    ((await portalEnglishTrackedLocally(project.sourceDirectory, 'readme.md'))
      ? await fetchFirstRepositoryPath(
          DOCS_PORTAL_REPOSITORY_URL,
          DOCS_PORTAL_REF,
          [`src/${project.sourceDirectory}/docs/readme.md`],
          cache,
        )
      : undefined) ??
    (await fetchFirstRepositoryPath(project.repositoryUrl, ref, ['README.md'], cache))
  );
}
