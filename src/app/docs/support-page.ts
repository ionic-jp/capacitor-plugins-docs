import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-support-page',
  template: `
    <article class="mx-auto max-w-4xl px-6 py-20 sm:px-10 sm:py-28">
      <p class="m-0 text-sm font-semibold tracking-[0.18em] text-[#c44320] uppercase">
        <ng-container i18n="@@supportEyebrow">Support open source</ng-container>
      </p>
      <h1
        class="mt-5 mb-0 max-w-3xl text-[clamp(3rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.065em] text-[#211d1b]"
      >
        <ng-container i18n="@@supportHeading">Help rdlabo projects keep moving</ng-container>
      </h1>
      <p class="mt-8 max-w-2xl text-xl leading-9 text-[#675e59]">
        <ng-container i18n="@@supportIntro"
          >The projects documented here are maintained personally by rdlabo. Sponsorship supports
          the collection as a whole, rather than one individual library.</ng-container
        >
      </p>

      <section
        class="mt-14 overflow-hidden rounded-3xl border border-[#eadfd9] bg-[#fffaf7] sm:grid sm:grid-cols-[1fr_auto] sm:items-center"
      >
        <div class="p-7 sm:p-10">
          <h2 class="m-0 text-2xl font-semibold tracking-[-0.035em] text-[#211d1b]">
            <ng-container i18n="@@supportSponsorHeading">Sponsor on GitHub</ng-container>
          </h2>
          <p class="mt-4 mb-0 max-w-xl leading-7 text-[#6f6661]">
            <ng-container i18n="@@supportSponsorDescription"
              >Your support helps fund maintenance, compatibility updates, documentation, and new
              features across rdlabo's open source projects.</ng-container
            >
          </p>
        </div>
        <div class="border-t border-[#eadfd9] p-7 sm:border-t-0 sm:border-l sm:p-10">
          <a
            class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#ea572a] px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-[#c44320] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea572a]"
            href="https://github.com/sponsors/rdlabo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ng-container i18n="@@becomeSponsor">Become a sponsor</ng-container>
            <span aria-hidden="true">&nbsp;→</span>
          </a>
        </div>
      </section>

      <p class="mt-10 max-w-2xl border-l-2 border-[#ea572a] pl-4 text-sm leading-6 text-[#675e59]">
        <ng-container i18n="@@supportIndependenceNotice"
          >Sponsorship supports open source work maintained personally by rdlabo. It is independent
          of the incorporated association that also uses the rdlabo name.</ng-container
        >
      </p>
    </article>
  `,
})
export class SupportPageComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage({
      title: $localize`:@@supportPageTitle:Support open source - rdlabo.dev`,
      description: $localize`:@@supportPageDescription:Support maintenance, documentation, and development across rdlabo's open source projects.`,
      path: '/support',
    });
  }
}
