import { LOCALE_ID, inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { ProjectDocs, loadProject } from './docs-data';

export const projectResolver: ResolveFn<ProjectDocs | RedirectCommand> = async (route) => {
  const locale = inject(LOCALE_ID);
  const router = inject(Router);
  const projectId = route.data['projectId'] as string;
  const project = await loadProject(projectId, locale);
  return project ?? new RedirectCommand(router.parseUrl('/not-found'));
};
