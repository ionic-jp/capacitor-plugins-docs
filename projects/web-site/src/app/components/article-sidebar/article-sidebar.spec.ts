import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ArticleSidebar } from './article-sidebar';

describe('ArticleSidebar', () => {
  let fixture: ComponentFixture<ArticleSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleSidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleSidebar);
    fixture.detectChanges();
  });

  it('renders the shared external resource links', () => {
    const root = fixture.nativeElement as HTMLElement;
    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>('.article-sidebar__resource-link'),
    );

    expect(
      links.map((link) => [link.textContent?.trim(), link.href, link.target, link.rel]),
    ).toEqual([
      ['Support my OSS', 'https://docs.rdlabo.dev/support', '_blank', 'noopener noreferrer'],
      ['Zenn', 'https://zenn.dev/rdlabo', '_blank', 'noopener noreferrer'],
      ['X / @rdlabo', 'https://x.com/rdlabo', '_blank', 'noopener noreferrer'],
    ]);
  });

  it('renders contents links when headings are provided', () => {
    fixture.componentRef.setInput('tocHeadings', [{ id: 'intro', text: 'Introduction', level: 2 }]);
    fixture.componentRef.setInput('articleSlug', 'sample-slug');
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const tocLink = root.querySelector<HTMLAnchorElement>('.article-sidebar__link');

    expect(root.querySelector('.article-sidebar__label')?.textContent?.trim()).toBe('Contents');
    expect(tocLink?.textContent?.trim()).toBe('Introduction');
    expect(tocLink?.getAttribute('href')).toBe('/articles/sample-slug#intro');
    expect(root.querySelector('.article-sidebar__resources--separated')).not.toBeNull();
  });

  it('omits the contents section when there are no headings', () => {
    const root = fixture.nativeElement as HTMLElement;

    expect(root.querySelector('.article-sidebar__label')).toBeNull();
    expect(root.querySelector('.article-sidebar__list')).toBeNull();
    expect(root.querySelector('.article-sidebar__resources--separated')).toBeNull();
    expect(root.querySelectorAll('.article-sidebar__resource-link')).toHaveLength(3);
  });
});
