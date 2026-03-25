# CLAUDE.md

## Project Snapshot

`bodach-landing-page` is an Angular application for the Bodach public site and product catalog.

## Stack

- Angular 17
- TypeScript
- RxJS
- Karma + Jasmine
- ESLint
- GitHub Actions

## Important Paths

- `src/app/app.routes.ts` route definitions
- `src/app/pages/` page-level views
- `src/app/components/` reusable UI components
- `src/app/sections/` home and products sections
- `src/app/services/` product, category, filters, and email services
- `.github/workflows/build.yml` QA workflow

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run build:prod
npm run test:ci
```

## Working Rules

- Prefer `npm run test:ci` for unattended verification and keep watch mode only for explicit local debugging.
- Keep Angular routes, product data flows, and README/workflow expectations aligned.
- Treat `environment.prod.ts` as deployment-sensitive configuration.
