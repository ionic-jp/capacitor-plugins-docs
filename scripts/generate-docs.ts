import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import fm from 'front-matter';
import markdownToHtml from 'zenn-markdown-html';
import { formatDescription, formatType } from '@capacitor/docgen/dist/formatting';
import { MarkdownTable } from '@capacitor/docgen/dist/markdown';
import { JSDOM } from 'jsdom';

const root = resolve(process.cwd());
const docsRepositoryUrl = 'https://github.com/ionic-jp/capacitor-plugins-docs';
const plugins = [
  {
    id: 'stripe',
    name: 'Capacitor Community Stripe',
    packageName: '@capacitor-community/stripe',
    repositoryUrl: 'https://github.com/capacitor-community/stripe',
    description: 'Native Stripe payments for Capacitor applications.',
    pages: [
      ['Configuration', 'configuration', 'configuration.md', 'Quickstart'],
      ['Vanilla JS', 'vanilla-js', 'vanilla-js.md', 'Quickstart'],
      ['Angular', 'angular', 'angular.md', 'Quickstart'],
      ['React', 'react', 'react.md', 'Quickstart'],
      ['Event Listeners', 'learn/event-listeners', 'learn/event-listeners.md', 'Learn'],
      ['Server Integration', 'server-integration', 'server-integration.md', 'Learn'],
      ['Initialize', 'initialize', 'initialize.md', 'Method'],
      ['PaymentSheet', 'payment-sheet', 'payment-sheet.md', 'Method'],
      ['PaymentFlow', 'payment-flow', 'payment-flow.md', 'Method'],
      ['Apple Pay', 'apple-pay', 'apple-pay.md', 'Method'],
      ['Google Pay', 'google-pay', 'google-pay.md', 'Method'],
      ['API', 'api', 'api.md', 'Reference'],
    ],
  },
  {
    id: 'stripe-identity',
    name: 'Capacitor Community Stripe Identity',
    packageName: '@capacitor-community/stripe-identity',
    repositoryUrl: 'https://github.com/capacitor-community/stripe',
    description: 'Stripe Identity SDK bindings for Capacitor applications.',
    pages: [
      ['Configuration', 'configuration', 'configuration.md', 'Quickstart'],
      [
        'Identity Verification Sheet',
        'identity-verification-sheet',
        'identity-verification-sheet.md',
        'Guide',
      ],
      ['API', 'api', 'api.md', 'Reference'],
    ],
  },
  {
    id: 'stripe-terminal',
    name: 'Capacitor Community Stripe Terminal',
    packageName: '@capacitor-community/stripe-terminal',
    repositoryUrl: 'https://github.com/capacitor-community/stripe',
    description: 'Stripe Terminal SDK bindings for Capacitor applications.',
    pages: [
      ['Configuration', 'configuration', 'configuration.md', 'Quickstart'],
      ['Collect a Payment', 'collect-a-payment', 'collect-a-payment.md', 'Guide'],
      ['Reader Lifecycle', 'reader-lifecycle', 'reader-lifecycle.md', 'Guide'],
      ['Tap to Pay', 'tap-to-pay', 'tap-to-pay.md', 'Guide'],
      ['API', 'api', 'api.md', 'Reference'],
    ],
  },
] as const;

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
    lines: Array.from(code?.querySelectorAll(':scope > .line') ?? []).map((line) => line.innerHTML),
  };
}

function formatApiEntries(document: Document): void {
  const body = document.body;
  for (const heading of Array.from(body.children)) {
    if (heading.tagName !== 'H4' || heading.parentElement !== body) continue;
    const kind = heading.querySelector(':scope > code')?.textContent?.trim();
    if (!kind || !['method', 'interface', 'type alias', 'enum'].includes(kind)) continue;

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

function formatApiReference(document: Document): void {
  const body = document.body;
  const root = document.createElement('div');
  root.className = 'api-reference';
  while (body.firstChild) root.appendChild(body.firstChild);
  body.appendChild(root);
}

async function main(): Promise<void> {
  const generated = [];
  for (const plugin of plugins) {
    const docsJson = JSON.parse(
      await readFile(join(root, 'node_modules', plugin.packageName, 'dist/docs.json'), 'utf8'),
    );
    const api = apiMarkdown(docsJson);
    const pages = [];
    for (const [title, slug, file, section] of plugin.pages) {
      const sourcePath = join(root, 'src', plugin.id, 'docs', file);
      const parsed = fm<any>(await readFile(sourcePath, 'utf8'));
      const missingApiEntries: string[] = [];
      const expanded = parsed.body.replace(/^!::([a-zA-Z0-9]+)::$/gm, (_, id: string) => {
        const entry = api.get(id);
        if (!entry) missingApiEntries.push(id);
        return entry ?? '';
      });
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
            await readFile(join(root, 'src', plugin.id, 'docs', normalized), 'utf8'),
          ),
        );
      }
      let html = (await markdownToHtml(expanded))
        .replace(/href="\/docs\//g, `href="/${plugin.id}/docs/`)
        .replace('loading="lazy"', 'loading="eager" fetchpriority="high"');
      const htmlDocument = new JSDOM(html).window.document;
      const headingIds = Array.from(
        htmlDocument.querySelectorAll<HTMLElement>('h1, h2, h3, h4'),
      ).map((heading) => heading.id);
      const codeByFile = new Map(codes.map((code) => [code.file, code]));
      let previousHeadingIndex = -1;
      for (const entry of parsed.attributes.scrollActiveLine ?? []) {
        if (entry.id) {
          const headingIndex = headingIds.indexOf(entry.id);
          if (headingIndex < 0) {
            throw new Error(
              `${relative(root, sourcePath)} references missing heading: ${entry.id}`,
            );
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
      formatApiEntries(htmlDocument);
      if (slug === 'api') formatApiReference(htmlDocument);
      html = htmlDocument.body.innerHTML;
      pages.push({
        title: parsed.attributes.title || title,
        navTitle: title,
        slug,
        file,
        section,
        path: `/${plugin.id}/docs/${slug}`,
        html,
        codes,
        scrollMap: parsed.attributes.scrollActiveLine ?? [],
        editUrl: `${docsRepositoryUrl}/edit/main/${relative(root, sourcePath)}`,
      });
    }
    generated.push({ ...plugin, pages });
  }
  const destination = join(root, 'src/app/generated/plugin-docs.generated.ts');
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(
    destination,
    `// Generated by scripts/generate-docs.ts. Do not edit.\nexport const PLUGINS = ${JSON.stringify(generated, null, 2)} as const;\n`,
  );
  console.log(
    `Generated ${generated.reduce((count, plugin) => count + plugin.pages.length, 0)} documentation pages.`,
  );
}

void main();
