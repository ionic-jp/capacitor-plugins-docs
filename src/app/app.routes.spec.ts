import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { PluginIndexComponent } from './docs/plugin-index';

describe('routes', () => {
  it('renders PluginIndexComponent at the root path instead of redirecting to Stripe', () => {
    const root = routes.find((route) => route.path === '');

    expect(root).toEqual({
      path: '',
      pathMatch: 'full',
      component: PluginIndexComponent,
    });
  });

  it('navigates / to the plugin index', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });

    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');

    expect(router.url).toBe('/');
    expect(router.routerState.snapshot.root.firstChild?.component).toBe(PluginIndexComponent);
  });

  it('exposes the AdMob landing page and every generated AdMob documentation page', () => {
    expect(routes.some((route) => route.path === 'admob')).toBe(true);
    expect(
      routes.filter((route) => route.path?.startsWith('admob/docs/')).map((route) => route.path),
    ).toEqual([
      'admob/docs/configuration',
      'admob/docs/consent',
      'admob/docs/banner',
      'admob/docs/full-screen-ads',
      'admob/docs/app-open',
      'admob/docs/api',
    ]);
  });
});
