import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CodePanel } from './code-panel';
import { DocsPage, PluginDocs, findPage, findPlugin } from './docs-data';
import { SafeHtmlPipe } from './safe-html.pipe';
import { ScrollSpyDirective } from './scroll-spy.directive';

@Component({
  selector: 'app-docs-page',
  imports: [CodePanel, SafeHtmlPipe, ScrollSpyDirective],
  template: `
    @if (page && plugin) {
      <div class="mx-auto max-w-[1500px] pb-16">
        <div
          [class]="
            'grid items-start justify-center pt-[42px] max-[960px]:block max-[960px]:pt-7 ' +
            (page.codes.length
              ? 'grid-cols-[minmax(420px,800px)_minmax(420px,1fr)] max-[1100px]:grid-cols-[minmax(380px,1fr)_minmax(380px,1fr)]'
              : 'grid-cols-[minmax(0,800px)]')
          "
        >
          <article
            [class]="
              'znc min-w-0 px-6 pt-1.5 max-[576px]:px-4 [&_a]:[overflow-wrap:anywhere] [&>h1]:mt-0 ' +
              (page.codes.length
                ? 'pb-[calc(100dvh-120px)] max-[960px]:pb-[72px] [&_.code-block-container]:hidden max-[960px]:[&_.code-block-container]:block'
                : 'pb-[72px]')
            "
            [appScrollSpy]="headingKeys"
            (activeHeadingChange)="activate($event)"
          >
            <h1 id="document-title">{{ page.title }}</h1>
            <div [innerHTML]="page.html | safeHtml"></div>
            @if (page.codes.length) {
              <div class="hidden max-[960px]:block">
                @for (code of page.codes; track code.file) {
                  <div class="code-block-container">
                    <div class="code-block-filename-container">
                      <span class="code-block-filename">{{ code.file }}</span>
                    </div>
                    <pre
                      class="m-0 overflow-x-auto rounded-lg bg-[#151e2c] px-5 py-4 font-[ui-monospace,SFMono-Regular,Menlo,Consolas,monospace] text-[13px]/[1.3] text-[#e1e4e8]"
                    ><code>@for (line of code.lines; track $index) {<span
                          class="block min-h-[1.3em]"
                          [innerHTML]="line | safeHtml"
                        ></span>
}</code></pre>
                  </div>
                }
              </div>
            }
          </article>
          @if (page.codes.length) {
            <app-code-panel [codes]="page.codes" [activeLines]="activeLines" />
          }
        </div>
        <div class="mx-6 flex justify-end">
          <a
            class="inline-flex text-[0.9rem] text-[#333] no-underline hover:text-[#0f83fd]"
            [href]="page.editUrl"
            target="_blank"
            rel="noopener noreferrer"
            >Edit this page on GitHub</a
          >
        </div>
      </div>
    }
  `,
})
export class DocsPageComponent implements OnInit, AfterViewInit {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  plugin?: PluginDocs;
  page?: DocsPage;
  headingKeys: readonly string[] = [];
  activeLines: Record<string, readonly number[]> = {};

  ngOnInit(): void {
    const pluginId = this.route.snapshot.data['pluginId'] as string;
    const slug = this.route.snapshot.data['pageSlug'] as string;
    this.plugin = findPlugin(pluginId);
    this.page = findPage(pluginId, slug);
    if (!this.plugin || !this.page) return;
    this.headingKeys = this.page.scrollMap.map((entry) => entry.id);
    this.activeLines = { ...(this.page.scrollMap[0]?.activeLine ?? {}) };
    this.title.setTitle(`${this.page.title} - ${this.plugin.packageName} Documentation`);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.route.fragment.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((fragment) => {
      if (!fragment) return;
      this.document.defaultView?.requestAnimationFrame(() => {
        this.document.getElementById(fragment)?.scrollIntoView();
      });
    });
  }

  activate(id: string): void {
    const entry = this.page?.scrollMap.find((candidate) => candidate.id === id);
    if (entry) this.activeLines = { ...entry.activeLine };
  }
}
