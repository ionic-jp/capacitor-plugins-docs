import { Routes } from '@angular/router';
import { DocsPageComponent } from './docs/docs-page';
import { LandingPageComponent } from './docs/landing-page';
import { NotFoundComponent } from './docs/not-found';
import { PluginIndexComponent } from './docs/plugin-index';
import { projectCatalog } from './docs/docs-data';
import { projectResolver } from './docs/project.resolver';
import { SupportPageComponent } from './docs/support-page';

const projectRoutes: Routes = projectCatalog.flatMap((project) => [
  {
    path: `projects/${project.slug}`,
    component: LandingPageComponent,
    data: { projectId: project.id },
    resolve: { project: projectResolver },
  },
  ...project.pages.map((page) => ({
    path: `projects/${project.slug}/docs/${page.slug}`,
    component: DocsPageComponent,
    data: { projectId: project.id, pageSlug: page.slug },
    resolve: { project: projectResolver },
  })),
]);

const projectLegacyRoutes: Routes = projectCatalog.flatMap((project) => [
  {
    path: project.id,
    redirectTo: project.path,
    pathMatch: 'full' as const,
  },
  ...project.pages.map((page) => ({
    path: `${project.id}/docs/${page.slug}`,
    redirectTo: page.path,
    pathMatch: 'full' as const,
  })),
]);

const stripe = projectCatalog.find((project) => project.id === 'stripe')!;
const stripeLegacyRoutes: Routes = stripe.pages.map((page) => ({
  path: `docs/${page.slug}`,
  redirectTo: page.path,
  pathMatch: 'full' as const,
}));

const admobLegacyDocRedirects: Routes = [
  {
    path: 'admob/docs/full-screen-ads',
    redirectTo: '/projects/capacitor-admob/docs/interstitial',
    pathMatch: 'full',
  },
  {
    path: 'projects/capacitor-admob/docs/full-screen-ads',
    redirectTo: '/projects/capacitor-admob/docs/interstitial',
    pathMatch: 'full',
  },
];

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PluginIndexComponent },
  { path: 'projects', pathMatch: 'full', redirectTo: '' },
  { path: 'support', component: SupportPageComponent },
  {
    path: 'docs/identity',
    pathMatch: 'full',
    redirectTo: '/projects/capacitor-stripe-identity/docs/identity-verification-sheet',
  },
  ...stripeLegacyRoutes,
  ...admobLegacyDocRedirects,
  ...projectLegacyRoutes,
  ...projectRoutes,
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent },
];
