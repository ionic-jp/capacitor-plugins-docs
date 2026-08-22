import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DOCS_PORTAL_REPOSITORY_URL,
  DOCS_PORTAL_REF,
  pinPackageSourceLinks,
  parseRepositoryUrl,
  repositoryRawUrl,
  repositorySourceLabel,
} from './package-repository';

test('parses GitHub repository URLs', () => {
  assert.deepEqual(parseRepositoryUrl('https://github.com/capacitor-community/admob'), {
    owner: 'capacitor-community',
    repo: 'admob',
  });
  assert.deepEqual(parseRepositoryUrl('https://github.com/rdlabo-dev/capacitor-codescanner/'), {
    owner: 'rdlabo-dev',
    repo: 'capacitor-codescanner',
  });
});

test('pins only source links that belong to the package repository', async () => {
  const project = {
    repositoryUrl: 'https://github.com/rdlabo-dev/capacitor-docgen',
    packageName: '@rdlabo/capacitor-docgen',
  };
  const markdown = [
    '[fork](https://github.com/rdlabo-dev/capacitor-docgen/tree/main/src) [upstream](https://github.com/ionic-team/capacitor-docgen/tree/v0.3.1/src)',
    '[blob](https://github.com/rdlabo-dev/capacitor-docgen/blob/next/docs/api.md)',
    '![raw](https://raw.githubusercontent.com/rdlabo-dev/capacitor-docgen/main/image.png)',
    '[pinned](https://github.com/rdlabo-dev/capacitor-docgen/blob/v0.4.1/README.md)',
  ].join('\n');

  assert.equal(
    await pinPackageSourceLinks(project, markdown),
    [
      '[fork](https://github.com/rdlabo-dev/capacitor-docgen/tree/v0.4.1/src) [upstream](https://github.com/ionic-team/capacitor-docgen/tree/v0.3.1/src)',
      '[blob](https://github.com/rdlabo-dev/capacitor-docgen/blob/v0.4.1/docs/api.md)',
      '![raw](https://raw.githubusercontent.com/rdlabo-dev/capacitor-docgen/v0.4.1/image.png)',
      '[pinned](https://github.com/rdlabo-dev/capacitor-docgen/blob/v0.4.1/README.md)',
    ].join('\n'),
  );
});

test('builds raw and source labels for repository docs', () => {
  const repositoryUrl = 'https://github.com/capacitor-community/admob';
  assert.equal(
    repositoryRawUrl(repositoryUrl, 'main', 'docs/configuration.md'),
    'https://raw.githubusercontent.com/capacitor-community/admob/main/docs/configuration.md',
  );
  assert.equal(
    repositorySourceLabel(repositoryUrl, 'main', 'README.md'),
    'capacitor-community/admob@main/README.md',
  );
  assert.equal(DOCS_PORTAL_REPOSITORY_URL, 'https://github.com/rdlabo-dev/docs');
  assert.equal(DOCS_PORTAL_REF, 'main');
});
