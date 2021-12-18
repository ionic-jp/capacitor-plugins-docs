export interface MarkdownContent {
  title?: string;
  description?: string;
  url?: string;
  code?: string[];
  headings?: MarkdownHeading[];
  srcPath?: string;
  hypertext?: string;
  scrollActiveLine?: {
    id: string;
    activeLine: Record<string, number[]>
  }[]
}

export interface MarkdownCode {
  file?: string;
  hypertext?: string;
}

export interface MarkdownHeading {
  id: string;
  level: number;
  text: string;
}
