import { Component, input } from '@angular/core';
import { ProjectIcon } from './docs-data';

@Component({
  selector: 'app-project-icon',
  template: `
    @switch (kind()) {
      @case ('payments') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect
            x="3.5"
            y="8.5"
            width="25"
            height="15"
            rx="3"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <path d="M3.5 13.5h25" stroke="currentColor" stroke-width="1.75" />
          <rect x="7" y="17.5" width="7" height="2.5" rx="0.75" fill="currentColor" />
        </svg>
      }
      @case ('identity') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 4.75 7.5 8.5v7.25c0 5.4 3.55 8.85 8.5 10.5 4.95-1.65 8.5-5.1 8.5-10.5V8.5L16 4.75Z"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1.75"
          />
          <path
            d="m12 16.25 2.5 2.5 5.5-5.5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.75"
          />
        </svg>
      }
      @case ('terminal') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect
            x="8.5"
            y="6.5"
            width="15"
            height="19"
            rx="3"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <rect
            x="11.5"
            y="10"
            width="9"
            height="6"
            rx="1.25"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <path
            d="M13 20.5h6M14.5 23.5h3"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.75"
          />
        </svg>
      }
      @case ('ads') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect
            x="5"
            y="5"
            width="22"
            height="22"
            rx="5"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <path
            d="M10 21.5 15.25 10h2.2L22 21.5M12.2 17h7.7"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.75"
          />
        </svg>
      }
      @case ('lint') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M6 8.5h12M6 16h8M6 23.5h12"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.75"
          />
          <path
            d="m20 19 2.5 2.5 4.5-6"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.75"
          />
        </svg>
      }
      @case ('server') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect
            x="5"
            y="6"
            width="22"
            height="8"
            rx="2"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <rect
            x="5"
            y="18"
            width="22"
            height="8"
            rx="2"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <circle cx="9" cy="10" r="1" fill="currentColor" />
          <circle cx="9" cy="22" r="1" fill="currentColor" />
          <path
            d="M13 10h9M13 22h9"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.75"
          />
        </svg>
      }
      @case ('app') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect
            x="8"
            y="3.5"
            width="16"
            height="25"
            rx="3"
            stroke="currentColor"
            stroke-width="1.75"
          />
          <path
            d="M13 7h6M14 25h4"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.75"
          />
        </svg>
      }
      @case ('theme') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 4.75c-6.35 0-11.5 4.55-11.5 10.15 0 4.35 2.85 7.35 7.1 7.35 1.55 0 2.8-1.2 2.8-2.7 0-.85-.35-1.55-.35-2.35 0-1.5 1.2-2.7 2.7-2.7h2.55c4.45 0 8.2-3.35 8.2-7.95C27.5 7.35 22.55 4.75 16 4.75Z"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1.75"
          />
          <circle cx="10.5" cy="12.5" r="1.35" fill="currentColor" />
          <circle cx="15.5" cy="9.5" r="1.35" fill="currentColor" />
          <circle cx="20.75" cy="11.75" r="1.35" fill="currentColor" />
        </svg>
      }
      @case ('docs') {
        <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M9.5 4.5h9.5L23.5 9.5V27a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V6.5a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1.75"
          />
          <path
            d="M19 4.5V9h4.5"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="1.75"
          />
          <path
            d="M12 15h8M12 19.5h8M12 24h5"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.75"
          />
        </svg>
      }
    }
  `,
  styles: `
    :host {
      display: block;
      width: 2rem;
      height: 2rem;
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class ProjectIconComponent {
  readonly kind = input.required<ProjectIcon>();
}
