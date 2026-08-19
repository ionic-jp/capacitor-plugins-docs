import assert from 'node:assert/strict';
import test from 'node:test';
import { splitDocgenReadme } from './docgen-readme';

test('splits a generated Capacitor API from its README', () => {
  const source = `# Plugin

## Install

npm install plugin

## API

<docgen-index>
* [run](#run)
</docgen-index>

<docgen-api>
### run(...)
</docgen-api>
`;

  assert.deepEqual(splitDocgenReadme(source), {
    readme: '# Plugin\n\n## Install\n\nnpm install plugin\n',
    api: '* [run](#run)\n\n### run(...)\n',
  });
});

test('splits docgen when an API heading sits between index and api blocks', () => {
  const source = `## Index

<docgen-index>
* [\`initialize(...)\`](#initialize)
</docgen-index>

## API

<docgen-api>
### initialize(...)
</docgen-api>
`;

  assert.deepEqual(splitDocgenReadme(source), {
    readme: '## Index\n',
    api: '* [`initialize(...)`](#initialize)\n\n### initialize(...)\n',
  });
});

test('does not split ordinary Markdown or incomplete docgen output', () => {
  assert.equal(splitDocgenReadme('# README\n\n## API\n'), undefined);
  assert.equal(splitDocgenReadme('# README\n\n<docgen-api>\nAPI\n</docgen-api>\n'), undefined);
});
