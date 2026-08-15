import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { loadProject } from './docs-data';
import { LandingPageComponent } from './landing-page';

describe('LandingPageComponent', () => {
  let fixture: ComponentFixture<LandingPageComponent>;

  async function setup(projectId: string): Promise<HTMLElement> {
    const project = await loadProject(projectId);
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { project } } } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a manifest-driven Stripe landing page', async () => {
    const compiled = await setup('stripe');
    expect(TestBed.inject(Title).getTitle()).toBe('Stripe - rdlabo.dev');
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Accept Stripe payments in Capacitor apps',
    );
    expect(compiled.textContent).toContain('@capacitor-community/stripe');
    expect(compiled.textContent).toContain('PaymentSheet');
    expect(
      compiled.querySelector('a[href="/projects/capacitor-stripe/docs/configuration"]'),
    ).not.toBeNull();
  });

  it('renders AdMob from the same project presentation model', async () => {
    const compiled = await setup('admob');
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Monetize Capacitor apps with Google AdMob',
    );
    expect(compiled.textContent).toContain('Banner ads');
    expect(compiled.textContent).toContain('Consent controls');
    expect(
      compiled.querySelector('a[href="https://github.com/capacitor-community/admob"]'),
    ).not.toBeNull();
  });
});
