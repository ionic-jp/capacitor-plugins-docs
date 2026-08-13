import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { pluginDocs } from './docs-data';

interface PluginIndexCopy {
  label: string;
  capability: string;
}

const PLUGIN_INDEX_COPY: Record<string, PluginIndexCopy> = {
  stripe: {
    label: 'Stripe',
    capability:
      'Accept PaymentSheet and PaymentFlow, plus Apple Pay and Google Pay, from one Capacitor codebase.',
  },
  'stripe-identity': {
    label: 'Stripe Identity',
    capability:
      'Present Stripe Identity verification on native platforms and the web, then handle the result events.',
  },
  'stripe-terminal': {
    label: 'Stripe Terminal',
    capability:
      'Discover and connect readers, collect in-person payments, and listen for reader events including Tap to Pay.',
  },
};

@Component({
  selector: 'app-plugin-index',
  imports: [RouterLink],
  template: `
    <section
      class="mx-auto max-w-[800px] px-10 pt-[70px] pb-20 max-[960px]:pt-[55px] max-[576px]:px-[18px] max-[576px]:pt-[46px] max-[576px]:pb-[65px]"
    >
      <h1
        class="mt-0 mb-7 max-w-[900px] text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.045em] max-[576px]:text-[2.5rem]"
      >
        Plugins
      </h1>
      <p
        class="max-w-[820px] text-[1.25rem] leading-[1.65] text-[#505c64] max-[576px]:text-[1.05rem]"
      >
        These Capacitor Community plugins wrap Stripe's native SDKs. Use them to accept in-app
        payments, present identity verification, and collect in-person payments from a single
        codebase.
      </p>

      <ul class="mt-16 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-2 xl:grid-cols-3">
        @for (card of cards; track card.id) {
          <li class="min-h-[240px]">
            <a
              class="group flex h-full flex-col rounded-2xl border border-[rgba(92,147,187,0.17)] px-6 py-6 text-[#333] no-underline transition-[border-color,background-color,box-shadow] hover:border-[#119eff] hover:bg-[#f0f6ff] hover:shadow-[0_8px_24px_rgba(17,158,255,0.12)] focus-visible:border-[#119eff] focus-visible:bg-[#f0f6ff] focus-visible:shadow-[0_8px_24px_rgba(17,158,255,0.12)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#119eff]"
              [routerLink]="card.path"
            >
              <span
                class="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#f0f6ff] text-[#0f83fd] transition-colors group-hover:bg-white group-focus-visible:bg-white"
                aria-hidden="true"
              >
                @switch (card.id) {
                  @case ('stripe') {
                    <svg class="size-8" viewBox="0 0 32 32" fill="none">
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
                  @case ('stripe-identity') {
                    <svg class="size-8" viewBox="0 0 32 32" fill="none">
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
                  @case ('stripe-terminal') {
                    <svg class="size-8" viewBox="0 0 32 32" fill="none">
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
                }
              </span>
              <h2 class="m-0 text-[1.25rem] font-semibold tracking-[-0.02em] text-[#333]">
                {{ card.label }}
              </h2>
              <p
                class="mt-2 mb-0 font-[ui-monospace,SFMono-Regular,Menlo,Consolas,monospace] text-[0.8rem] leading-[1.45] text-[#0f83fd]"
              >
                {{ card.packageName }}
              </p>
              <p class="mt-3 mb-0 text-[0.95rem] leading-[1.55] text-[#505c64]">
                {{ card.capability }}
              </p>
            </a>
          </li>
        }
      </ul>
    </section>
  `,
})
export class PluginIndexComponent implements OnInit {
  private readonly title = inject(Title);
  protected readonly cards = pluginDocs.map((plugin) => {
    const copy = PLUGIN_INDEX_COPY[plugin.id];
    return {
      id: plugin.id,
      path: '/' + plugin.id,
      packageName: plugin.packageName,
      label: copy?.label ?? plugin.name,
      capability: copy?.capability ?? plugin.description,
    };
  });

  ngOnInit(): void {
    this.title.setTitle('Capacitor Community Stripe plugins');
  }
}
