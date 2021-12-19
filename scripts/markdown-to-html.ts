import markdownToHtml from "zenn-markdown-html";
import { promisify } from 'util';
import { glob } from 'glob';
import path from 'path';
import { readFile, writeFile, mkdirp, remove } from 'fs-extra';
import frontMatter from 'front-matter';
import { MarkdownContent } from '../src/global/definitions';

const globAsync = promisify(glob);

const DESTINATION_DIR = './src/assets/docs';
const SOURCE_DIR = './src/docs';

(async function () {
  const files = await globAsync(`${SOURCE_DIR}/**/*.md`, {});

  await remove(DESTINATION_DIR);

  const filePromises = files.map(async filePath => {
    if (filePath === `./src/docs/README.md`) {
      return Promise.resolve();
    }
    let markdownMetadata: MarkdownContent = {};
    const jsonFileName = path.relative(SOURCE_DIR, filePath);
    const destinationFileName = path.join(DESTINATION_DIR, path.dirname(jsonFileName), path.basename(jsonFileName, '.md') + '.json');
    markdownMetadata.headings = [];

    const markdownContents = await readFile(filePath, { encoding: 'utf8' });
    try {
      let parsedMarkdown = frontMatter<any>(markdownContents);
      const hypertext = markdownToHtml(parsedMarkdown.body);

      await mkdirp(path.join(DESTINATION_DIR, path.dirname(jsonFileName)));
      await writeFile(destinationFileName, JSON.stringify({
        ...parsedMarkdown.attributes,
        hypertext,
      }),{
        encoding: 'utf8',
      });
      } catch (e) {
        console.error(filePath);
        throw e;
      }
  });

  await Promise.all(filePromises);

  console.log(`successfully converted ${filePromises.length} files`);
})();
