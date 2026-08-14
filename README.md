# Capacitor Plugins Docs

Documentation site for Capacitor Community plugins. This repository is a single Angular application (Angular 22 + Tailwind) that serves docs for multiple plugins.

## Plugins

| Plugin | Docs source |
| --- | --- |
| Stripe | `src/stripe/docs` |
| Stripe Identity | `src/stripe-identity/docs` |
| Stripe Terminal | `src/stripe-terminal/docs` |
| AdMob | `src/admob/docs` |

Markdown under those folders is compiled into the Angular app by the docs generator.

## Commands

```bash
npm install
npm start
npm test
npm run build
npm run fmt:check
```

Generate docs without starting the app:

```bash
npm run docs:generate
```

`prestart`, `prebuild`, and `pretest` run `docs:generate` automatically before `start`, `build`, and `test`.

## Routes

| Path | Description |
| --- | --- |
| `/` | Plugin index |
| `/stripe` | Stripe landing page |
| `/stripe/docs/:slug` | Stripe documentation pages |
| `/stripe-identity` | Stripe Identity landing page |
| `/stripe-identity/docs/:slug` | Stripe Identity documentation pages |
| `/stripe-terminal` | Stripe Terminal landing page |
| `/stripe-terminal/docs/:slug` | Stripe Terminal documentation pages |
| `/admob` | AdMob landing page |
| `/admob/docs/:slug` | AdMob documentation pages |
| `/docs/:slug` | Legacy redirect to `/stripe/docs/:slug` |
| `/docs/identity` | Redirects to `/stripe-identity/docs/identity-verification-sheet` |
| `/**` | Redirects to `/stripe` |

## Markdown

Docs use [Zenn markdown](https://zenn.dev/zenn/articles/markdown-guide). Plugin API snippets can be inserted with:

```md
!::createPaymentSheet::
```

## Deployment

Pushes to `main` deploy through the existing Netlify site to https://stripe.capacitorjs.jp/. Build settings live in `netlify.toml`.
