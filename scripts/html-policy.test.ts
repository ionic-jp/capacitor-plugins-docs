import assert from 'node:assert/strict';
import test from 'node:test';
import { enforceGeneratedHtmlPolicy } from './html-policy';

test('accepts documentation markup and syntax highlighting styles', () => {
  const html =
    '<h2 id="install" data-line="1" class="code-line">Install</h2>' +
    '<h5 id="details" data-line="2" class="code-line">Details</h5>' +
    '<hr>' +
    '<ol start="2"><li>Second step</li></ol>' +
    '<blockquote data-line="2" class="code-line"><p>Rule summary</p></blockquote>' +
    '<pre class="shiki" style="background-color:#151e2c;color:#e1e4e8"><code>' +
    '<span style="color:#b392f0">npm</span>' +
    '<span style="font-style:italic;color:#e1e4e8">comment</span></code></pre>' +
    '<a href="https://example.com" target="_blank" rel="nofollow noopener noreferrer">Source</a>';
  const sanitized = enforceGeneratedHtmlPolicy(html, 'fixture');
  assert.match(sanitized, /<h2/);
  assert.match(sanitized, /<h5/);
  assert.match(sanitized, /<hr>/);
  assert.match(sanitized, /<ol start="2">/);
  assert.match(sanitized, /<blockquote/);
  assert.match(sanitized, /font-style:italic/);
});

for (const [name, html] of [
  ['script element', '<script>alert(1)</script>'],
  ['event handler', '<img src="/logo.svg" onerror="alert(1)">'],
  ['javascript URL', '<a href="javascript:alert(1)">Open</a>'],
  ['unsafe style', '<span style="background-image:url(https://example.com/x)">Text</span>'],
  ['unapproved font style', '<span style="font-style:oblique">Text</span>'],
  ['invalid ordered-list start', '<ol start="next"><li>Step</li></ol>'],
] as const) {
  test(`rejects ${name}`, () => {
    assert.throws(
      () => enforceGeneratedHtmlPolicy(html, 'dangerous fixture'),
      /disallowed|unsafe|invalid/,
    );
  });
}
