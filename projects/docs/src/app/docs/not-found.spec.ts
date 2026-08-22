import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NotFoundComponent } from './not-found';

describe('NotFoundComponent', () => {
  it('links EN home without a Japanese prefix', async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    const home = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('a')!;
    expect(home.getAttribute('href')).toBe('/');
  });

  it('links JA home as /ja without a trailing slash', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [{ provide: LOCALE_ID, useValue: 'ja' }],
    }).compileComponents();

    const fixture = TestBed.createComponent(NotFoundComponent);
    fixture.detectChanges();
    const home = (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>('a')!;
    expect(home.getAttribute('href')).toBe('/ja');
  });
});
