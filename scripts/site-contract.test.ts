import assert from 'node:assert/strict';
import { access, constants, readFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import test from 'node:test';
import ts from 'typescript';
import { projectDefinitions } from './project-manifest';

const require = createRequire(import.meta.url);

async function installedEslintRuleNames(): Promise<string[]> {
  const packageJsonPath = require.resolve('@rdlabo/eslint-plugin-rules/package.json');
  try {
    const plugin = require('@rdlabo/eslint-plugin-rules') as { rules?: Record<string, unknown> };
    return Object.keys(plugin.rules ?? {}).sort();
  } catch {
    // Peer deps may be absent in this docs workspace; parse the published entry safely.
    const indexSource = await readFile(join(dirname(packageJsonPath), 'dist', 'index.js'), 'utf8');
    const rulesBlock = indexSource.match(/\brules:\s*\{([\s\S]*?)\n\s*\},?\s*\n\s*\};?\s*$/);
    assert.ok(rulesBlock, 'installed @rdlabo/eslint-plugin-rules must export a rules object');
    const names = [...rulesBlock[1].matchAll(/['"]([^'"]+)['"]\s*:/g)].map((match) => match[1]);
    assert.ok(names.length > 0, 'installed plugin rules object must list rule names');
    return [...names].sort();
  }
}

function yamlTitle(markdown: string): string {
  const frontMatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(frontMatter, 'rule markdown must include YAML front matter');
  const title = frontMatter[1].match(/^title:\s*(.+)\s*$/m)?.[1]?.trim();
  assert.ok(title, 'rule markdown must declare a YAML title');
  return title;
}

function fencedCodeBlocks(markdown: string): { language: string; body: string }[] {
  const blocks: { language: string; body: string }[] = [];
  const pattern = /^```([^\n`]*)\r?\n([\s\S]*?)^```/gm;
  for (const match of markdown.matchAll(pattern)) {
    blocks.push({ language: match[1], body: match[2] });
  }
  return blocks;
}

test('pins every documentation source to the installed package version', async () => {
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  for (const project of projectDefinitions) {
    const declaredVersion =
      packageJson.dependencies?.[project.packageName] ??
      packageJson.devDependencies?.[project.packageName];
    assert.ok(declaredVersion, `${project.packageName} must be a package dependency`);
    assert.match(declaredVersion, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

    const installedPackage = JSON.parse(
      await readFile(
        new URL(`../node_modules/${project.packageName}/package.json`, import.meta.url),
        'utf8',
      ),
    ) as { version: string };
    assert.equal(installedPackage.version, declaredVersion);
  }
});

test('Netlify legacy host forwards every path to docs.rdlabo.dev', async () => {
  const config = await readFile(new URL('../netlify.toml', import.meta.url), 'utf8');
  const blocks = config.split('[[redirects]]').slice(1);
  assert.equal(blocks.length, 1, 'Netlify must declare exactly one redirect');
  assert.match(
    blocks[0],
    /from\s*=\s*"\/\*"[\s\S]*?to\s*=\s*"https:\/\/docs\.rdlabo\.dev\/:splat"[\s\S]*?status\s*=\s*301[\s\S]*?force\s*=\s*true/,
  );
  assert.doesNotMatch(config, /status\s*=\s*404/);
  assert.doesNotMatch(config, /from\s*=\s*"\/(?:stripe|admob|docs|projects)/);
});

test('serves locale-specific static 404 pages', async () => {
  const [english, japanese] = await Promise.all([
    readFile(new URL('../public/404.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/ja/404.html', import.meta.url), 'utf8'),
  ]);
  assert.match(english, /<html lang="en">/);
  assert.match(japanese, /<html lang="ja">/);
  assert.match(japanese, /href="\/ja"/);
  assert.doesNotMatch(japanese, /href="\/ja\/"/);
});

test('rdlabo brand logo title is English-only', async () => {
  const svg = await readFile(
    new URL('../public/assets/brand/rdlabo-logo.svg', import.meta.url),
    'utf8',
  );
  assert.match(svg, /<title[^>]*>rdlabo\.dev logo<\/title>/);
  assert.doesNotMatch(svg, /リレーションデザイン研究所/);
});

test('uses the rdlabo-dev GitHub owner throughout site sources', async () => {
  const legacyOwner = ['rdlabo', 'team'].join('-');
  const roots = [
    new URL('../README.md', import.meta.url),
    new URL('../scripts/', import.meta.url),
    new URL('../src/', import.meta.url),
  ];
  const files = [roots[0]];
  for (const root of roots.slice(1)) {
    const entries = await readdir(root, { recursive: true });
    files.push(
      ...entries
        .filter((entry) => /\.(?:html|json|md|ts|xlf)$/.test(entry))
        .map((entry) => new URL(entry, root)),
    );
  }

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    assert.ok(!source.includes(legacyOwner), `${file.pathname} must not reference ${legacyOwner}`);
  }

  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  assert.match(readme, /`rdlabo-dev\/docs`/);
});

test('favicon brand assets are wired for rdlabo.dev', async () => {
  const [indexHtml, appleTouchIcon, faviconIco] = await Promise.all([
    readFile(new URL('../src/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../public/assets/brand/apple-touch-icon.png', import.meta.url)),
    readFile(new URL('../public/favicon.ico', import.meta.url)),
  ]);

  assert.match(
    indexHtml,
    /<link rel="icon" type="image\/svg\+xml" href="\/assets\/brand\/rdlabo-logo\.svg"\s*\/>/,
  );
  assert.match(
    indexHtml,
    /<link rel="apple-touch-icon" href="\/assets\/brand\/apple-touch-icon\.png"\s*\/>/,
  );
  assert.deepEqual(
    appleTouchIcon.subarray(0, 8),
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  assert.equal(appleTouchIcon.toString('ascii', 12, 16), 'IHDR');
  assert.equal(appleTouchIcon.readUInt32BE(16), 180);
  assert.equal(appleTouchIcon.readUInt32BE(20), 180);

  assert.deepEqual(
    faviconIco.subarray(0, 8),
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  assert.equal(faviconIco.toString('ascii', 12, 16), 'IHDR');
  assert.equal(faviconIco.readUInt32BE(16), 64);
  assert.equal(faviconIco.readUInt32BE(20), 64);

  await assert.rejects(() =>
    access(new URL('../public/assets/icon/favicon.ico', import.meta.url), constants.F_OK),
  );
  await assert.rejects(() =>
    access(new URL('../public/assets/icon/favicon.png', import.meta.url), constants.F_OK),
  );
});

test('imports every installed ESLint rule README with matching EN/JA code fences', async () => {
  const eslintProject = projectDefinitions.find((project) => project.id === 'eslint-plugin-rules');
  assert.ok(eslintProject);

  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const declaredVersion =
    packageJson.dependencies?.[eslintProject.packageName] ??
    packageJson.devDependencies?.[eslintProject.packageName];
  assert.ok(declaredVersion, `${eslintProject.packageName} must be a package dependency`);
  assert.match(declaredVersion, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

  const installedPackage = JSON.parse(
    await readFile(
      new URL(`../node_modules/${eslintProject.packageName}/package.json`, import.meta.url),
      'utf8',
    ),
  ) as { version: string };
  assert.equal(installedPackage.version, declaredVersion);

  const pinnedBlobPrefix = `https://github.com/rdlabo-dev/eslint-plugin-rules/blob/v${declaredVersion}/`;
  const floatingMainBlob = 'eslint-plugin-rules/blob/main';

  const manifestRuleNames = eslintProject.pages
    .filter((page) => page.slug.startsWith('rules/'))
    .map((page) => page.slug.slice('rules/'.length))
    .sort();
  const installedRuleNames = await installedEslintRuleNames();

  assert.equal(manifestRuleNames.length, 18);
  assert.deepEqual(manifestRuleNames, installedRuleNames);

  const docsRoot = new URL('../src/eslint-plugin-rules/docs/', import.meta.url);
  const [englishRulesIndex, japaneseRulesIndex] = await Promise.all([
    readFile(new URL('rules.md', docsRoot), 'utf8'),
    readFile(new URL('ja/rules.md', docsRoot), 'utf8'),
  ]);

  for (const ruleName of manifestRuleNames) {
    const englishPath = new URL(`rules/${ruleName}.md`, docsRoot);
    const japanesePath = new URL(`ja/rules/${ruleName}.md`, docsRoot);
    const [english, japanese] = await Promise.all([
      readFile(englishPath, 'utf8'),
      readFile(japanesePath, 'utf8'),
    ]);

    assert.equal(yamlTitle(english), ruleName);
    assert.equal(yamlTitle(japanese), ruleName);

    const englishBlocks = fencedCodeBlocks(english);
    const japaneseBlocks = fencedCodeBlocks(japanese);
    assert.deepEqual(
      japaneseBlocks,
      englishBlocks,
      `${ruleName} fenced code blocks must match byte-for-byte between EN and JA`,
    );

    for (const [locale, markdown] of [
      ['EN', english],
      ['JA', japanese],
    ] as const) {
      assert.doesNotMatch(
        markdown,
        new RegExp(floatingMainBlob.replaceAll('/', '\\/')),
        `${locale} ${ruleName} must not link to eslint-plugin-rules/blob/main`,
      );
      const githubBlobLinks = [
        ...markdown.matchAll(
          /https:\/\/github\.com\/rdlabo-dev\/eslint-plugin-rules\/blob\/[^\s)\]]+/g,
        ),
      ].map((match) => match[0]);
      assert.ok(
        githubBlobLinks.length > 0,
        `${locale} ${ruleName} must include GitHub blob implementation/test links`,
      );
      for (const link of githubBlobLinks) {
        assert.ok(
          link.startsWith(pinnedBlobPrefix),
          `${locale} ${ruleName} GitHub blob link must use ${pinnedBlobPrefix}: ${link}`,
        );
      }
    }

    const localRoute = `/eslint-plugin-rules/docs/rules/${ruleName}`;
    assert.match(englishRulesIndex, new RegExp(localRoute.replaceAll('/', '\\/')));
    assert.match(japaneseRulesIndex, new RegExp(localRoute.replaceAll('/', '\\/')));
  }

  // v21.3.0 tagged the deny-constructor-di test file with a historical typo.
  const denyConstructorDiDocs = await Promise.all([
    readFile(new URL('rules/deny-constructor-di.md', docsRoot), 'utf8'),
    readFile(new URL('ja/rules/deny-constructor-di.md', docsRoot), 'utf8'),
  ]);
  for (const markdown of denyConstructorDiDocs) {
    assert.match(markdown, /\/blob\/v21\.3\.0\/tests\/rules\/deny-costructor-di\.ts/);
    assert.doesNotMatch(markdown, /\/tests\/rules\/deny-constructor-di\.ts/);
  }
});

test('lists every ionic-angular-library package and imports localized READMEs', async () => {
  const expectedProjects = new Map([
    ['ionic-angular-kit', '@rdlabo/ionic-angular-kit'],
    ['ionic-angular-photo-editor', '@rdlabo/ionic-angular-photo-editor'],
    ['ionic-angular-scroll-header', '@rdlabo/ionic-angular-scroll-header'],
    ['ngx-cdk-scroll-strategies', '@rdlabo/ngx-cdk-scroll-strategies'],
  ]);
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const packageVersions = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  const sourceVersion = packageVersions['@rdlabo/ionic-angular-kit'];
  assert.ok(sourceVersion, '@rdlabo/ionic-angular-kit must be an exact dependency');
  const libraryProjects = projectDefinitions.filter(
    (project) => project.repositoryUrl === 'https://github.com/rdlabo-dev/ionic-angular-library',
  );

  assert.deepEqual(
    new Map(libraryProjects.map((project) => [project.id, project.packageName])),
    expectedProjects,
  );

  const repositoryReadme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  for (const project of projectDefinitions) {
    assert.ok(
      repositoryReadme.includes(`| ${project.name} | \`src/${project.sourceDirectory}/docs\` |`),
      `README Current projects must list ${project.name}`,
    );
  }

  for (const project of libraryProjects) {
    assert.equal(project.category, 'frontend-tools');
    const declaredVersion = packageVersions[project.packageName];
    assert.ok(declaredVersion, `${project.packageName} must be an exact dependency`);
    assert.match(declaredVersion, /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/);

    const installedPackage = JSON.parse(
      await readFile(
        new URL(`../node_modules/${project.packageName}/package.json`, import.meta.url),
        'utf8',
      ),
    ) as { version: string };
    assert.equal(installedPackage.version, declaredVersion);
    assert.equal(declaredVersion, sourceVersion);
  }

  for (const projectId of [
    'ionic-angular-photo-editor',
    'ionic-angular-scroll-header',
    'ngx-cdk-scroll-strategies',
  ]) {
    const docsRoot = new URL(`../src/${projectId}/docs/`, import.meta.url);
    const [english, japanese] = await Promise.all([
      readFile(new URL('readme.md', docsRoot), 'utf8'),
      readFile(new URL('ja/readme.md', docsRoot), 'utf8'),
    ]);
    assert.deepEqual(
      fencedCodeBlocks(japanese),
      fencedCodeBlocks(english),
      `${projectId} fenced code blocks must match byte-for-byte between EN and JA`,
    );
    for (const markdown of [english, japanese]) {
      assert.doesNotMatch(markdown, /^#{1,6}\s+FQA\s*$/m);
      assert.doesNotMatch(markdown, /ionic-angular-library\/(?:blob|tree)\/main/);
      for (const link of markdown.matchAll(
        /https:\/\/github\.com\/rdlabo-dev\/ionic-angular-library\/(?:blob|tree)\/[^\s)\]]+/g,
      )) {
        assert.ok(
          link[0].includes(`/v${sourceVersion}/`),
          `${projectId} source link must use v${sourceVersion}: ${link[0]}`,
        );
      }

      if (projectId === 'ngx-cdk-scroll-strategies') {
        for (const directory of ['scroll-simple', 'scroll-advanced', 'scroll-reverse']) {
          assert.match(
            markdown,
            new RegExp(`/tree/v${sourceVersion}/[^\\s)\\]]+/${directory}(?:[\\s)\\]]|$)`),
          );
          assert.doesNotMatch(
            markdown,
            new RegExp(`/blob/v${sourceVersion}/[^\\s)\\]]+/${directory}(?:[\\s)\\]]|$)`),
          );
        }
        for (const fileName of [
          'dynamic-size-virtual-scroll-strategy.ts',
          'dynamic-size-virtual-scroll.service.ts',
        ]) {
          assert.match(markdown, new RegExp(`/blob/v${sourceVersion}/[^\\s)\\]]+/${fileName}`));
        }
      }
    }
  }
});

test('lists ionic theme packages and pins localized README imports', async () => {
  const expectedProjects = new Map([
    ['ionic-theme-ios26', { packageName: '@rdlabo/ionic-theme-ios26', version: '2.3.2' }],
    ['ionic-theme-md3', { packageName: '@rdlabo/ionic-theme-md3', version: '1.1.0' }],
  ]);
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const packageVersions = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  for (const [projectId, expected] of expectedProjects) {
    const project = projectDefinitions.find((entry) => entry.id === projectId);
    assert.ok(project, `${projectId} must be declared in the manifest`);
    assert.equal(project.packageName, expected.packageName);
    assert.equal(project.category, 'frontend-tools');
    assert.equal(project.icon, 'theme');
    assert.equal(project.adapter, 'markdown');

    const declaredVersion = packageVersions[expected.packageName];
    assert.equal(declaredVersion, expected.version);
    const installedPackage = JSON.parse(
      await readFile(
        new URL(`../node_modules/${expected.packageName}/package.json`, import.meta.url),
        'utf8',
      ),
    ) as { version: string };
    assert.equal(installedPackage.version, expected.version);

    const docsRoot = new URL(`../src/${projectId}/docs/`, import.meta.url);
    const pageFiles =
      projectId === 'ionic-theme-ios26' ? ['readme.md', 'using-ion-item-group.md'] : ['readme.md'];
    for (const pageFile of pageFiles) {
      const [english, japanese] = await Promise.all([
        readFile(new URL(pageFile, docsRoot), 'utf8'),
        readFile(new URL(`ja/${pageFile}`, docsRoot), 'utf8'),
      ]);
      assert.deepEqual(
        fencedCodeBlocks(japanese),
        fencedCodeBlocks(english),
        `${projectId}/${pageFile} fenced code blocks must match byte-for-byte between EN and JA`,
      );
      for (const markdown of [english, japanese]) {
        assert.doesNotMatch(markdown, new RegExp(['rdlabo', 'team'].join('-')));
        assert.doesNotMatch(markdown, new RegExp(`${projectId}/(?:blob|tree)/main`));
        assert.match(
          markdown,
          new RegExp(
            `raw\\.githubusercontent\\.com/rdlabo-dev/${projectId}/v${expected.version}/screenshots/`,
          ),
        );
        for (const link of markdown.matchAll(
          new RegExp(`https://github\\.com/rdlabo-dev/${projectId}/(?:blob|tree)/[^\\s)\\]]+`, 'g'),
        )) {
          assert.ok(
            link[0].includes(`/v${expected.version}/`),
            `${projectId} source link must use v${expected.version}: ${link[0]}`,
          );
        }
      }
    }
  }

  const iosProject = projectDefinitions.find((entry) => entry.id === 'ionic-theme-ios26');
  assert.ok(iosProject);
  const usingPage = iosProject.pages.find((entry) => entry.slug === 'using-ion-item-group');
  assert.ok(usingPage);
  assert.equal(usingPage.title.en, 'Using ion-item-group');
  assert.equal(usingPage.title.ja, 'ion-item-groupの使用方法');
  assert.notEqual(usingPage.title.ja, usingPage.title.en);
  assert.match(usingPage.title.ja, /[\u3040-\u30ff\u4e00-\u9fff]/);

  const [iosReadme, iosReadmeJa, usingDoc, usingDocJa] = await Promise.all([
    readFile(new URL('../src/ionic-theme-ios26/docs/readme.md', import.meta.url), 'utf8'),
    readFile(new URL('../src/ionic-theme-ios26/docs/ja/readme.md', import.meta.url), 'utf8'),
    readFile(
      new URL('../src/ionic-theme-ios26/docs/using-ion-item-group.md', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/ionic-theme-ios26/docs/ja/using-ion-item-group.md', import.meta.url),
      'utf8',
    ),
  ]);
  assert.match(iosReadme, /\]\(\/ionic-theme-ios26\/docs\/using-ion-item-group\)/);
  assert.match(
    iosReadme,
    /https:\/\/github\.com\/rdlabo-dev\/ionic-theme-ios26\/blob\/v2\.3\.2\/USING_ION_ITEM_GROUP\.md/,
  );

  assert.equal(yamlTitle(usingDoc), 'Using ion-item-group');
  assert.equal(yamlTitle(usingDocJa), 'ion-item-groupの使用方法');
  assert.notEqual(yamlTitle(usingDocJa), yamlTitle(usingDoc));
  assert.match(yamlTitle(usingDocJa), /[\u3040-\u30ff\u4e00-\u9fff]/);
  assert.match(usingDocJa, /^# ion-item-groupの使用方法\s*$/m);
  assert.match(usingDoc, /when the following condition is met/);
  assert.doesNotMatch(usingDoc, /when \*\*both\*\* of the following conditions are met/);

  const selectiveImportPattern =
    /@rdlabo\/ionic-theme-ios26\/dist\/css\/(?:utils|components)\/([A-Za-z0-9/_-]+)(?!\.css)/g;
  for (const [locale, markdown] of [
    ['EN', iosReadme],
    ['JA', iosReadmeJa],
  ] as const) {
    const imports = [...markdown.matchAll(selectiveImportPattern)].map((match) => match[0]);
    assert.ok(
      imports.length > 0,
      `${locale} iOS README must show selective utils/components imports`,
    );
    for (const importPath of imports) {
      const relativeCss = `${importPath.slice('@rdlabo/ionic-theme-ios26/'.length)}.css`;
      await access(
        new URL(`../node_modules/@rdlabo/ionic-theme-ios26/${relativeCss}`, import.meta.url),
        constants.F_OK,
      );
    }
    assert.doesNotMatch(markdown, /dist\/css\/components\/ion-breadcrumbs(?!\.css)/);
  }
});

test('imports the remaining rdlabo utility READMEs from exact public releases', async () => {
  const expectedProjects = new Map([
    ['capacitor-codescanner', ['@rdlabo/capacitor-codescanner', '8.0.3', 'capacitor-plugins']],
    [
      'capacitor-screenshot-event',
      ['@rdlabo/capacitor-screenshot-event', '8.0.0', 'capacitor-plugins'],
    ],
    ['capacitor-printer', ['@rdlabo/capacitor-printer', '8.0.1', 'capacitor-plugins']],
    ['capacitor-brotherprint', ['@rdlabo/capacitor-brotherprint', '8.1.1', 'capacitor-plugins']],
    [
      'ionic-angular-collect-icons',
      ['@rdlabo/ionic-angular-collect-icons', '2.1.0', 'frontend-tools'],
    ],
  ] as const);
  const packageJson = JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const packageVersions = { ...packageJson.dependencies, ...packageJson.devDependencies };

  assert.equal(
    projectDefinitions.some((project) => project.id === 'capacitor-docgen'),
    false,
    'the upstream capacitor-docgen fork is intentionally held back',
  );

  for (const [projectId, [packageName, version, category]] of expectedProjects) {
    const project = projectDefinitions.find((entry) => entry.id === projectId);
    assert.ok(project, `${projectId} must be declared in the manifest`);
    assert.equal(project.packageName, packageName);
    assert.equal(project.repositoryUrl, `https://github.com/rdlabo-dev/${projectId}`);
    assert.equal(project.category, category);
    assert.equal(project.adapter, 'markdown');
    assert.equal(packageVersions[packageName], version);

    const installedPackage = JSON.parse(
      await readFile(
        new URL(`../node_modules/${packageName}/package.json`, import.meta.url),
        'utf8',
      ),
    ) as { version: string };
    assert.equal(installedPackage.version, version);

    const docsRoot = new URL(`../src/${projectId}/docs/`, import.meta.url);
    const [english, japanese] = await Promise.all([
      readFile(new URL('readme.md', docsRoot), 'utf8'),
      readFile(new URL('ja/readme.md', docsRoot), 'utf8'),
    ]);
    assert.deepEqual(
      fencedCodeBlocks(japanese),
      fencedCodeBlocks(english),
      `${projectId} fenced code blocks must match byte-for-byte between EN and JA`,
    );
    for (const markdown of [english, japanese]) {
      assert.doesNotMatch(markdown, new RegExp(['rdlabo', 'team'].join('-')));
      assert.doesNotMatch(markdown, new RegExp(`${projectId}/(?:blob|tree)/main`));
      for (const link of markdown.matchAll(
        new RegExp(`https://github\\.com/rdlabo-dev/${projectId}/(?:blob|tree)/[^\\s)\\]]+`, 'g'),
      )) {
        assert.ok(
          link[0].includes(`/v${version}/`),
          `${projectId} source link must use v${version}: ${link[0]}`,
        );
      }
    }
  }

  const docs = async (projectId: string) =>
    Promise.all([
      readFile(new URL(`../src/${projectId}/docs/readme.md`, import.meta.url), 'utf8'),
      readFile(new URL(`../src/${projectId}/docs/ja/readme.md`, import.meta.url), 'utf8'),
    ]);
  for (const markdown of await docs('capacitor-codescanner')) {
    assert.match(markdown, /known limitation in v8\.0\.3|v8\.0\.3の既知の制限/i);
    assert.match(
      markdown,
      /native implementations still read the legacy `CodeTypes`|native実装は従来の `CodeTypes`/,
    );
    assert.doesNotMatch(markdown, /^\s*(?:metadataObjectTypes|CodeTypes|detectionX|detectionY):/m);
    assert.match(markdown, /upper left corner|左上/);
  }
  for (const markdown of await docs('capacitor-screenshot-event')) {
    assert.match(
      markdown,
      /import \{ ScreenshotEvent \} from '@rdlabo\/capacitor-screenshot-event';/,
    );
  }
  for (const markdown of await docs('capacitor-brotherprint')) {
    assert.match(markdown, /searchPrinter\(port: BRLMPrinterPort\)/);
    assert.doesNotMatch(markdown, /BRKM|[“”]/);
    assert.match(markdown, /mobilesdk\/ios\/index\.html/);
    assert.match(markdown, /iOS 15|iOS 15以降/);
    assert.match(
      markdown,
      /import \{ Component, OnDestroy, OnInit, signal \} from '@angular\/core';/,
    );
    assert.match(
      markdown,
      /<key>UISupportedExternalAccessoryProtocols<\/key>\s*\n\+ <array>[\s\S]*?<string>com\.brother\.ptcbp<\/string>[\s\S]*?\+ <\/array>/,
    );
  }
  for (const markdown of await docs('ionic-angular-collect-icons')) {
    assert.match(markdown, /import \* as useIcons from '\.\/use-icons';/);
    assert.doesNotMatch(markdown, /import \* as useIcons from '\.\.\/use-icons';/);
  }

  const [brotherReadme] = await docs('capacitor-brotherprint');
  const brotherExample = fencedCodeBlocks(brotherReadme).find((block) =>
    block.body.includes("selector: 'brother-print'"),
  );
  assert.ok(brotherExample, 'Brother Print README must include its Angular usage example');
  const virtualFile = join(process.cwd(), 'brotherprint-readme-example.ts');
  const compilerOptions: ts.CompilerOptions = {
    experimentalDecorators: true,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2022,
  };
  const host = ts.createCompilerHost(compilerOptions);
  const originalFileExists = host.fileExists;
  const originalGetSourceFile = host.getSourceFile;
  const originalReadFile = host.readFile;
  host.fileExists = (fileName) => fileName === virtualFile || originalFileExists(fileName);
  host.readFile = (fileName) =>
    fileName === virtualFile ? brotherExample.body : originalReadFile(fileName);
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) =>
    fileName === virtualFile
      ? ts.createSourceFile(fileName, brotherExample.body, languageVersion, true)
      : originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
  const diagnostics = ts.getPreEmitDiagnostics(
    ts.createProgram({ rootNames: [virtualFile], options: compilerOptions, host }),
  );
  assert.deepEqual(
    diagnostics,
    [],
    diagnostics
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'))
      .join('\n'),
  );
});

test('configures Cloudflare Workers Static Assets for docs.rdlabo.dev', async () => {
  const [wranglerSource, packageJsonSource] = await Promise.all([
    readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
    readFile(new URL('../package.json', import.meta.url), 'utf8'),
  ]);
  const wrangler = JSON.parse(
    wranglerSource.replace(/^\s*\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1'),
  ) as {
    $schema?: string;
    name?: string;
    account_id?: string;
    compatibility_date?: string;
    workers_dev?: boolean;
    preview_urls?: boolean;
    assets?: {
      directory?: string;
      not_found_handling?: string;
      html_handling?: string;
    };
    routes?: Array<{ pattern?: string; custom_domain?: boolean }>;
  };
  const packageJson = JSON.parse(packageJsonSource) as {
    scripts?: Record<string, string>;
  };

  assert.equal(wrangler.$schema, './node_modules/wrangler/config-schema.json');
  assert.equal(wrangler.name, 'docs');
  assert.equal(wrangler.account_id, '09b7a8355cbc8a838af7de40ed9ec7f8');
  assert.equal(wrangler.compatibility_date, '2026-08-15');
  assert.equal(wrangler.workers_dev, false);
  assert.equal(wrangler.preview_urls, false);
  assert.equal(wrangler.assets?.directory, './dist/capacitor-plugins-docs/browser');
  assert.equal(wrangler.assets?.not_found_handling, '404-page');
  assert.equal(wrangler.assets?.html_handling, 'drop-trailing-slash');
  assert.deepEqual(wrangler.routes, [{ pattern: 'docs.rdlabo.dev', custom_domain: true }]);
  assert.equal(packageJson.scripts?.deploy, 'npm run build && wrangler deploy');
  assert.equal(
    packageJson.scripts?.['deploy:dry-run'],
    'npm run build && wrangler deploy --dry-run',
  );
  await assert.rejects(() =>
    access(new URL('../public/_redirects', import.meta.url), constants.F_OK),
  );
});

test('uses docs.rdlabo.dev as the canonical origin in site SEO outputs', async () => {
  const legacyOrigin = 'https://stripe.capacitorjs.jp';
  const canonicalOrigin = 'https://docs.rdlabo.dev';
  const [siteConfig, sitemap, robots] = await Promise.all([
    readFile(new URL('../src/app/site-config.ts', import.meta.url), 'utf8'),
    readFile(new URL('../public/sitemap.xml', import.meta.url), 'utf8'),
    readFile(new URL('../public/robots.txt', import.meta.url), 'utf8'),
  ]);

  assert.match(siteConfig, new RegExp(`origin:\\s*'${canonicalOrigin.replaceAll('.', '\\.')}'`));
  assert.doesNotMatch(siteConfig, new RegExp(legacyOrigin.replaceAll('.', '\\.')));
  assert.match(sitemap, new RegExp(`<loc>${canonicalOrigin.replaceAll('.', '\\.')}/</loc>`));
  assert.match(sitemap, new RegExp(`<loc>${canonicalOrigin.replaceAll('.', '\\.')}/ja</loc>`));
  assert.doesNotMatch(sitemap, new RegExp(`${canonicalOrigin.replaceAll('.', '\\.')}/ja/</`));
  assert.match(
    sitemap,
    new RegExp(`hreflang="ja" href="${canonicalOrigin.replaceAll('.', '\\.')}/ja"`),
  );
  assert.doesNotMatch(sitemap, new RegExp(legacyOrigin.replaceAll('.', '\\.')));
  assert.match(
    robots,
    new RegExp(`Sitemap:\\s*${canonicalOrigin.replaceAll('.', '\\.')}/sitemap\\.xml`),
  );
  assert.doesNotMatch(robots, new RegExp(legacyOrigin.replaceAll('.', '\\.')));
});

test('locks production anyScript budgets after catalog growth', async () => {
  const angularJson = JSON.parse(
    await readFile(new URL('../angular.json', import.meta.url), 'utf8'),
  ) as {
    projects: {
      'capacitor-plugins-docs': {
        architect: {
          build: {
            configurations: {
              production: {
                budgets: Array<{
                  type: string;
                  maximumWarning?: string;
                  maximumError?: string;
                }>;
              };
            };
          };
        };
      };
    };
  };
  const anyScript = angularJson.projects[
    'capacitor-plugins-docs'
  ].architect.build.configurations.production.budgets.find((budget) => budget.type === 'anyScript');
  assert.ok(anyScript);
  assert.equal(anyScript.maximumWarning, '405kB');
  assert.equal(anyScript.maximumError, '450kB');

  const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
  assert.match(readme, /anyScript.*405kB/s);
  assert.match(readme, /450kB/);
});
