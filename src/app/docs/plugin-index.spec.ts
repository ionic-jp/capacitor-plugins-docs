import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { docsForLocale, pluginDocs } from './docs-data';
import { PluginIndexComponent } from './plugin-index';

describe('PluginIndexComponent', () => {
  let fixture: ComponentFixture<PluginIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PluginIndexComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PluginIndexComponent);
    fixture.detectChanges();
  });

  it('renders the intro and four plugin cards from pluginDocs', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = TestBed.inject(Title);

    expect(title.getTitle()).toBe('Capacitor Community plugins');
    expect(compiled.querySelector('h1')?.textContent?.trim()).toBe('Plugins');
    expect(compiled.textContent).toContain('Capacitor Community plugins bring native payments');
    expect(compiled.querySelectorAll('img')).toHaveLength(0);

    const cards = Array.from(compiled.querySelectorAll('a[href]')) as HTMLAnchorElement[];
    expect(cards.map((card) => card.getAttribute('href'))).toEqual([
      '/stripe',
      '/stripe-identity',
      '/stripe-terminal',
      '/admob',
    ]);
    expect(cards.map((card) => card.querySelector('h2')?.textContent?.trim())).toEqual([
      'Stripe',
      'Stripe Identity',
      'Stripe Terminal',
      'AdMob',
    ]);
    expect(cards.map((card) => card.textContent)).toEqual(
      pluginDocs.map((plugin) => expect.stringContaining(plugin.packageName)),
    );
    expect(compiled.textContent).toContain('PaymentSheet');
    expect(compiled.textContent).toContain('identity verification');
    expect(compiled.textContent).toContain('in-person payments');
    expect(compiled.textContent).toContain('rewarded interstitial');
    expect(compiled.querySelectorAll('svg')).toHaveLength(4);
  });

  it('provides Japanese navigation and documentation content for every page', () => {
    const japaneseDocs = docsForLocale('ja');
    expect(japaneseDocs).toHaveLength(pluginDocs.length);
    expect(japaneseDocs.flatMap((plugin) => plugin.pages)).toHaveLength(26);
    expect(japaneseDocs.find((plugin) => plugin.id === 'stripe')?.pages[0].navTitle).toBe('設定');
    expect(
      japaneseDocs
        .find((plugin) => plugin.id === 'stripe-identity')
        ?.pages.find((page) => page.slug === 'identity-verification-sheet')?.html,
    ).toContain('本人確認書類を検証します');
    expect(
      japaneseDocs
        .find((plugin) => plugin.id === 'admob')
        ?.pages.find((page) => page.slug === 'consent')?.html,
    ).toContain('広告をロードする前にプライバシー情報を取得します');
  });
});
