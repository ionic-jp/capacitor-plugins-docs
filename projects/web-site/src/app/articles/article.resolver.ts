import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { ArticleDetail, loadArticle } from './article-data';

export const articleResolver: ResolveFn<ArticleDetail | RedirectCommand> = async (route) => {
  const router = inject(Router);
  const article = await loadArticle(route.paramMap.get('slug') ?? '');
  return article ?? new RedirectCommand(router.parseUrl('/not-found'));
};
