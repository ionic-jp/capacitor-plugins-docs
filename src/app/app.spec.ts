import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { App } from './app';

@Component({
  standalone: true,
  template: '',
})
class StubPage {}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: '', pathMatch: 'full', component: StubPage },
          { path: 'stripe', component: StubPage },
          { path: 'stripe-identity', component: StubPage },
          { path: 'stripe-terminal', component: StubPage },
        ]),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show the shared brand and no selected plugin on the index route', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header')?.textContent).toContain('capacitor-community/plugins');
    const pluginsLink = compiled.querySelector<HTMLAnchorElement>(
      'aside[aria-label="Documentation"] a[href="/"]',
    );
    expect(pluginsLink?.textContent?.trim()).toBe('Plugins');
    expect(pluginsLink?.classList.contains('bg-[#f0f6ff]')).toBe(true);
    const accordionButtons = Array.from(
      compiled.querySelectorAll('aside[aria-label="Documentation"] button[aria-controls]'),
    );
    expect(accordionButtons.map((button) => button.getAttribute('aria-expanded'))).toEqual([
      'false',
      'false',
      'false',
    ]);
  });

  it('should render plugin accordion in the documentation sidebar without top Plugins nav', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/stripe');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('nav[aria-label="Plugins"]')).toBeNull();
    expect(
      compiled
        .querySelector<HTMLAnchorElement>('aside[aria-label="Documentation"] a[href="/"]')
        ?.textContent?.trim(),
    ).toBe('Plugins');

    const accordionButtons = Array.from(
      compiled.querySelectorAll('aside[aria-label="Documentation"] button[aria-controls]'),
    ) as HTMLButtonElement[];
    expect(accordionButtons.map((button) => button.getAttribute('aria-controls'))).toEqual([
      'plugin-panel-stripe',
      'plugin-panel-stripe-identity',
      'plugin-panel-stripe-terminal',
    ]);
    expect(
      accordionButtons.map((button) => button.querySelector('span')?.textContent?.trim()),
    ).toEqual(['Stripe', 'Stripe Identity', 'Stripe Terminal']);

    expect(accordionButtons.map((button) => button.id)).toEqual([
      'plugin-button-stripe',
      'plugin-button-stripe-identity',
      'plugin-button-stripe-terminal',
    ]);

    const [stripeButton, identityButton, terminalButton] = accordionButtons;
    expect(stripeButton.getAttribute('aria-expanded')).toBe('true');
    expect(identityButton.getAttribute('aria-expanded')).toBe('false');
    expect(terminalButton.getAttribute('aria-expanded')).toBe('false');

    const stripePanel = compiled.querySelector('#plugin-panel-stripe');
    const identityPanel = compiled.querySelector('#plugin-panel-stripe-identity');
    const terminalPanel = compiled.querySelector('#plugin-panel-stripe-terminal');
    expect(stripePanel).not.toBeNull();
    expect(identityPanel).not.toBeNull();
    expect(terminalPanel).not.toBeNull();
    expect(stripePanel?.getAttribute('aria-labelledby')).toBe('plugin-button-stripe');
    expect(identityPanel?.getAttribute('aria-labelledby')).toBe('plugin-button-stripe-identity');
    expect(terminalPanel?.getAttribute('aria-labelledby')).toBe('plugin-button-stripe-terminal');
    expect(stripePanel?.getAttribute('aria-hidden')).toBe('false');
    expect(identityPanel?.getAttribute('aria-hidden')).toBe('true');
    expect(terminalPanel?.getAttribute('aria-hidden')).toBe('true');
    expect(stripePanel?.hasAttribute('inert')).toBe(false);
    expect(identityPanel?.hasAttribute('inert')).toBe(true);
    expect(terminalPanel?.hasAttribute('inert')).toBe(true);
    expect(compiled.textContent).toContain('Introduction');
    expect(compiled.textContent).toContain('Configuration');
    expect(compiled.textContent).not.toContain('Configuration platform');
  });

  it('should expand Stripe Identity and navigate when its accordion is clicked', async () => {
    const fixture = TestBed.createComponent(App);
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/stripe');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const identityButton = Array.from(
      compiled.querySelectorAll('aside[aria-label="Documentation"] button[aria-controls]'),
    ).find((button) => button.getAttribute('aria-controls') === 'plugin-panel-stripe-identity') as
      HTMLButtonElement | undefined;
    expect(identityButton).toBeTruthy();
    identityButton!.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(router.url).toBe('/stripe-identity');
    expect(identityButton!.getAttribute('aria-expanded')).toBe('true');

    const stripePanel = compiled.querySelector('#plugin-panel-stripe');
    const identityPanel = compiled.querySelector('#plugin-panel-stripe-identity');
    expect(identityPanel).not.toBeNull();
    expect(stripePanel).not.toBeNull();
    expect(identityPanel?.getAttribute('aria-hidden')).toBe('false');
    expect(stripePanel?.getAttribute('aria-hidden')).toBe('true');
    expect(identityPanel?.hasAttribute('inert')).toBe(false);
    expect(stripePanel?.hasAttribute('inert')).toBe(true);
  });
});
