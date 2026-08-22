import { access, constants, copyFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const source404 = join(repoRoot, 'projects/docs/public', 'ja', '404.html');
const browserRoot = join(repoRoot, 'dist', 'docs', 'browser');
const target404 = join(browserRoot, 'ja', '404.html');
const nestedJaDirectory = join(browserRoot, 'ja', 'ja');

async function requirePath(path: string, label: string): Promise<void> {
  try {
    await access(path, constants.F_OK);
  } catch {
    throw new Error(`${label} is missing: ${path}`);
  }
}

async function main(): Promise<void> {
  await requirePath(source404, 'Japanese 404 source');
  await requirePath(browserRoot, 'Angular browser output');
  await requirePath(target404, 'Japanese 404 output');

  await copyFile(source404, target404);
  await rm(nestedJaDirectory, { recursive: true, force: true });
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
