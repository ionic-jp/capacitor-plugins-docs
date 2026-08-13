import { PLUGINS } from '../generated/plugin-docs.generated';

export interface CodeSample {
  file: string;
  lines: string[];
}

export interface ScrollMapEntry {
  id: string;
  activeLine: Record<string, readonly number[]>;
}

export interface DocsPage {
  title: string;
  navTitle: string;
  slug: string;
  file: string;
  section: string;
  path: string;
  html: string;
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

export const pluginDocs = PLUGINS as unknown as readonly PluginDocs[];

export function findPlugin(id: string): PluginDocs | undefined {
  return pluginDocs.find((plugin) => plugin.id === id);
}

export function findPage(pluginId: string, slug: string): DocsPage | undefined {
  return findPlugin(pluginId)?.pages.find((page) => page.slug === slug);
}

export function sectionsFor(plugin: PluginDocs): { name: string; pages: readonly DocsPage[] }[] {
  return [...new Set(plugin.pages.map((page) => page.section))].map((name) => ({
    name,
    pages: plugin.pages.filter((page) => page.section === name),
  }));
}
