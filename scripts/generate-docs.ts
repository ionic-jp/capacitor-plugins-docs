import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import fm from 'front-matter';
import markdownToHtml from 'zenn-markdown-html';
import { formatDescription, formatType } from '@capacitor/docgen/dist/formatting';
import { MarkdownTable } from '@capacitor/docgen/dist/markdown';
import { JSDOM } from 'jsdom';
import {
  type Locale,
  localize,
  projectCategoryDefinitions,
  projectDefinitions,
  type ProjectDefinition,
  type ProjectPageDefinition,
} from './project-manifest';
import { localizedPublicPath } from '../src/app/locale-path';
import { SITE_CONFIG } from '../src/app/site-config';
import { enforceGeneratedHtmlPolicy } from './html-policy';
import { normalizeImportedReadmeHeadings } from './markdown-headings';
import { splitDocgenReadme } from './docgen-readme';
import {
  apiAnchorFragments,
  expandApiPlaceholders,
  extractPackageReadmeParts,
  normalizePackageMarkdown,
  rewritePackageDocLinks,
  stripLeadingH1,
  stripRdlaboDocsOmit,
} from './package-markdown';

const root = resolve(process.cwd());
const docsRepositoryUrl = 'https://github.com/rdlabo-dev/docs';

const stripHtml = (value: string) => value.replace(/<\/?code>/g, '`').replace(/<[^>]+>/g, '');
const tagText = (tags: any[], name: string) => tags?.find((tag) => tag.name === name)?.text ?? '';

function apiMarkdown(source: any): Map<string, string> {
  const entries = new Map<string, string>();
  for (const method of source.api?.methods ?? []) {
    const signature =
      method.name === 'addListener' && method.parameters?.length
        ? `addListener(${String(method.parameters[0].type).replace(/"/g, "'")}, ...)`
        : `${method.name}(${method.parameters?.length ? '...' : ''})`;
    const markdown = `#### \`method\` ${signature}\n${formatDescription(source, method.docs) || ''}\n\n\`${method.name}${method.signature}\`\n`;
    const existing = entries.get(method.name);
    entries.set(method.name, existing ? `${existing}\n${markdown}` : markdown);
  }
  for (const item of source.interfaces ?? []) {
    const table = new MarkdownTable();
    table.addHeader(['Prop', 'Type', 'Description', 'Default', 'Since']);
    for (const property of item.properties ?? []) {
      table.addRow([
        `**\`${property.name}\`**`,
        formatType(source, property.type).formatted,
        formatDescription(source, property.docs),
        tagText(property.tags, 'default'),
        tagText(property.tags, 'since'),
      ]);
    }
    table.removeEmptyColumns();
    entries.set(
      item.name,
      `#### \`interface\` ${item.name}\n${formatDescription(source, item.docs) || ''}\n${stripHtml(table.toMarkdown().join('\n'))}\n`,
    );
  }
  for (const item of source.typeAliases ?? []) {
    const types = item.types
      .map((type: any) => formatType(source, type.text).formatted)
      .join(' | ');
    entries.set(item.name, `#### \`type alias\` ${item.name}\n${stripHtml(types)}\n`);
  }
  for (const item of source.enums ?? []) {
    const table = new MarkdownTable();
    table.addHeader(['Member', 'Value', 'Description', 'Since']);
    for (const member of item.members ?? []) {
      table.addRow([
        `**\`${member.name}\`**`,
        formatType(source, member.value).formatted,
        formatDescription(source, member.docs),
        tagText(member.tags, 'since'),
      ]);
    }
    table.removeEmptyColumns();
    entries.set(
      item.name,
      `#### \`enum\` ${item.name}\n${stripHtml(table.toMarkdown().join('\n'))}\n`,
    );
  }
  return entries;
}

async function renderCode(markdown: string): Promise<{ file: string; lines: string[] }> {
  const parsed = fm<{ title?: string; file?: string }>(markdown);
  const dom = new JSDOM(await markdownToHtml(parsed.body));
  const code = dom.window.document.querySelector('pre code');
  return {
    file:
      dom.window.document.querySelector('.code-block-filename')?.textContent?.trim() ||
      parsed.attributes.file ||
      parsed.attributes.title ||
      'example.ts',
    lines: Array.from(code?.querySelectorAll(':scope > .line') ?? []).map((line, index) =>
      enforceGeneratedHtmlPolicy(line.innerHTML, `code example line ${index + 1}`),
    ),
  };
}

function formatApiEntries(document: Document): void {
  const body = document.body;
  for (const heading of Array.from(body.children)) {
    if (heading.tagName !== 'H4' || heading.parentElement !== body) continue;
    const kind = heading.querySelector(':scope > code')?.textContent?.trim();
    if (
      !kind ||
      ![
        'method',
        'interface',
        'type alias',
        'enum',
        'class',
        'component',
        'directive',
        'function',
        'module',
        'command',
        'stylesheet',
        'rule',
      ].includes(kind)
    )
      continue;

    const section = document.createElement('section');
    section.className = 'api-entry';
    body.insertBefore(section, heading);

    let sibling: Element | null = heading;
    while (sibling && (sibling === heading || !/^H[234]$/.test(sibling.tagName))) {
      const next = sibling.nextElementSibling;
      section.appendChild(sibling);
      sibling = next;
    }

    for (const paragraph of Array.from(section.querySelectorAll(':scope > p'))) {
      const children = Array.from(paragraph.children);
      const hasOnlyOneCodeElement =
        children.length === 1 &&
        children[0].tagName === 'CODE' &&
        Array.from(paragraph.childNodes).every(
          (node) => node === children[0] || !node.textContent?.trim(),
        );
      if (hasOnlyOneCodeElement) paragraph.classList.add('api-signature');
    }
  }
}

function annotateDocgenApiEntries(document: Document): void {
  const categoryKinds = new Map([
    ['Interfaces', 'interface'],
    ['インターフェース', 'interface'],
    ['Type Aliases', 'type alias'],
    ['型エイリアス', 'type alias'],
    ['Enums', 'enum'],
    ['列挙型', 'enum'],
  ]);
  let categoryKind: string | undefined;

  for (const heading of Array.from(document.body.children)) {
    if (heading.tagName === 'H3') {
      const headingText = heading.textContent?.trim() ?? '';
      categoryKind = categoryKinds.get(headingText);
      if (categoryKind) continue;

      const methodHeading = document.createElement('h4');
      for (const attribute of Array.from(heading.attributes)) {
        methodHeading.setAttribute(attribute.name, attribute.value);
      }
      const kind = document.createElement('code');
      kind.textContent = 'method';
      methodHeading.append(kind, document.createTextNode(` ${headingText}`));
      heading.replaceWith(methodHeading);
      continue;
    }

    if (heading.tagName !== 'H4' || !categoryKind) continue;
    const kind = document.createElement('code');
    kind.textContent = categoryKind;
    heading.prepend(kind, document.createTextNode(' '));
  }
}

function formatApiReference(document: Document): void {
  const body = document.body;
  const root = document.createElement('div');
  root.className = 'api-reference';
  while (body.firstChild) root.appendChild(body.firstChild);
  body.appendChild(root);
}

function localizeProject(project: ProjectDefinition, locale: Locale, version: string) {
  return {
    id: project.id,
    slug: project.slug,
    name: project.name,
    shortName: project.shortName,
    packageName: project.packageName,
    repositoryUrl: project.repositoryUrl,
    category: project.category,
    icon: project.icon,
    version,
    description: localize(project.description, locale),
    headline: localize(project.headline, locale),
    overview: localize(project.overview, locale),
    featuresHeading: localize(project.featuresHeading, locale),
    features: project.features.map((feature) => ({
      title: localize(feature.title, locale),
      description: localize(feature.description, locale),
    })),
  };
}

function rewriteInternalLinks(html: string, project: ProjectDefinition, locale: Locale): string {
  const localePrefix = locale === 'ja' ? '/ja' : '';
  let rewritten = html.replace(
    /href="\/docs\//g,
    `href="${localePrefix}/projects/${project.slug}/docs/`,
  );
  for (const target of projectDefinitions) {
    rewritten = rewritten.replaceAll(
      `href="/${target.id}/docs/`,
      `href="${localePrefix}/projects/${target.slug}/docs/`,
    );
    rewritten = rewritten.replaceAll(
      `href="/${target.id}"`,
      `href="${localePrefix}/projects/${target.slug}"`,
    );
    rewritten = rewritten.replaceAll(
      `href="/${target.id}/`,
      `href="${localePrefix}/projects/${target.slug}/`,
    );
  }
  return rewritten;
}

function pageEditUrl(
  fromPackage: boolean,
  repositoryUrl: string,
  version: string,
  file: string,
  sourcePath: string,
): string {
  if (fromPackage) {
    const packagePath = sourcePath.endsWith('README.md') ? 'README.md' : `docs/${file}`;
    return `${repositoryUrl}/blob/v${version}/${packagePath}`;
  }
  return `${docsRepositoryUrl}/edit/main/${relative(root, sourcePath)}`;
}

const PACKAGE_LANDING_FILES = new Set(['readme.md', 'getting-started.md']);

function landingPageSlug(project: ProjectDefinition): string {
  return project.pages.find((page) => PACKAGE_LANDING_FILES.has(page.file))?.slug ?? 'readme';
}

function srcDocsPath(project: ProjectDefinition, locale: Locale, file: string): string {
  return join(
    root,
    'src',
    project.sourceDirectory,
    'docs',
    ...(locale === 'ja' ? ['ja'] : []),
    file,
  );
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function resolvePageSource(
  project: ProjectDefinition,
  locale: Locale,
  file: string,
  packageRoot: string,
): Promise<{ sourcePath: string; fromPackage: boolean }> {
  const srcPath = srcDocsPath(project, locale, file);
  if (locale === 'ja' || file === 'api.md' || !project.englishFromPackage) {
    return { sourcePath: srcPath, fromPackage: false };
  }

  if (PACKAGE_LANDING_FILES.has(file)) {
    const packagedLanding = join(packageRoot, 'docs', file);
    if (await fileExists(packagedLanding)) {
      return { sourcePath: packagedLanding, fromPackage: true };
    }
    if (file === 'readme.md' && (await fileExists(srcPath))) {
      return { sourcePath: srcPath, fromPackage: false };
    }
    return { sourcePath: join(packageRoot, 'README.md'), fromPackage: true };
  }

  const packagedGuide = join(packageRoot, 'docs', file);
  if (await fileExists(packagedGuide)) {
    return { sourcePath: packagedGuide, fromPackage: true };
  }
  return { sourcePath: srcPath, fromPackage: false };
}

async function generateProject(project: ProjectDefinition, locale: Locale): Promise<any> {
  const packageRoot = join(root, 'node_modules', project.packageName);
  const packageJson = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'));
  const docsJsonPath = join(packageRoot, 'dist/docs.json');
  const api = (await fileExists(docsJsonPath))
    ? apiMarkdown(JSON.parse(await readFile(docsJsonPath, 'utf8')))
    : new Map<string, string>();
  if (project.adapter !== 'markdown' && api.size === 0) {
    throw new Error(`${project.packageName} is missing dist/docs.json`);
  }
  const apiAnchors = apiAnchorFragments(api);
  const packageLandingSlug = landingPageSlug(project);
  const pages = [];
  type SourcePage = {
    page: ProjectPageDefinition;
    body: string;
    useFrontMatterTitle: boolean;
    parsed: ReturnType<typeof fm<any>>;
    sourcePath: string;
    fromPackage: boolean;
    annotateDocgen: boolean;
  };
  const sourcePages: SourcePage[] = [];
  let docgenApiPage: SourcePage | undefined;
  const declaresApiPage = project.pages.some((entry) => entry.slug === 'api');
  for (const declaredPage of project.pages) {
    const { file } = declaredPage;
    const { sourcePath, fromPackage } = await resolvePageSource(project, locale, file, packageRoot);
    const parsed = fm<any>(await readFile(sourcePath, 'utf8'));
    const isPackageLanding = fromPackage && PACKAGE_LANDING_FILES.has(file);
    let preparedBody = parsed.body;
    let splitReadme =
      !fromPackage && file === 'readme.md' ? splitDocgenReadme(parsed.body) : undefined;
    if (!fromPackage && locale === 'en' && project.englishFromPackage && file !== 'api.md') {
      preparedBody = normalizePackageMarkdown(
        rewritePackageDocLinks(
          stripLeadingH1(stripRdlaboDocsOmit(parsed.body)),
          apiAnchors,
          packageLandingSlug,
        ),
      );
    }
    if (fromPackage) {
      if (isPackageLanding) {
        const extracted = extractPackageReadmeParts(parsed.body);
        preparedBody = normalizePackageMarkdown(
          rewritePackageDocLinks(extracted.readme, apiAnchors, packageLandingSlug),
        );
        if (extracted.api && !declaresApiPage) {
          splitReadme = { readme: preparedBody, api: extracted.api };
        }
      } else {
        preparedBody = normalizePackageMarkdown(
          rewritePackageDocLinks(
            stripLeadingH1(stripRdlaboDocsOmit(parsed.body)),
            apiAnchors,
            packageLandingSlug,
          ),
        );
      }
    }
    sourcePages.push({
      page: declaredPage,
      body: splitReadme ? splitReadme.readme : preparedBody,
      useFrontMatterTitle: !fromPackage,
      parsed,
      sourcePath,
      fromPackage,
      annotateDocgen: false,
    });
    if (splitReadme) {
      docgenApiPage = {
        page: {
          title: { en: 'API', ja: 'API' },
          section: { en: 'Reference', ja: 'リファレンス' },
          slug: 'api',
          file,
        },
        body: splitReadme.api,
        useFrontMatterTitle: false,
        parsed,
        sourcePath,
        fromPackage,
        annotateDocgen: true,
      };
    }
  }
  if (!docgenApiPage && !declaresApiPage && project.englishFromPackage) {
    const packageReadmePath = join(packageRoot, 'README.md');
    if (await fileExists(packageReadmePath)) {
      const extracted = extractPackageReadmeParts(await readFile(packageReadmePath, 'utf8'));
      if (extracted.api) {
        docgenApiPage = {
          page: {
            title: { en: 'API', ja: 'API' },
            section: { en: 'Reference', ja: 'リファレンス' },
            slug: 'api',
            file: 'readme.md',
          },
          body: extracted.api,
          useFrontMatterTitle: false,
          parsed: fm(''),
          sourcePath: packageReadmePath,
          fromPackage: true,
          annotateDocgen: true,
        };
      }
    }
  }
  if (docgenApiPage) {
    sourcePages.push(docgenApiPage);
  }

  for (const {
    page,
    body,
    useFrontMatterTitle,
    parsed,
    sourcePath,
    fromPackage,
    annotateDocgen,
  } of sourcePages) {
    const { slug, file } = page;
    const { expanded, missing: missingApiEntries } = expandApiPlaceholders(body, api);
    if (missingApiEntries.length) {
      throw new Error(
        `${relative(root, sourcePath)} references missing API entries: ${missingApiEntries.join(', ')}`,
      );
    }
    const codes = [];
    for (const codePath of parsed.attributes.code ?? []) {
      const normalized = String(codePath).replace(/^\/docs\/stripe\//, '');
      codes.push(
        await renderCode(
          await readFile(join(root, 'src', project.sourceDirectory, 'docs', normalized), 'utf8'),
        ),
      );
    }
    let html = rewriteInternalLinks(await markdownToHtml(expanded), project, locale).replace(
      'loading="lazy"',
      'loading="eager" fetchpriority="high"',
    );
    const htmlDocument = new JSDOM(html).window.document;
    if (
      fromPackage ||
      (project.id === 'eslint-plugin-rules' && slug.startsWith('rules/')) ||
      slug === 'readme' ||
      file === 'using-ion-item-group.md'
    ) {
      normalizeImportedReadmeHeadings(htmlDocument);
    }
    const headingIds = Array.from(htmlDocument.querySelectorAll<HTMLElement>('h1, h2, h3, h4')).map(
      (heading) => heading.id,
    );
    const scrollMap = (parsed.attributes.scrollActiveLine ?? []).map((entry: any) => {
      if (locale !== 'ja' || !entry.id) return entry;
      const localizedId = headingIds.find(
        (headingId) => decodeURIComponent(headingId) === entry.id,
      );
      return localizedId ? { ...entry, id: localizedId } : entry;
    });
    const codeByFile = new Map(codes.map((code) => [code.file, code]));
    let previousHeadingIndex = -1;
    for (const entry of scrollMap) {
      if (entry.id) {
        const headingIndex = headingIds.indexOf(entry.id);
        if (headingIndex < 0) {
          throw new Error(`${relative(root, sourcePath)} references missing heading: ${entry.id}`);
        }
        if (headingIndex <= previousHeadingIndex) {
          throw new Error(
            `${relative(root, sourcePath)} has an out-of-order or duplicate heading: ${entry.id}`,
          );
        }
        previousHeadingIndex = headingIndex;
      }
      for (const [codeFile, range] of Object.entries<number[]>(entry.activeLine ?? {})) {
        const code = codeByFile.get(codeFile);
        if (!code) {
          throw new Error(
            `${relative(root, sourcePath)} references missing code file: ${codeFile}`,
          );
        }
        if (
          range.length !== 2 ||
          !range.every(Number.isInteger) ||
          range[0] < 0 ||
          range[1] < range[0] ||
          range[1] > code.lines.length + 1
        ) {
          throw new Error(
            `${relative(root, sourcePath)} has an invalid ${codeFile} line range: ${range.join(', ')}`,
          );
        }
      }
    }
    if (annotateDocgen) annotateDocgenApiEntries(htmlDocument);
    formatApiEntries(htmlDocument);
    if (slug === 'api') formatApiReference(htmlDocument);
    html = enforceGeneratedHtmlPolicy(htmlDocument.body.innerHTML, relative(root, sourcePath));
    const headings = Array.from(htmlDocument.querySelectorAll<HTMLElement>('h2, h3, h4')).map(
      (heading) => ({
        id: heading.id,
        text: heading.textContent?.trim() ?? '',
        level: Number(heading.tagName.slice(1)) as 2 | 3 | 4,
      }),
    );
    pages.push({
      title: (useFrontMatterTitle && parsed.attributes.title) || localize(page.title, locale),
      navTitle: localize(page.title, locale),
      slug,
      file,
      section: localize(page.section, locale),
      path: `/projects/${project.slug}/docs/${slug}`,
      html,
      headings,
      codes,
      scrollMap,
      editUrl: pageEditUrl(
        fromPackage,
        project.repositoryUrl,
        packageJson.version,
        file,
        sourcePath,
      ),
    });
  }
  return {
    ...localizeProject(project, locale, packageJson.version),
    path: `/projects/${project.slug}`,
    pages,
  };
}

async function main(): Promise<void> {
  const generatedDirectory = join(root, 'src/app/generated');
  const projectsDirectory = join(generatedDirectory, 'projects');
  await mkdir(projectsDirectory, { recursive: true });
  const projectsByLocale: Record<Locale, any[]> = { en: [], ja: [] };
  for (const project of projectDefinitions) {
    for (const locale of ['en', 'ja'] as const) {
      const generated = await generateProject(project, locale);
      projectsByLocale[locale].push(generated);
      await writeFile(
        join(projectsDirectory, `${project.id}.${locale}.generated.ts`),
        `// Generated by scripts/generate-docs.ts. Do not edit.\nexport const PROJECT = ${JSON.stringify(generated, null, 2)} as const;\n`,
      );
    }
  }

  const catalogs = Object.fromEntries(
    (['en', 'ja'] as const).map((locale) => [
      locale,
      projectsByLocale[locale].map(({ pages, ...project }) => ({
        ...project,
        pages: pages.map(
          ({ html, headings, codes, scrollMap, editUrl, file, ...page }: any) => page,
        ),
      })),
    ]),
  ) as Record<Locale, any[]>;
  const categories = Object.fromEntries(
    (['en', 'ja'] as const).map((locale) => [
      locale,
      projectCategoryDefinitions.map((category) => ({
        id: category.id,
        label: localize(category.label, locale),
        description: localize(category.description, locale),
        order: category.order,
      })),
    ]),
  ) as Record<Locale, any[]>;
  await writeFile(
    join(generatedDirectory, 'project-catalog.generated.ts'),
    `// Generated by scripts/generate-docs.ts. Do not edit.\nexport const PROJECT_CATEGORIES_EN = ${JSON.stringify(categories.en, null, 2)} as const;\n\nexport const PROJECT_CATEGORIES_JA = ${JSON.stringify(categories.ja, null, 2)} as const;\n\nexport const PROJECTS_EN = ${JSON.stringify(catalogs.en, null, 2)} as const;\n\nexport const PROJECTS_JA = ${JSON.stringify(catalogs.ja, null, 2)} as const;\n`,
  );
  const loaderEntries = projectDefinitions
    .map(
      (project) =>
        `  ${JSON.stringify(project.id)}: {\n    en: () => import('./projects/${project.id}.en.generated').then((module) => module.PROJECT),\n    ja: () => import('./projects/${project.id}.ja.generated').then((module) => module.PROJECT),\n  },`,
    )
    .join('\n');
  await writeFile(
    join(generatedDirectory, 'project-loaders.generated.ts'),
    `// Generated by scripts/generate-docs.ts. Do not edit.\nexport const PROJECT_LOADERS = {\n${loaderEntries}\n} as const;\n`,
  );
  const canonicalPaths = [
    '/',
    '/support',
    ...catalogs.en.flatMap((project) => [
      project.path,
      ...project.pages.map((page: any) => page.path),
    ]),
  ];
  const sitemapEntries = canonicalPaths
    .map((path) => {
      const englishUrl = `${SITE_CONFIG.origin}${localizedPublicPath('en', path)}`;
      const japaneseUrl = `${SITE_CONFIG.origin}${localizedPublicPath('ja', path)}`;
      return `  <url>\n    <loc>${englishUrl}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />\n    <xhtml:link rel="alternate" hreflang="ja" href="${japaneseUrl}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${englishUrl}" />\n  </url>\n  <url>\n    <loc>${japaneseUrl}</loc>\n    <xhtml:link rel="alternate" hreflang="en" href="${englishUrl}" />\n    <xhtml:link rel="alternate" hreflang="ja" href="${japaneseUrl}" />\n    <xhtml:link rel="alternate" hreflang="x-default" href="${englishUrl}" />\n  </url>`;
    })
    .join('\n');
  await writeFile(
    join(root, 'public/sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`,
  );
  await writeFile(
    join(root, 'public/robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_CONFIG.origin}/sitemap.xml\n`,
  );
  const pageCount = projectsByLocale.en.reduce((count, project) => count + project.pages.length, 0);
  console.log(
    `Generated ${pageCount * 2} localized documentation pages in ${projectDefinitions.length * 2} lazy project modules.`,
  );
}

void main();
