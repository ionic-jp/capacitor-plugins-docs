import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Title } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  loadProject,
  projectCatalog,
  projectCategoriesForLocale,
  projectGroupsForLocale,
  projectsForLocale,
} from './docs-data';
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

  it('renders the rdlabo.dev brand and project catalog', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(TestBed.inject(Title).getTitle()).toBe('rdlabo.dev');
    expect(compiled.querySelector('h1')?.textContent).toContain('rdlabo.dev');
    expect(compiled.textContent).toContain('developed and maintained personally by rdlabo');
    expect(compiled.textContent).toContain('independent of the incorporated association');
    expect(compiled.querySelector('img[src="/assets/brand/rdlabo-logo.svg"]')).not.toBeNull();

    const cards = Array.from(compiled.querySelectorAll<HTMLAnchorElement>('li > a'));
    const groupedProjects = projectGroupsForLocale('en').flatMap((group) => group.projects);
    expect(cards.map((card) => card.getAttribute('href'))).toEqual(
      groupedProjects.map((project) => project.path),
    );
    expect(cards.map((card) => card.querySelector('h3')?.textContent?.trim())).toEqual([
      'Stripe',
      'Stripe Identity',
      'Stripe Terminal',
      'AdMob',
      'Capacitor Code Scanner',
      'Capacitor Screenshot Event',
      'Capacitor Printer',
      'Capacitor Brother Print',
      'Ionic Angular Kit',
      'Ionic Angular Photo Editor',
      'Ionic Angular Scroll Header',
      'Angular CDK Scroll Strategies',
      'Ionic Theme iOS26',
      'Ionic Theme MD3',
      'Ionic Angular Collect Icons',
      'Workers Hono Kit',
      'ESLint Plugin Rules',
      'Capacitor Docgen',
    ]);
    expect(compiled.querySelectorAll('app-project-icon')).toHaveLength(18);
  });

  it('keeps Japanese catalog metadata and lazy documentation in parity', async () => {
    const japaneseProjects = projectsForLocale('ja');
    expect(japaneseProjects).toHaveLength(projectCatalog.length);
    expect(projectCatalog).toHaveLength(18);
    expect(japaneseProjects.flatMap((project) => project.pages)).toHaveLength(70);
    expect(japaneseProjects.find((project) => project.id === 'stripe')?.pages[0].navTitle).toBe(
      '設定',
    );

    const admob = await loadProject('admob', 'ja');
    expect(admob?.pages.find((page) => page.slug === 'consent')?.html).toContain(
      '広告をロードする前にプライバシー情報を取得します',
    );
    const eslint = await loadProject('eslint-plugin-rules', 'ja');
    expect(eslint?.version).toBe('21.3.0');
    expect(eslint?.pages.find((page) => page.slug === 'rules')?.html).toContain(
      'signal-use-as-signal-template',
    );
    const restrictTryBlock = eslint?.pages.find((page) => page.slug === 'rules/restrict-try-block');
    expect(restrictTryBlock?.path).toBe(
      '/projects/eslint-plugin-rules/docs/rules/restrict-try-block',
    );
    expect(restrictTryBlock?.html).toMatch(/オプション|Options/);
    expect(restrictTryBlock?.html).toContain('allowPromise');
    expect(restrictTryBlock?.html).toContain('incorrect');
    const hono = await loadProject('workers-hono-kit', 'ja');
    expect(hono?.version).toBe('0.10.6');
    expect(hono?.pages.find((page) => page.slug === 'data-layer')?.html).toContain(
      'primaryHyperdrive',
    );
    const ionic = await loadProject('ionic-angular-kit', 'ja');
    expect(ionic?.version).toBe('21.6.2');
    expect(ionic?.pages.find((page) => page.slug === 'offline-realtime')?.html).toContain(
      'createOfflineAuthBridge',
    );
    const iosTheme = await loadProject('ionic-theme-ios26', 'ja');
    expect(iosTheme?.version).toBe('2.3.2');
    expect(iosTheme?.pages.find((page) => page.slug === 'readme')?.html).toContain(
      'iosTransitionAnimation',
    );
    expect(iosTheme?.pages.find((page) => page.slug === 'using-ion-item-group')?.html).toContain(
      'md-ion-list-inset.css',
    );
    const md3Theme = await loadProject('ionic-theme-md3', 'ja');
    expect(md3Theme?.version).toBe('1.1.0');
    expect(md3Theme?.pages.find((page) => page.slug === 'readme')?.html).toContain(
      'mdTransitionAnimation',
    );
  });

  it('defines localized categories before adding non-Capacitor projects', () => {
    expect(projectCategoriesForLocale('en').map((category) => category.id)).toEqual([
      'capacitor-plugins',
      'frontend-tools',
      'developer-tools',
    ]);
    expect(projectCategoriesForLocale('ja').map((category) => category.label)).toEqual([
      'Capacitorプラグイン',
      'フロントエンドツール',
      '開発ツール',
    ]);
    expect(
      projectGroupsForLocale('en')
        .find((group) => group.id === 'frontend-tools')
        ?.projects.map((project) => project.id)
        .slice()
        .sort(),
    ).toEqual(
      [
        'ionic-angular-kit',
        'ionic-angular-photo-editor',
        'ionic-angular-scroll-header',
        'ngx-cdk-scroll-strategies',
        'ionic-theme-ios26',
        'ionic-theme-md3',
        'ionic-angular-collect-icons',
      ].sort(),
    );
    expect(
      projectGroupsForLocale('en')
        .find((group) => group.id === 'developer-tools')
        ?.projects.map((project) => project.id)
        .slice()
        .sort(),
    ).toEqual(['capacitor-docgen', 'eslint-plugin-rules', 'workers-hono-kit'].sort());
  });
});
