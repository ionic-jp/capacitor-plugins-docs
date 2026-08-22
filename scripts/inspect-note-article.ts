import { fetchNoteArticle } from './note-articles';

const noteUrl = process.argv[2];
if (!noteUrl || process.argv.length !== 3) {
  console.error('Usage: npm run articles:inspect-note -- https://note.com/rdlabo/n/<note-id>');
  process.exitCode = 1;
} else {
  fetchNoteArticle(noteUrl)
    .then((article) => console.log(JSON.stringify(article, null, 2)))
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
