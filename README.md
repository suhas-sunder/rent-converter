# RentConverter

[RentConverter.com](https://www.rentconverter.com/) is a browser-based collection
of rent conversion, affordability, increase, split, proration, schedule, and
lease-date calculators.

## Static Netlify architecture

The production build is a fully prerendered React Router application:

- `react-router.config.ts` disables runtime SSR and prerenders every static route.
- `build/client` is the only Netlify publish directory.
- 60 canonical routes are emitted as route-specific, flat HTML documents so
  Netlify serves the established no-slash canonical URLs directly.
- 112 retired aliases are emitted as static HTTP 301 rules in `_redirects`.
- Unknown document paths use the static `404.html` page with a real HTTP 404.
- There is no wildcard HTTP 200 rewrite, Netlify Function, Edge Function,
  Express server, middleware, or production `build/server` dependency.
- The build removes React Router's unused SPA fallback document.
- Calculator state, current-date defaults, exports, printing, and optional
  consent-gated PostHog analytics run only in the browser.

`app/client/data/routeRegistry.ts` remains the source of truth for canonical
discovery data and redirect aliases. The prebuild step generates
`public/_redirects` from that registry. Netlify preserves incoming query
parameters on these ordinary 301 redirects.

## Local development

```sh
npm ci
npm run dev
```

## Build and static preview

```sh
npm run build
npm run preview
```

The build runs a postbuild audit that requires all 60 prerendered pages, all 112
static redirects, the custom 404 page, and the absence of a runtime server
bundle.

## Validation

```sh
npm run typecheck
npm test
npm run build
npm run validate:redirects
npm run validate:breadcrumbs
npm run release:audit
```

The release audit launches the local static preview automatically and verifies
HTTP 200 pages, permanent redirects, query preservation, internal links,
metadata, schema, and the static HTTP 404.

## Netlify configuration

Netlify should use the committed `netlify.toml`:

- build command: `npm run build`
- publish directory: `build/client`

Deploys are triggered by the repository integration after `main` is pushed.
There is no manual deployment step and no Functions or Edge Functions directory.
