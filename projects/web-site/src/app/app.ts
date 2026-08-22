import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DestroyRef, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { SiteFooter } from './layout/site-footer/site-footer';
import { SiteHeader } from './layout/site-header/site-header';

type GoogleAnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeader, SiteFooter],
  templateUrl: './app.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class App {
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);
  readonly #platformId = inject(PLATFORM_ID);
  readonly #document = inject(DOCUMENT);

  constructor() {
    if (isPlatformBrowser(this.#platformId)) {
      this.#loadSearchAssets();
    }
    this.#router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((event) => this.#sendPageView(event.urlAfterRedirects));
  }

  #sendPageView(path: string): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    const browserWindow = this.#document.defaultView as GoogleAnalyticsWindow | null;
    if (!browserWindow?.gtag) return;

    browserWindow.gtag('event', 'page_view', {
      page_title: this.#document.title,
      page_location: browserWindow.location.href,
      page_path: path,
    });
  }

  #loadSearchAssets(): void {
    if (!this.#document.head.querySelector('link[data-pagefind-ui]')) {
      const stylesheet = this.#document.createElement('link');
      stylesheet.rel = 'stylesheet';
      stylesheet.href = '/pagefind/pagefind-component-ui.css';
      stylesheet.dataset['pagefindUi'] = '';
      this.#document.head.appendChild(stylesheet);
    }
    if (!this.#document.head.querySelector('script[data-pagefind-ui]')) {
      const script = this.#document.createElement('script');
      script.type = 'module';
      script.src = '/pagefind/pagefind-component-ui.js';
      script.dataset['pagefindUi'] = '';
      this.#document.head.appendChild(script);
    }
  }
}
