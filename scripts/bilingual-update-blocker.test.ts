import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import test from 'node:test';
import { projectDefinitions } from './project-manifest';

function resolveBaseRef(): string {
  const candidates: string[] = [];
  if (process.env.GITHUB_BASE_REF) candidates.push(`origin/${process.env.GITHUB_BASE_REF}`);
  candidates.push('origin/main', 'main');

  for (const cand of candidates) {
    try {
      execSync(`git rev-parse --verify ${cand}^{commit}`, { stdio: 'ignore' });
      return cand;
    } catch {
      // try next
    }
  }
  throw new Error(`Unable to resolve a git base ref from: ${candidates.join(', ')}`);
}

type NameStatus = {
  status: string;
  path: string;
};

function changedFilesComparedToBase(baseRef: string): NameStatus[] {
  const output = execSync(`git diff --name-status ${baseRef}...HEAD`, { encoding: 'utf8' }).trim();
  if (!output) return [];

  return output.split('\n').map((line) => {
    const parts = line.split('\t');
    const code = parts[0] ?? '';
    const statusLetter = code[0] ?? code;

    // rename format: Rxxx\told\tnew
    const path = statusLetter === 'R' ? parts[2] : parts[1];
    return { status: statusLetter, path };
  });
}

test('block EN doc updates without corresponding JA updates', async () => {
  // On push-to-main there is no meaningful base to compare against; skip gracefully.
  if (process.env.GITHUB_EVENT_NAME === 'push') return;

  const baseRef = resolveBaseRef();

  const changed = changedFilesComparedToBase(baseRef)
    .filter((c) => (c.status === 'M' || c.status === 'A') && c.path)
    .map((c) => c.path);

  const changedSet = new Set(changed);

  // Only pages declared in the manifest are considered “must have JA counterpart”.
  const enToJa = new Map<string, string>();
  for (const project of projectDefinitions) {
    for (const page of project.pages) {
      const enPath = `src/${project.sourceDirectory}/docs/${page.file}`;
      const jaPath = `src/${project.sourceDirectory}/docs/ja/${page.file}`;
      enToJa.set(enPath, jaPath);
    }
  }

  const missing: { en: string; ja: string }[] = [];
  for (const enPath of changedSet) {
    const jaPath = enToJa.get(enPath);
    if (!jaPath) continue;

    // If JA counterpart is missing locally, let other tests catch it.
    if (!existsSync(jaPath)) continue;

    if (!changedSet.has(jaPath)) {
      missing.push({ en: enPath, ja: jaPath });
    }
  }

  assert.equal(
    missing.length,
    0,
    `EN doc pages changed without matching JA changes:\n${missing
      .slice(0, 20)
      .map((m) => `- ${m.en} -> missing ${m.ja}`)
      .join('\n')}`,
  );
});
