import { DOCUMENT } from '@angular/common';
import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { localizedPublicPath } from '../locale-path';
import { SITE_CONFIG } from '../site-config';

interface PageMetadata {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  readonly #document = inject(DOCUMENT);
  readonly #locale = inject(LOCALE_ID);
  readonly #meta = inject(Meta);
  readonly #title = inject(Title);

  setPage(page: PageMetadata): void {
    const englishUrl = `${SITE_CONFIG.origin}${localizedPublicPath('en', page.path)}`;
    const japaneseUrl = `${SITE_CONFIG.origin}${localizedPublicPath('ja', page.path)}`;
    const canonicalUrl = `${SITE_CONFIG.origin}${localizedPublicPath(this.#locale, page.path)}`;
    const socialImageUrl = `${SITE_CONFIG.origin}${SITE_CONFIG.socialImagePath}`;

    this.#title.setTitle(page.title);
    this.#meta.updateTag({ name: 'description', content: page.description });
    this.#meta.updateTag({ property: 'og:title', content: page.title });
    this.#meta.updateTag({ property: 'og:description', content: page.description });
    this.#meta.updateTag({ property: 'og:type', content: 'website' });
    this.#meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.#meta.updateTag({ property: 'og:site_name', content: SITE_CONFIG.name });
    this.#meta.updateTag({ property: 'og:image', content: socialImageUrl });
    this.#meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.#meta.updateTag({ property: 'og:image:height', content: '630' });
    this.#meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.#meta.updateTag({ name: 'twitter:image', content: socialImageUrl });
    this.#meta.updateTag({
      name: 'robots',
      content: page.noIndex ? 'noindex, nofollow' : 'index, follow',
    });
    this.#setLink('canonical', canonicalUrl);
    this.#setLink('alternate', englishUrl, 'en');
    this.#setLink('alternate', japaneseUrl, 'ja');
    this.#setLink('alternate', englishUrl, 'x-default');
  }

  #setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.#document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.#document.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      this.#document.head.appendChild(link);
    }
    link.href = href;
  }
}
