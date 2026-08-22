import { RenderMode, ServerRoute } from '@angular/ssr';
import { ARTICLE_SUMMARIES, ARTICLE_YEARS } from './generated/article-catalog.generated';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'articles/archive/:year',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ARTICLE_YEARS.map((year) => ({ year })),
  },
  {
    path: 'articles/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ARTICLE_SUMMARIES.map((article) => ({ slug: article.slug })),
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
