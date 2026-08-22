import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../seo.service';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `<section class="not-found" data-pagefind-ignore>
    <p class="page-header__eyebrow">404</p>
    <h1>Page not found</h1>
    <p>The page may have moved or no longer exists.</p>
    <a class="button button--primary" routerLink="/">Back home</a>
  </section>`,
})
export class NotFoundPage {
  readonly #seo = inject(SeoService);

  constructor() {
    this.#seo.setPage({
      title: 'Page not found — rdlabo.dev',
      description: 'The requested page could not be found.',
      path: '/not-found',
      noIndex: true,
    });
  }
}
