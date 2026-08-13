import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { LandingPageComponent } from './landing-page';

describe('LandingPageComponent', () => {
  let fixture: ComponentFixture<LandingPageComponent>;

  async function setup(pluginId: string): Promise<HTMLElement> {
    await TestBed.configureTestingModule({
      imports: [LandingPageComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { pluginId } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders Stripe copy without a right-side illustration', async () => {
    const compiled = await setup('stripe');
    const title = TestBed.inject(Title);

    expect(title.getTitle()).toBe('@capacitor-community/stripe Documentation');
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Accept Stripe payments in Capacitor apps',
    );
    expect(compiled.textContent).toContain('What you can build');
    expect(compiled.textContent).toContain('PaymentSheet');
    expect(compiled.textContent).toContain('PaymentFlow');
    expect(compiled.textContent).toContain('Apple Pay');
    expect(compiled.textContent).toContain('Google Pay');
    expect(compiled.textContent).toContain('Web integration');
    expect(compiled.textContent).toContain('Used');
    expect(compiled.querySelector('img[alt="Capacitor and Stripe illustration"]')).toBeNull();
    expect(compiled.textContent).not.toContain('Earn on mobile app with web tech');
  });

  it('renders Identity copy without the ID visual and without overclaiming verification', async () => {
    const compiled = await setup('stripe-identity');

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Present Stripe Identity verification in Capacitor apps',
    );
    expect(compiled.textContent).toContain('What you can do');
    expect(compiled.textContent).toContain('Identity Verification Sheet');
    expect(compiled.textContent).toContain('Result events');
    expect(compiled.textContent).toContain('Stripe performs the verification');
    expect(compiled.textContent).not.toMatch(/\bID\b/);
    expect(compiled.textContent).not.toContain('Used');
  });

  it('renders Terminal copy without the TERM visual', async () => {
    const compiled = await setup('stripe-terminal');

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Collect in-person payments with Stripe Terminal',
    );
    expect(compiled.textContent).toContain('What you can do');
    expect(compiled.textContent).toContain('Reader discovery and connection');
    expect(compiled.textContent).toContain('Tap to Pay');
    expect(compiled.textContent).toContain('Software update events');
    expect(compiled.textContent).not.toContain('TERM');
    expect(compiled.textContent).not.toContain('Used');
  });
});
