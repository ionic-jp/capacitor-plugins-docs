import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from './app.routes';
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
    expect(routes.some((route) => route.path === 'projects/capacitor-admob')).toBe(true);
    expect(
      routes
        .filter((route) => route.path?.startsWith('projects/capacitor-admob/docs/'))
        .map((route) => route.path),
    ).toHaveLength(6);
    expect(routes.find((route) => route.path === 'admob')?.redirectTo).toBe(
      '/projects/capacitor-admob',
    );
    expect(routes.find((route) => route.path === 'admob/docs/consent')?.redirectTo).toBe(
      '/projects/capacitor-admob/docs/consent',
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
