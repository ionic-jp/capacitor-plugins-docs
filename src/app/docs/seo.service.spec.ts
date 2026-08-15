import { DOCUMENT } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from '../site-config';
import { SeoService } from './seo.service';

describe('SeoService', () => {
  it('writes canonical, hreflang, Open Graph, and robots metadata', () => {
    const service = TestBed.inject(SeoService);
    const document = TestBed.inject(DOCUMENT);
    service.setPage({
      title: 'Example - rdlabo.dev',
      description: 'Example documentation.',
      path: '/projects/example/docs/api',
    });

    expect(TestBed.inject(Title).getTitle()).toBe('Example - rdlabo.dev');
    expect(TestBed.inject(Meta).getTag('property="og:title"')?.content).toBe(
      'Example - rdlabo.dev',
    );
    expect(TestBed.inject(Meta).getTag('property="og:image"')?.content).toBe(
      `${SITE_CONFIG.origin}${SITE_CONFIG.socialImagePath}`,
    );
    expect(TestBed.inject(Meta).getTag('name="twitter:card"')?.content).toBe('summary_large_image');
    expect(TestBed.inject(Meta).getTag('name="robots"')?.content).toBe('index, follow');
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${SITE_CONFIG.origin}/projects/example/docs/api`,
    );
    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="ja"]')?.getAttribute('href'),
    ).toBe(`${SITE_CONFIG.origin}/ja/projects/example/docs/api`);

    service.setPage({
      title: 'Missing',
      description: 'Missing.',
      path: '/not-found',
      noIndex: true,
    });
    expect(TestBed.inject(Meta).getTag('name="robots"')?.content).toBe('noindex, nofollow');
  });

  it('uses slashless Japanese home canonical, og:url, and hreflang', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'ja' }],
    });

    const service = TestBed.inject(SeoService);
    const document = TestBed.inject(DOCUMENT);
    service.setPage({
      title: 'rdlabo.dev',
      description: 'Japanese home.',
      path: '/',
    });

    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${SITE_CONFIG.origin}/ja`,
    );
    expect(TestBed.inject(Meta).getTag('property="og:url"')?.content).toBe(
      `${SITE_CONFIG.origin}/ja`,
    );
    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="ja"]')?.getAttribute('href'),
    ).toBe(`${SITE_CONFIG.origin}/ja`);
    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="en"]')?.getAttribute('href'),
    ).toBe(`${SITE_CONFIG.origin}/`);
  });
});
