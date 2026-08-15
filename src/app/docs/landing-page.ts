import { isPlatformBrowser } from '@angular/common';
import { Component, LOCALE_ID, OnInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectDocs } from './docs-data';
import { GitHubStarsService } from './github-stars.service';
import { SeoService } from './seo.service';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  template: `
    @if (project) {
      <article class="mx-auto max-w-5xl px-6 pt-16 pb-24 sm:px-10 sm:pt-24">
        <span
          aria-hidden="true"
          class="sr-only"
          [attr.data-pagefind-filter]="'project:' + project.id"
          >{{ project.shortName }}</span
        >
        <span
          aria-hidden="true"
          class="sr-only"
          [attr.data-pagefind-filter]="'category:' + project.category"
          >{{ project.category }}</span
        >
        <div class="max-w-3xl">
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <span
              class="rounded-full bg-[#fff0ea] px-3 py-1 font-semibold tracking-wide text-[#c44320]"
            >
              {{ project.packageName }}
            </span>
            <span class="text-[#80736d]">v{{ project.version }}</span>
          </div>
          <h1
            class="mt-7 mb-0 text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.98] font-semibold tracking-[-0.055em] text-[#211d1b]"
          >
            {{ project.headline }}
          </h1>
          <p class="mt-8 max-w-2xl text-xl leading-8 text-[#675e59] sm:text-2xl sm:leading-9">
            {{ project.overview }}
          </p>
          <div class="mt-9 flex flex-wrap gap-3">
            <a
              class="rounded-full bg-[#ea572a] px-6 py-3.5 font-semibold text-white no-underline transition hover:bg-[#c44320] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea572a]"
              [routerLink]="project.pages[0].path"
            >
              <ng-container i18n="@@getStarted">Get started</ng-container>
            </a>
            <a
              class="rounded-full border border-[#d9cec8] px-6 py-3.5 font-semibold text-[#3b3430] no-underline transition hover:border-[#ea572a] hover:text-[#c44320] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea572a]"
              [href]="project.repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ng-container i18n="@@viewSource">View source</ng-container>
            </a>
            <a
              class="inline-flex items-center overflow-hidden rounded-full border border-[#d9cec8] font-semibold text-[#3b3430] no-underline transition hover:border-[#ea572a] hover:text-[#c44320] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ea572a]"
              [href]="project.repositoryUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="flex items-center gap-2 px-5 py-3.5">
                <svg class="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="m12 3 2.72 5.51 6.08.88-4.4 4.29 1.04 6.06L12 16.88l-5.44 2.86 1.04-6.06-4.4-4.29 6.08-.88L12 3Z"
                    stroke="currentColor"
                    stroke-linejoin="round"
                    stroke-width="1.7"
                  />
                </svg>
                <ng-container i18n="@@starOnGitHub">Star on GitHub</ng-container>
              </span>
              @if (formattedStarCount(); as count) {
                <span class="border-l border-[#d9cec8] bg-[#fffaf7] px-4 py-3.5">
                  {{ count }}
                </span>
              }
            </a>
          </div>
        </div>

        <section class="mt-20 border-t border-[#eadfd9] pt-12">
          <h2 class="m-0 text-2xl font-semibold tracking-[-0.03em] text-[#211d1b]">
            {{ project.featuresHeading }}
          </h2>
          <ul class="mt-7 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            @for (feature of project.features; track feature.title) {
              <li class="rounded-2xl border border-[#eadfd9] bg-white px-5 py-5">
                <h3 class="m-0 text-lg font-semibold tracking-[-0.02em] text-[#292320]">
                  {{ feature.title }}
                </h3>
                <p class="mt-2 mb-0 leading-7 text-[#6f6661]">{{ feature.description }}</p>
              </li>
            }
          </ul>
        </section>
      </article>
    }
  `,
})
export class LandingPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly stars = inject(GitHubStarsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly numberFormat = new Intl.NumberFormat(inject(LOCALE_ID), {
    notation: 'compact',
    maximumFractionDigits: 1,
  });
  private readonly starCount = signal<number | undefined>(undefined);
  protected readonly formattedStarCount = () => {
    const count = this.starCount();
    return count === undefined ? undefined : this.numberFormat.format(count);
  };
  project?: ProjectDocs;

  ngOnInit(): void {
    this.project = this.route.snapshot.data['project'] as ProjectDocs | undefined;
    if (!this.project) return;
    this.seo.setPage({
      title: `${this.project.shortName} - rdlabo.dev`,
      description: this.project.description,
      path: this.project.path,
    });
    if (isPlatformBrowser(this.platformId)) {
      void this.loadStarCount(this.project.repositoryUrl);
    }
  }

  private async loadStarCount(repositoryUrl: string): Promise<void> {
    this.starCount.set(await this.stars.count(repositoryUrl));
  }
}
