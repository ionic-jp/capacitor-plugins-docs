import { Component, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PluginDocs, findPlugin } from './docs-data';

interface LandingFeature {
  title: string;
  description: string;
}

interface LandingCopy {
  headline: string;
  overview: string;
  featuresHeading: string;
  features: readonly LandingFeature[];
}

const LANDING_COPY: Record<string, LandingCopy> = {
  stripe: {
    headline: 'Accept Stripe payments in Capacitor apps',
    overview:
      'Use @capacitor-community/stripe to present native PaymentSheet and PaymentFlow, accept Apple Pay and Google Pay, and integrate payments on the web from the same Capacitor codebase.',
    featuresHeading: 'What you can build',
    features: [
      {
        title: 'PaymentSheet',
        description: 'Collect payment in a single native flow with PaymentIntent or SetupIntent.',
      },
      {
        title: 'PaymentFlow',
        description:
          'Collect payment details first, then confirm after an intermediate step in your app.',
      },
      {
        title: 'Apple Pay',
        description: 'Present Apple Pay for instant checkout where it is available.',
      },
      {
        title: 'Google Pay',
        description: 'Present Google Pay for instant checkout where it is available.',
      },
      {
        title: 'Web integration',
        description:
          'Use the same plugin APIs with web frameworks and browsers alongside native apps.',
      },
    ],
  },
  'stripe-identity': {
    headline: 'Present Stripe Identity verification in Capacitor apps',
    overview:
      "Use @capacitor-community/stripe-identity to present Stripe's identity verification sheet on native platforms and the web. Your app listens for result events; Stripe performs the verification.",
    featuresHeading: 'What you can do',
    features: [
      {
        title: 'Identity Verification Sheet',
        description:
          'Create and present the verification sheet from Capacitor after your backend supplies the required session credentials.',
      },
      {
        title: 'Native and web',
        description:
          'Use one API across platforms. On the web, call initialize before creating and presenting the sheet.',
      },
      {
        title: 'Result events',
        description:
          'Register listeners for verification result events before presenting the sheet so outcomes are not missed.',
      },
    ],
  },
  'stripe-terminal': {
    headline: 'Collect in-person payments with Stripe Terminal',
    overview:
      'Use @capacitor-community/stripe-terminal to discover and connect readers, collect and confirm PaymentIntents, and respond to reader display, status, input, and software update events—including Tap to Pay where supported.',
    featuresHeading: 'What you can do',
    features: [
      {
        title: 'In-person payments',
        description:
          'Collect a payment method on a connected reader and confirm the PaymentIntent.',
      },
      {
        title: 'Reader discovery and connection',
        description:
          'Discover nearby or simulated readers, then connect before collecting payment details.',
      },
      {
        title: 'Reader display, status, and input',
        description:
          'Set or clear reader display content and listen for status messages and input prompts during checkout.',
      },
      {
        title: 'Software update events',
        description:
          'Listen for available reader software updates and track install progress while updates run.',
      },
      {
        title: 'Tap to Pay',
        description: 'Connect with Tap to Pay on devices and configurations that support it.',
      },
    ],
  },
};

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  template: `
    @if (plugin && copy) {
      <section
        class="mx-auto max-w-[800px] px-10 pt-[70px] pb-20 max-[960px]:pt-[55px] max-[576px]:px-[18px] max-[576px]:pt-[46px] max-[576px]:pb-[65px]"
      >
        <p class="text-[0.85rem] font-bold tracking-[0.06em] text-[#0f83fd] uppercase">
          {{ plugin.packageName }}
        </p>
        <h1
          class="mt-4 mb-7 max-w-[900px] text-[clamp(2.5rem,5vw,4rem)] leading-[1.05] tracking-[-0.045em] max-[576px]:text-[2.5rem]"
        >
          {{ copy.headline }}
        </h1>
        <p
          class="max-w-[820px] text-[1.25rem] leading-[1.65] text-[#505c64] max-[576px]:text-[1.05rem]"
        >
          {{ copy.overview }}
        </p>
        <div class="mt-[34px] flex gap-3.5 max-[576px]:flex-wrap">
          <a
            class="rounded-[32px] border border-[rgba(92,147,187,0.2)] bg-[#119eff] px-[23px] py-[15px] text-white no-underline hover:opacity-80"
            [routerLink]="plugin.pages[0].path"
            >Get Started</a
          >
          <a
            class="rounded-[32px] border border-[rgba(92,147,187,0.2)] px-[23px] py-[15px] text-[#119eff] no-underline hover:opacity-80"
            href="https://capacitorjs.jp/"
            target="_blank"
            rel="noopener noreferrer"
            >Learn Capacitor</a
          >
        </div>

        <div class="mt-16 border-t border-[rgba(92,147,187,0.17)] pt-12">
          <h2 class="mb-6 text-[1.25rem] font-semibold tracking-[-0.02em] text-[#333]">
            {{ copy.featuresHeading }}
          </h2>
          <ul class="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            @for (feature of copy.features; track feature.title) {
              <li class="rounded-2xl border border-[rgba(92,147,187,0.17)] px-5 py-5">
                <h3 class="m-0 text-[1.05rem] font-semibold tracking-[-0.02em] text-[#333]">
                  {{ feature.title }}
                </h3>
                <p class="mt-2 mb-0 text-[0.95rem] leading-[1.55] text-[#505c64]">
                  {{ feature.description }}
                </p>
              </li>
            }
          </ul>
        </div>
      </section>
      @if (plugin.id === 'stripe') {
        <section class="mx-auto mb-[75px] max-w-[800px] px-10 max-[576px]:px-[18px]">
          <h2 class="text-[1.25rem]">Used</h2>
          <div class="flex flex-wrap items-center gap-7">
            <a href="https://www.doctr.ca/" target="_blank" rel="noopener noreferrer">
              <img
                class="h-auto max-h-[72px] w-[170px] object-contain max-[576px]:w-[130px]"
                src="/assets/stripe/doctr.svg"
                alt="Doctr"
              />
            </a>
            <a href="https://www.sunset-palmi.it/" target="_blank" rel="noopener noreferrer">
              <img
                class="h-auto max-h-[72px] w-[170px] object-contain max-[576px]:w-[130px]"
                src="/assets/stripe/sunset.png"
                alt="Sunset"
              />
            </a>
            <a href="https://www.vegasbuilt.com/" target="_blank" rel="noopener noreferrer">
              <img
                class="h-auto max-h-[72px] w-[170px] object-contain max-[576px]:w-[130px]"
                src="/assets/stripe/vegasbuilt.svg"
                alt="Vegas Built"
              />
            </a>
          </div>
        </section>
      }
    }
  `,
})
export class LandingPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  plugin?: PluginDocs;
  copy?: LandingCopy;

  ngOnInit(): void {
    this.plugin = findPlugin(this.route.snapshot.data['pluginId'] as string);
    if (!this.plugin) return;
    this.copy = LANDING_COPY[this.plugin.id];
    this.title.setTitle(`${this.plugin.packageName} Documentation`);
  }
}
