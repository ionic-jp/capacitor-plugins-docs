# rdlabo.dev

Documentation portal for personal open source projects created and maintained by rdlabo. The site is an Angular 22 static application with English and Japanese documentation.

The `rdlabo` name is also used by 一般社団法人リレーションデザイン研究所, but every OSS project documented here is owned and maintained personally by rdlabo. This portal and its projects are not activities of that incorporated association.

Production is `docs.rdlabo.dev` on Cloudflare Workers Static Assets. The repository is `rdlabo-dev/docs`.

## Current projects

| Project | Documentation source |
| --- | --- |
| Capacitor Community Stripe | `src/stripe/docs` |
| Capacitor Community Stripe Identity | `src/stripe-identity/docs` |
| Capacitor Community Stripe Terminal | `src/stripe-terminal/docs` |
| Capacitor Community AdMob | `src/admob/docs` |
| rdlabo Capacitor Code Scanner | `src/capacitor-codescanner/docs` |
| rdlabo Capacitor Screenshot Event | `src/capacitor-screenshot-event/docs` |
| rdlabo Capacitor Printer | `src/capacitor-printer/docs` |
| rdlabo Capacitor Brother Print | `src/capacitor-brotherprint/docs` |
| rdlabo Ionic Angular Kit | `src/ionic-angular-kit/docs` |
| rdlabo Ionic Angular Photo Editor | `src/ionic-angular-photo-editor/docs` |
| rdlabo Ionic Angular Scroll Header | `src/ionic-angular-scroll-header/docs` |
| rdlabo Angular CDK Scroll Strategies | `src/ngx-cdk-scroll-strategies/docs` |
| rdlabo Ionic Theme iOS26 | `src/ionic-theme-ios26/docs` |
| rdlabo Ionic Theme Material Design 3 | `src/ionic-theme-md3/docs` |
| rdlabo Ionic Angular Collect Icons | `src/ionic-angular-collect-icons/docs` |
| rdlabo Workers Hono Kit | `src/workers-hono-kit/docs` |
| rdlabo ESLint Plugin Rules | `src/eslint-plugin-rules/docs` |
| rdlabo Capacitor Docgen | `src/capacitor-docgen/docs` |

Project metadata, navigation, localized landing copy, and API input are declared in `scripts/project-manifest.ts`. The generator creates a small catalog plus one lazy module per project and locale.

## Commands

```bash
npm install
npm start
npm test
npm run build
npm run fmt:check
```

Generate documentation without starting the app:

```bash
npm run docs:generate
```

`prestart`, `prebuild`, and `pretest` run the generator automatically.

## Canonical routes

```text
/
/projects/:project
/projects/:project/docs/:page
/ja/projects/:project
/ja/projects/:project/docs/:page
```

## Documentation format

Narrative documentation uses Zenn Markdown. Markdown-only projects take their displayed version from the exactly pinned installed package. Capacitor API entries are expanded from the installed package's pinned `dist/docs.json` with placeholders such as:

```md
<!-- !::createPaymentSheet:: -->
```

The generator also accepts the bare `!::createPaymentSheet::` form. Package guides that GitHub renders should use the HTML-comment form so the placeholder stays hidden.

Capacitor READMEs containing both `<docgen-index>` and `<docgen-api>` are automatically exposed as
separate README and API pages. The source README remains the single file to update.

Every project exposes a dedicated API page. Hand-authored API Markdown uses semantic entry headings
such as `` #### `component` PhotoEditorPage `` or `` #### `function` generate ``; the generator
normalizes those entries and Capacitor docgen output into the same API-card presentation.

Generated project modules live under `src/app/generated/projects` and must not be edited by hand.

API input is restricted to packages declared in `scripts/project-manifest.ts` and installed at exact
versions in `package-lock.json`. Generated HTML is reviewed as part of the repository diff; adding a
new documentation adapter or package source requires its own fixture, schema validation, and review.

Documentation-source packages are inspected at generation time and are never imported into the site
bundle. `.npmrc` enables legacy peer resolution because those packages may document a different
Angular major than the portal itself; every source version remains exact in `package-lock.json`.

Production `anyScript` budgets in `angular.json` warn at 405kB and fail at 450kB. The warning
baseline covers the shared bilingual catalog and GitHub Star UI for 18 projects (the current
production main is about 397.7kB); documentation bodies remain lazy-loaded, so the hard error stays
at 450kB.

## Deployment

Production deploys to Cloudflare Workers Static Assets on the custom domain only (`docs.rdlabo.dev`); `workers.dev` and preview URLs are disabled. After `CI` succeeds for the current `main` revision, the separate `Deploy to Cloudflare` workflow checks out that exact verified commit, rebuilds the production assets, and deploys them with the repository-pinned Wrangler version. A completed CI run for an older revision is skipped, preventing an out-of-order build from rolling production back. The workflow can also be dispatched manually from `main`.

The GitHub Actions repository secret `CLOUDFLARE_API_TOKEN` is required. Create a narrowly scoped Cloudflare API token that can edit Workers for the account declared in `wrangler.jsonc`; never commit the token. Local deployment remains available for recovery through `npm run deploy` and `npm run deploy:dry-run`, but is not part of the normal release flow.

Cloudflare drops trailing slashes (`html_handling: drop-trailing-slash`) so URLs match canonical project and docs routes.
