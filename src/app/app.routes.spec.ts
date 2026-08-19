import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
import { projectCatalog } from './docs/docs-data';
import { NotFoundComponent } from './docs/not-found';
import { PluginIndexComponent } from './docs/plugin-index';
import { SupportPageComponent } from './docs/support-page';

describe('routes', () => {
  it('exposes one canonical project index and redirects its alias', () => {
    expect(routes.find((route) => route.path === '')?.component).toBe(PluginIndexComponent);
    expect(routes.find((route) => route.path === 'projects')?.redirectTo).toBe('');
  });

  it('exposes the shared support page outside individual project documentation', () => {
    expect(routes.find((route) => route.path === 'support')?.component).toBe(SupportPageComponent);
  });

  it('uses canonical project routes and redirects every former AdMob route', () => {
    const admob = projectCatalog.find((project) => project.id === 'admob');
    expect(admob).toBeDefined();
    expect(routes.some((route) => route.path === 'projects/capacitor-admob')).toBe(true);
    expect(
      routes
        .filter(
          (route) =>
            route.path?.startsWith('projects/capacitor-admob/docs/') &&
            'component' in route &&
            route.component,
        )
        .map((route) => route.path),
    ).toHaveLength(admob!.pages.length);
    expect(routes.find((route) => route.path === 'admob')?.redirectTo).toBe(
      '/projects/capacitor-admob',
    );
    expect(routes.find((route) => route.path === 'admob/docs/consent')?.redirectTo).toBe(
      '/projects/capacitor-admob/docs/consent',
    );
    expect(routes.find((route) => route.path === 'admob/docs/full-screen-ads')?.redirectTo).toBe(
      '/projects/capacitor-admob/docs/interstitial',
    );
  });

  it('navigates legacy routes directly to their absolute canonical target', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/stripe/docs/react');
    expect(router.url).toBe('/projects/capacitor-stripe/docs/react');
  });

  it('renders a real not-found component instead of redirecting unknown paths to Stripe', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/does-not-exist');
    expect(router.routerState.snapshot.root.firstChild?.component).toBe(NotFoundComponent);
  });
});
