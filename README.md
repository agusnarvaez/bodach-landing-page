# bodach-landing-page

[![QA](https://github.com/agusnarvaez/bodach-landing-page/actions/workflows/build.yml/badge.svg)](https://github.com/agusnarvaez/bodach-landing-page/actions/workflows/build.yml)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)](https://angular.dev/)

Angular landing page for Bodach, focused on product catalog presentation and corporate information.

Landing page en Angular para Bodach, enfocada en la presentacion del catalogo de productos y la informacion corporativa.

## Overview

### ES

La aplicacion expone una home institucional, catalogo, detalle de producto, contacto y pagina 404. Consume contenido de productos desde Sanity y cuenta con testing sobre componentes, paginas y servicios Angular.

### EN

The application exposes a corporate home page, catalog, product detail, contact page, and 404 page. It consumes product content from Sanity and includes tests for Angular components, pages, and services.

## Stack

- Angular 17
- TypeScript
- RxJS
- Karma + Jasmine
- ESLint
- GitHub Actions

## Getting Started

```bash
npm install
npm run dev
```

## Main Commands

```bash
npm run dev
npm run lint
npm run build
npm run build:prod
npm run test:ci
```

## Important Paths

- `src/app/app.routes.ts` route definitions
- `src/app/pages/` route-level pages
- `src/app/components/` reusable UI pieces
- `src/app/sections/` home and catalog sections
- `src/app/services/` Sanity-backed data and email services
- `environment.prod.ts` production environment values

## Quality

- ESLint validates the TypeScript source tree.
- Angular build completes successfully in production mode.
- CI runs headless tests with coverage plus lint.

## License

MIT. See [LICENSE](./LICENSE).
