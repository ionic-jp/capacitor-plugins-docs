import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE } from './site-config';

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  noIndex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  readonly #document = inject(DOCUMENT);
  readonly #meta = inject(Meta);
  readonly #title = inject(Title);

  setPage(page: PageMetadata): void {
    const canonicalUrl = `https://rdlabo.dev${page.path === '/' ? '' : page.path}`;
    const socialImageUrl = 'https://rdlabo.dev/og.png';
    this.#title.setTitle(page.title);
    this.#meta.updateTag({ name: 'description', content: page.description });
    this.#meta.updateTag({ property: 'og:title', content: page.title });
    this.#meta.updateTag({ property: 'og:description', content: page.description });
    this.#meta.updateTag({ property: 'og:type', content: page.type ?? 'website' });
    this.#meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.#meta.updateTag({ property: 'og:site_name', content: SITE.name });
    this.#meta.updateTag({ property: 'og:image', content: socialImageUrl });
    this.#meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.#meta.updateTag({ property: 'og:image:height', content: '630' });
    this.#meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.#meta.updateTag({ name: 'twitter:image', content: socialImageUrl });
    this.#meta.updateTag({
      name: 'robots',
      content: page.noIndex ? 'noindex, nofollow' : 'index, follow',
    });
    if (page.publishedAt) {
      this.#meta.updateTag({ property: 'article:published_time', content: page.publishedAt });
    } else {
      this.#meta.removeTag('property="article:published_time"');
    }
    let canonical = this.#document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.#document.createElement('link');
      canonical.rel = 'canonical';
      this.#document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }
}
