# rdlabo.dev

Documentation portal for personal open source projects created and maintained by rdlabo. The site is an Angular 22 static application with English and Japanese documentation.

The `rdlabo` name is also used by 一般社団法人リレーションデザイン研究所, but every OSS project documented here is owned and maintained personally by rdlabo. This portal and its projects are not activities of that incorporated association.

Production is `docs.rdlabo.dev` on Cloudflare Workers Static Assets. The repository will move to `rdlabo-dev/docs` in a later rollout. The legacy Netlify hostname forwards every path to `docs.rdlabo.dev`.

## Current projects

| Project | Documentation source |
| --- | --- |
| Capacitor Community Stripe | `src/stripe/docs` |
| Capacitor Community Stripe Identity | `src/stripe-identity/docs` |
| Capacitor Community Stripe Terminal | `src/stripe-terminal/docs` |
| Capacitor Community AdMob | `src/admob/docs` |
| rdlabo Ionic Angular Kit | `src/ionic-angular-kit/docs` |
| rdlabo Ionic Angular Photo Editor | `src/ionic-angular-photo-editor/docs` |
| rdlabo Ionic Angular Scroll Header | `src/ionic-angular-scroll-header/docs` |
| rdlabo Angular CDK Scroll Strategies | `src/ngx-cdk-scroll-strategies/docs` |
| rdlabo Ionic Theme iOS26 | `src/ionic-theme-ios26/docs` |
| rdlabo Ionic Theme Material Design 3 | `src/ionic-theme-md3/docs` |
| rdlabo Workers Hono Kit | `src/workers-hono-kit/docs` |
| rdlabo ESLint Plugin Rules | `src/eslint-plugin-rules/docs` |

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

The legacy Netlify hostname permanently forwards every path to the same path on `https://docs.rdlabo.dev` via a single catch-all in `netlify.toml`.

## Documentation format

Narrative documentation uses Zenn Markdown. Markdown-only projects take their displayed version from the exactly pinned installed package. Capacitor API entries are expanded from the installed package's pinned `dist/docs.json` with placeholders such as:

```md
!::createPaymentSheet::
```

Generated project modules live under `src/app/generated/projects` and must not be edited by hand.

API input is restricted to packages declared in `scripts/project-manifest.ts` and installed at exact
versions in `package-lock.json`. Generated HTML is reviewed as part of the repository diff; adding a
new documentation adapter or package source requires its own fixture, schema validation, and review.

Documentation-source packages are inspected at generation time and are never imported into the site
bundle. `.npmrc` enables legacy peer resolution because those packages may document a different
Angular major than the portal itself; every source version remains exact in `package-lock.json`.

Production `anyScript` budgets in `angular.json` warn at 390kB and fail at 450kB. The warning
baseline covers the shared catalog after adding the Ionic theme project summaries (~6.8kB); docs
remain lazy-loaded, so the hard error stays at 450kB.

## Deployment

Production deploys to Cloudflare Workers Static Assets on the custom domain only (`docs.rdlabo.dev`); `workers.dev` and preview URLs are disabled. Deploy on each release or docs update with `npm run deploy` or `npm run deploy:dry-run` after a local build. Cloudflare drops trailing slashes (`html_handling: drop-trailing-slash`) so URLs match canonical project and docs routes. The legacy Netlify hostname keeps a forced permanent catch-all that forwards every path to `https://docs.rdlabo.dev/:splat`.
