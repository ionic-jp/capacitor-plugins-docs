import markdownToHtml from "zenn-markdown-html";
import { promisify } from 'util';
import { glob } from 'glob';
import path from 'path';
import { readFile, writeFile, mkdirp, remove } from 'fs-extra';
import frontMatter from 'front-matter';
import {MarkdownContent, TypeObject} from '../src/global/definitions';
import { getTypeToObjects } from './type-to-object';

const globAsync = promisify(glob);

const DESTINATION_DIR = './src/assets/docs';
const SOURCE_DIR = './src/docs';

(async function () {
  const docs: Record<'methods' | 'interfaces' | 'typeAliases' | 'enums', TypeObject[]> = getTypeToObjects();
  const docsArr: TypeObject[] = Object.values(docs).flat(1);
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
      const parsedMarkdown = frontMatter<any>(markdownContents);
      const splitBodyByLine = parsedMarkdown.body.split(/\r\n|\n/);

      const parsedBody = splitBodyByLine.map(line => {
        const result = line.match(/^!::([a-zA-Z0-9]+)::$/);
        if (!result) {
          return line;
        }
        const markdown = docsArr.find(doc => doc?.id === result[1])?.markdown;
        if (markdown) {
          return markdown;
        }
        throw result[1] + 'is not fount';
      }).join('\n')

      const hypertext = markdownToHtml(parsedBody);

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
