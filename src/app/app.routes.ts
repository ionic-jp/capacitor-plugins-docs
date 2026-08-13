import { Routes } from '@angular/router';
import { pluginDocs } from './docs/docs-data';
import { DocsPageComponent } from './docs/docs-page';
import { LandingPageComponent } from './docs/landing-page';
import { PluginIndexComponent } from './docs/plugin-index';

const pluginRoutes: Routes = pluginDocs.flatMap((plugin) => [
  { path: plugin.id, component: LandingPageComponent, data: { pluginId: plugin.id } },
  ...plugin.pages.map((page) => ({
    path: `${plugin.id}/docs/${page.slug}`,
    component: DocsPageComponent,
    data: { pluginId: plugin.id, pageSlug: page.slug },
  })),
]);

const legacyRoutes: Routes = pluginDocs
  .find((plugin) => plugin.id === 'stripe')!
  .pages.map((page) => ({
    path: `docs/${page.slug}`,
    redirectTo: page.path.slice(1),
    pathMatch: 'full' as const,
  }));

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: PluginIndexComponent },
  {
    path: 'docs/identity',
    pathMatch: 'full',
    redirectTo: 'stripe-identity/docs/identity-verification-sheet',
  },
  ...legacyRoutes,
  ...pluginRoutes,
  { path: '**', redirectTo: 'stripe' },
];
