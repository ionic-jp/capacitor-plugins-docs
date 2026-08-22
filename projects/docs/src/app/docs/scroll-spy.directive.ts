import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { activationLine, normalizeHeadingId, selectActiveHeading } from './scroll-spy';

@Directive({ selector: '[appScrollSpy]' })
export class ScrollSpyDirective implements AfterViewInit, OnDestroy {
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #document = inject(DOCUMENT);
  readonly #platformId = inject(PLATFORM_ID);
  #frame = 0;
  #observer?: IntersectionObserver;
  #resizeObserver?: ResizeObserver;
  #elements: { key: string; element: HTMLElement }[] = [];
  #lastKey = '';

  @Input({ required: true }) appScrollSpy: readonly string[] = [];
  @Output() activeHeadingChange = new EventEmitter<string>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    const view = this.#document.defaultView;
    if (!view) return;
    this.#elements = this.#resolveElements();
    view.addEventListener('scroll', this.#schedule, { passive: true });
    view.addEventListener('resize', this.#schedule, { passive: true });
    if ('IntersectionObserver' in view) {
      this.#observer = new view.IntersectionObserver(this.#schedule, {
        rootMargin: '-20% 0px -65% 0px',
      });
      this.#elements.forEach(({ element }) => this.#observer?.observe(element));
    }
    if ('ResizeObserver' in view) {
      this.#resizeObserver = new view.ResizeObserver(this.#schedule);
      this.#resizeObserver.observe(this.#host.nativeElement);
    }
    this.#schedule();
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.#platformId)) return;
    const view = this.#document.defaultView;
    if (view) {
      view.removeEventListener('scroll', this.#schedule);
      view.removeEventListener('resize', this.#schedule);
      if (this.#frame) view.cancelAnimationFrame(this.#frame);
    }
    this.#observer?.disconnect();
    this.#resizeObserver?.disconnect();
  }

  #resolveElements(): { key: string; element: HTMLElement }[] {
    const headings = Array.from(
      this.#host.nativeElement.querySelectorAll<HTMLElement>('h1, h2, h3, h4'),
    );
    return this.appScrollSpy
      .map((key) => {
        if (!key) return { key, element: headings[0] ?? this.#host.nativeElement };
        const normalized = normalizeHeadingId(key);
        const element = headings.find((heading) => normalizeHeadingId(heading.id) === normalized);
        return element ? { key, element } : undefined;
      })
      .filter((entry): entry is { key: string; element: HTMLElement } => Boolean(entry));
  }

  readonly #schedule = (): void => {
    const view = this.#document.defaultView;
    if (!view || this.#frame) return;
    this.#frame = view.requestAnimationFrame(() => {
      this.#frame = 0;
      const active = selectActiveHeading(
        this.#elements.map(({ key, element }) => ({
          id: key,
          top: element.getBoundingClientRect().top,
        })),
        activationLine(view.innerHeight),
      );
      if (active !== this.#lastKey) {
        this.#lastKey = active;
        this.activeHeadingChange.emit(active);
      }
    });
  };
}
