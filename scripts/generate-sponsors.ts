import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fetchPublicSponsors, sponsorsModule } from './github-sponsors';

async function main(): Promise<void> {
  const outputPath = join(process.cwd(), 'projects/docs/src/app/generated/sponsors.generated.ts');
  const sponsors = await fetchPublicSponsors('rdlabo', process.env['GITHUB_TOKEN'] ?? '');
  await writeFile(outputPath, sponsorsModule(sponsors));
  console.log(
    `Generated ${sponsors.current.length} current and ${sponsors.past.length} past public sponsors.`,
  );
}

void main();
