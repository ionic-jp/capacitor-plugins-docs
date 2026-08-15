const DOCGEN_SECTION =
  /(?:^#{1,6}[ \t]+API[ \t]*\r?\n[ \t]*\r?\n)?<docgen-index>[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*<\/docgen-index>[ \t]*\r?\n[ \t]*\r?\n<docgen-api>[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*<\/docgen-api>/m;

export interface SplitDocgenReadme {
  readme: string;
  api: string;
}

/**
 * Turns the sections maintained by Capacitor docgen into a standalone API page.
 * A README without both docgen blocks is left alone.
 */
export function splitDocgenReadme(markdown: string): SplitDocgenReadme | undefined {
  const match = DOCGEN_SECTION.exec(markdown);
  if (!match) return undefined;

  const readme = `${markdown.slice(0, match.index).trimEnd()}\n${markdown
    .slice(match.index + match[0].length)
    .trimStart()}`.trimEnd();

  return {
    readme: `${readme}\n`,
    api: `${match[1].trim()}\n\n${match[2].trim()}\n`,
  };
}
