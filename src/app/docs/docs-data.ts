import { PLUGINS_EN, PLUGINS_JA } from '../generated/plugin-docs.generated';

export interface CodeSample {
  file: string;
  lines: string[];
}

export interface ScrollMapEntry {
  id: string;
  activeLine: Record<string, readonly number[]>;
}

export interface DocsHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

export interface DocsPage {
  title: string;
  navTitle: string;
  slug: string;
  file: string;
  section: string;
  path: string;
  html: string;
  headings: readonly DocsHeading[];
  codes: readonly CodeSample[];
  scrollMap: readonly ScrollMapEntry[];
  editUrl: string;
}

export interface PluginDocs {
  id: string;
  name: string;
  packageName: string;
  repositoryUrl: string;
  description: string;
  pages: readonly DocsPage[];
}

export const pluginDocs = PLUGINS_EN as unknown as readonly PluginDocs[];
const japanesePluginDocs = PLUGINS_JA as unknown as readonly PluginDocs[];

export function docsForLocale(locale: string): readonly PluginDocs[] {
  return locale.toLowerCase().startsWith('ja') ? japanesePluginDocs : pluginDocs;
}

export function findPlugin(id: string, locale = 'en'): PluginDocs | undefined {
  return docsForLocale(locale).find((plugin) => plugin.id === id);
}

export function findPage(pluginId: string, slug: string, locale = 'en'): DocsPage | undefined {
  return findPlugin(pluginId, locale)?.pages.find((page) => page.slug === slug);
}

export function sectionsFor(plugin: PluginDocs): { name: string; pages: readonly DocsPage[] }[] {
  return [...new Set(plugin.pages.map((page) => page.section))].map((name) => ({
    name,
    pages: plugin.pages.filter((page) => page.section === name),
  }));
}
