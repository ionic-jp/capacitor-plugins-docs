import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { ArticleDetail } from '../../articles/article-data';
import { ArticlePage } from './article-page';

describe('ArticlePage', () => {
  const article: ArticleDetail = {
    slug: 'test-slug',
    title: 'Test Article',
    description: 'Test description',
    emoji: '📝',
    sourceName: 'Zenn',
    originalUrl: 'https://zenn.dev/rdlabo/articles/test-slug',
    publishedAt: '2026-01-01T00:00:00.000Z',
    publishedDate: '2026-01-01',
    html: '<p>Article body</p>',
    headings: [
      { id: 'first-section', text: 'First section', level: 2 },
      { id: 'nested-section', text: 'Nested section', level: 3 },
    ],
  };

  let fixture: ComponentFixture<ArticlePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlePage],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { data: { article } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlePage);
    fixture.detectChanges();
  });

  it('places the translation notice before the article body and only once', () => {
    const root = fixture.nativeElement as HTMLElement;
    const notices = root.querySelectorAll('.article-original');

    expect(notices).toHaveLength(1);
    expect(notices[0]?.tagName).toBe('ASIDE');
    expect(notices[0]?.textContent).toContain('This article is an English translation.');

    const articleMain = root.querySelector('.article-main');
    const children = Array.from(articleMain?.children ?? []);
    const noticeIndex = children.findIndex((element) =>
      element.classList.contains('article-original'),
    );
    const contentIndex = children.findIndex((element) =>
      element.classList.contains('article-content'),
    );

    expect(noticeIndex).toBeGreaterThan(-1);
    expect(contentIndex).toBeGreaterThan(noticeIndex);
  });

  it('renders only level-two headings in the contents list', () => {
    const root = fixture.nativeElement as HTMLElement;
    const topList = root.querySelector('.article-sidebar__list');
    const topItems = topList?.querySelectorAll(':scope > li');

    expect(topList?.tagName).toBe('UL');
    expect(topList?.classList.contains('article-sidebar__list')).toBe(true);
    expect(topItems).toHaveLength(1);
    expect(topList?.querySelector('ul')).toBeNull();

    const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('.article-sidebar__link'));
    expect(links.map((link) => [link.textContent?.trim(), link.getAttribute('href')])).toEqual([
      ['First section', '/articles/test-slug#first-section'],
    ]);
  });

  it('includes the shared sidebar with resource links', () => {
    const root = fixture.nativeElement as HTMLElement;
    const sidebar = root.querySelector('.article-sidebar');

    expect(sidebar).not.toBeNull();
    expect(root.querySelectorAll('.article-sidebar__resource-link')).toHaveLength(3);
  });

  it('keeps the shared sidebar when there are no level-two headings', async () => {
    await TestBed.resetTestingModule()
      .configureTestingModule({
        imports: [ArticlePage],
        providers: [
          provideRouter([]),
          {
            provide: ActivatedRoute,
            useValue: {
              snapshot: {
                data: {
                  article: {
                    ...article,
                    headings: [{ id: 'nested-section', text: 'Nested section', level: 3 }],
                  },
                },
              },
            },
          },
        ],
      })
      .compileComponents();

    const emptyTocFixture = TestBed.createComponent(ArticlePage);
    emptyTocFixture.detectChanges();
    const root = emptyTocFixture.nativeElement as HTMLElement;

    expect(root.querySelector('.article-sidebar')).not.toBeNull();
    expect(root.querySelector('.article-sidebar__list')).toBeNull();
    expect(root.querySelectorAll('.article-sidebar__resource-link')).toHaveLength(3);
  });
});
