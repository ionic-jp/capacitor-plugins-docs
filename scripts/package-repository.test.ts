import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DOCS_PORTAL_REPOSITORY_URL,
  DOCS_PORTAL_REF,
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
