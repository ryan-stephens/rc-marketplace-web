# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start      # ng serve — dev server at http://localhost:4200
npm run build      # ng build (production)
npm run test       # karma unit tests
npx ng build --configuration=development   # dev build (no optimisation, for verifying output)
```

There is no lint script configured. TypeScript checking: `npx tsc --noEmit`.

## Architecture

Angular 20 SPA, standalone components throughout, signals for state, lazy-loaded routes. Talks to `rc-marketplace-api` (Vendure) via GraphQL.

### Key wiring

**`src/app/app.config.ts`** — central config. Three important things here:
1. `vendureAuthInterceptor` — HTTP interceptor that reads `vendure-auth-token` from `localStorage` and attaches it as `Authorization: Bearer` on every request. On responses, captures the `vendure-auth-token` header (returned by Vendure login) and stores it. This is the entire auth token lifecycle.
2. Apollo client pointed at `http://localhost:3000/shop-api` (hardcoded — update for production).
3. `withComponentInputBinding()` on the router — route params (`:id`, `:carId`, etc.) are auto-bound to component `input()` signals by name.

**`src/app/services/auth.service.ts`** — singleton signal-based auth state. Holds `customer` signal (null when logged out). Components read `auth.isLoggedIn()` and `auth.customer()`. On logout, clears `localStorage` token and Apollo cache.

### GraphQL

All queries in `src/app/graphql/queries.ts`, all mutations in `src/app/graphql/mutations.ts`. Apollo `watchQuery` used for reactive queries (returns Observable that updates on cache changes). `apollo.mutate()` for writes.

### Pages

All pages are lazy-loaded standalone components in `src/app/pages/`. Route param binding means components declare `input<string>('')` matching the route param name — no `ActivatedRoute` needed.

When a page query depends on a route param, use:
```typescript
toSignal(
  toObservable(this.paramInput).pipe(
    filter(v => !!v),   // required — fires before param arrives
    switchMap(v => this.apollo.watchQuery(...).valueChanges),
    map((r: any) => r.data?.thing ?? null),
  ),
  { initialValue: null },
)
```

### Styling

Tailwind v4 via `@use "tailwindcss"` in `src/styles.scss`. PostCSS config in `.postcssrc.json` using `@tailwindcss/postcss`. **Do not use a separate `tailwind.config.js`** — v4 is CSS-first. Custom theme tokens are in `src/styles.scss` under `@theme {}`.

### Angular 20 conventions in this codebase

- `input()` / `output()` functions, not `@Input()` / `@Output()` decorators
- `inject()` not constructor injection
- `ChangeDetectionStrategy.OnPush` on all components
- Native control flow: `@if`, `@for`, `@switch` — not structural directives
- No NgModules anywhere

### API URL

`API_URL` is hardcoded in `app.config.ts`. For deployment, this needs to be replaced with an environment-specific value or an Angular environment file.
