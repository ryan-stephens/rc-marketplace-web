# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start      # ng serve (dev, with proxy) — http://localhost:4200
npm run build      # ng build (production — environment.prod.ts, /shop-api)
npm run codegen    # generate TypeScript types from live Vendure schema (server must be up)
npm run test       # karma unit tests
npx tsc --noEmit   # type-check without building
npx ng build --configuration=development   # dev build (no optimisation)
```

No lint script configured.

**Run `npm run codegen` whenever:**
- A query or mutation is added/changed in `src/app/graphql/`
- The Vendure server schema changes (new plugin, new custom field)
- Vendure is upgraded

---

## Stack

| | |
|-|-|
| Angular | 21.2.x (standalone, signals, OnPush everywhere) |
| State | NgRx 21 (store + effects + entity) |
| GraphQL | apollo-angular 13 + @apollo/client 4 |
| Types | graphql-codegen client-preset → `src/gql/` |
| Styling | Tailwind v4 (CSS-first, no tailwind.config.js) |

---

## Architecture

### NgRx Store — the single source of truth

All application state lives in the NgRx store. **Components never call Apollo directly.**

```
src/app/store/
├── auth/           — customer, loaded, loading, error
├── checkout/       — activeOrder, shippingMethods, completedOrder, step errors
├── garage/         — GarageCar collection (@ngrx/entity), submitting, publishError
├── listings/       — facets, searchResults, filters, myListings, createSuccess
└── orders/         — customerOrders, mySales
```

Each feature has: `actions.ts`, `reducer.ts`, `effects.ts`, `selectors.ts`, `model.ts`.

### Rules — follow these in every component and effect

```
1. Components dispatch actions — never call apollo directly
2. Components select from store via store.selectSignal() — never hold business state locally
3. Effects handle all side effects — Apollo calls, localStorage, navigation
4. Selectors are memoized — never compute derived data in templates
5. Actions describe events — "orderComplete" not "navigateToConfirm"
6. Local signals only for UI-only state: dropdown open/closed, which row is expanded,
   gallery selected image — anything with no cross-component dependency
7. catchError in every async effect with a typed failure action
```

### Component pattern

```typescript
// Component selects from store — no Apollo, no local loading state
export class FooComponent implements OnInit {
  private store = inject(Store);

  items = this.store.selectSignal(fooSelectors.selectItems);
  loading = this.store.selectSignal(fooSelectors.selectLoading);
  error = this.store.selectSignal(fooSelectors.selectError);

  // UI-only local state (toggle, form input) — NOT store
  showForm = signal(false);

  ngOnInit() {
    this.store.dispatch(FooActions.loadItems());
  }

  delete(id: string) {
    this.store.dispatch(FooActions.deleteItem({ id }));
  }
}
```

### Effect pattern

```typescript
// Effect: Apollo call → success/failure actions; navigation as separate effect
loadItems$ = createEffect(() =>
  this.actions$.pipe(
    ofType(FooActions.loadItems),
    switchMap(() =>
      this.apollo.query({ query: GET_ITEMS }).pipe(
        map(res => FooActions.loadItemsSuccess({ items: res.data!.items! })),
        catchError(err => of(FooActions.loadItemsFailure({
          error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed.',
        }))),
      )
    ),
  )
);

// Navigation — no dispatch, separate effect
navigate$ = createEffect(() =>
  this.actions$.pipe(
    ofType(FooActions.loadItemsSuccess),
    tap(() => this.router.navigate(['/foo'])),
  ),
  { dispatch: false }
);
```

---

## GraphQL Types (codegen)

**Never write `(res: any)` or hand-craft DTOs for API responses.**

All queries/mutations use the generated `graphql()` function from `src/gql/`. This makes every document a `TypedDocumentNode<TData, TVariables>` — Apollo infers the response type automatically.

```typescript
// src/app/graphql/queries.ts
import { graphql } from '../../gql';

export const GET_PRODUCTS = graphql(`
  query GetProducts($options: ProductListOptions) {
    products(options: $options) {
      items { id name slug }
    }
  }
`);
// GET_PRODUCTS: TypedDocumentNode<GetProductsQuery, GetProductsQueryVariables>
```

```typescript
// In an effect — res.data is fully typed, no cast needed
this.apollo.query({ query: GET_PRODUCTS }).pipe(
  map(res => res.data!.products!.items)
)
```

**Generated files** (`src/gql/` — do not edit manually):
- `graphql.ts` — every type, input, enum, query/mutation result type from the Vendure schema
- `gql.ts` — overloaded `graphql()` function (one overload per document)
- `index.ts` — barrel export

**Scalars mapped:**
- `Money` → `number` (Vendure stores prices in minor units)
- `DateTime` → `string`
- `JSON` → `Record<string, any>`
- `Upload` → `File`

**Importing generated types in store files:**
```typescript
import type { CreateListingInput } from '../../../gql/graphql';
// path depth: store/{feature}/ is 3 levels from src/
```

---

## Key wiring

**`src/app/app.config.ts`** — registers:
1. `vendureAuthInterceptor` — reads `vendure-auth-token` from `localStorage`, attaches as `Authorization: Bearer`. On responses, captures the header and stores it. Entire auth token lifecycle.
2. Apollo client at `environment.apiUrl`.
3. NgRx `provideStore`, `provideEffects`, `provideStoreDevtools`.
4. `withComponentInputBinding()` — route params auto-bound to `input()` signals.

**`src/app/services/auth.service.ts`** — thin facade over the `auth` NgRx feature store. Exposes `customer`, `isLoggedIn`, `loaded`, `loading`, `error` as signals via `store.selectSignal()`. Methods `login()`, `register()`, `logout()` dispatch actions — no Apollo calls inside the service. All side effects (Apollo, localStorage, navigation) live in `AuthEffects`.

**`src/app/guards/auth.guard.ts`** — waits for `auth.loaded()` signal before deciding. Required to handle PayPal redirect-back without bouncing to `/account`.

---

## API URL / Environments

`src/environments/environment.ts` — dev: `apiUrl: 'http://localhost:3000/shop-api'`
`src/environments/environment.prod.ts` — prod: `apiUrl: '/shop-api'`

`angular.json` has `fileReplacements` in the production build config.

**Local dev proxy** (`proxy.conf.json`): `ng serve` proxies `/shop-api`, `/assets`, `/admin-api` → `localhost:3000`. No CORS issues in local dev.

**Docker**: nginx at port 4200 proxies all API routes to `server:3000`. Same-origin from browser's perspective.

---

## Pages

All pages are lazy-loaded standalone components in `src/app/pages/`. Route params auto-bind to `input<string>('')` — no `ActivatedRoute` needed.

**When a page query depends on a route param**, use `toObservable` + `switchMap` if the page is not yet NgRx-migrated (e.g. profile, listing-detail). For NgRx-migrated pages, dispatch `loadX()` from `ngOnInit`.

| Route | Component | Auth | Store feature |
|-------|-----------|------|--------------|
| `/` | HomeComponent | — | — (direct Apollo watchQuery) |
| `/listings` | ListingsComponent | — | `listings` |
| `/listings/:id` | ListingDetailComponent | — | — (direct Apollo) |
| `/sell` | SellComponent | ✓ | `listings` |
| `/garages` | GaragesComponent | — | — (direct Apollo) |
| `/garage` | GarageComponent | ✓ | `garage` |
| `/garage/:carId` | GarageCarComponent | ✓ | — (direct Apollo watchQuery) |
| `/my-listings` | MyListingsComponent | ✓ | `listings` |
| `/my-sales` | MySalesComponent | ✓ | `orders` |
| `/orders` | OrdersComponent | ✓ | `orders` |
| `/checkout` | CheckoutComponent | ✓ | `checkout` |
| `/checkout/confirm` | CheckoutConfirmComponent | ✓ | `checkout` (reads `selectCompletedOrder`) |
| `/profile/:userId` | ProfileComponent | — | — (direct Apollo) |
| `/account` | AccountComponent | — | `auth` |

Pages not yet migrated to NgRx (home, listing-detail, garages, garage-car, profile) still use `toSignal(apollo.watchQuery(...).valueChanges)` — acceptable for read-only display pages with no complex mutations.

---

## Listings filter / search

`/listings` dispatches to the `listings` store. On init:
- `ListingsActions.loadFacets()` → `ListingsEffects.loadFacets$` → builds `codeMap` + `labelMap` selectors
- `ListingsActions.search({ filters })` → `ListingsEffects.search$` → builds `facetValueFilters` from codeMap

Filter dropdowns use **facet codes** as option values (`1-10` not `1/10`, `used-like-new` not `used_like_new`). Facet IDs are resolved in the effect from the store's `codeMap` selector.

`SearchResult` does NOT include custom fields — badges derived from `facetValueIds` cross-referenced with `selectLabelMap`.

---

## Garage → Listing flow

Effect chain via `garage` store:
1. `GarageActions.publishListing({ input })` — dispatched from garage component
2. `GarageEffects.publishListing$` — calls `CREATE_LISTING` mutation
3. On success → `GarageActions.publishListingSuccess({ carId, productId })`
4. `GarageEffects.linkListingToCar$` — calls `UPDATE_GARAGE_CAR` to save `listingProductId`
5. `GarageActions.linkListingToCarSuccess` — entity adapter updates car in store
6. Garage card shows "Listed for sale" banner; profile page shows "For Sale" badge

---

## Checkout flow

4-step sequential mutation chain via `checkout` store effects:
1. `CheckoutActions.placeOrder({ address, shippingMethodId })` → `setAddress$`
2. `setAddressSuccess` → `setShippingMethod$`
3. `setShippingMethodSuccess` → `transitionToPayment$`
4. `transitionToPaymentSuccess` → `addPayment$`
5. `addPaymentSuccess` → `orderComplete({ order })` → `navigateToConfirm$`

`/checkout/confirm` reads `selectCompletedOrder` from store — no `history.state` fragility.

Each step has a distinct failure action with step-level context (`"Address: ..."`, `"Shipping: ..."`), fully visible in Redux DevTools.

---

## Styling

Tailwind v4 via `@use "tailwindcss"` in `src/styles.scss`. PostCSS config in `.postcssrc.json` using `@tailwindcss/postcss`. **Do not create `tailwind.config.js`** — v4 is CSS-first.

---

## Angular 21 conventions in this codebase

- `input()` / `output()` functions, not `@Input()` / `@Output()` decorators
- `inject()` not constructor injection (except NgRx effects which use `inject()` in class body)
- `ChangeDetectionStrategy.OnPush` on all components
- Native control flow: `@if`, `@for`, `@switch` — not structural directives
- No NgModules anywhere
- `store.selectSignal(selector)` for all business state in components
- `computed()` for derived view-state (e.g. `listingMap` on profile page)
- `effect()` in component constructor only for cross-signal reactions (e.g. navigate on login)

---

## Docker / nginx

Nginx at port 4200. `nginx.conf` proxies:
- `/shop-api` → `server:3000/shop-api`
- `/admin-api` → `server:3000/admin-api`
- `/admin` → `server:3000/admin`
- `/assets` → `server:3000/assets`
- `/mailbox` → `server:3000/mailbox`

Asset URLs from Vendure contain a host that may differ from the browser's origin. Always use `assetUrl()` from `src/app/utils/asset-url.ts` to strip the host and make the path relative — nginx then proxies it correctly regardless of environment.

```typescript
import { assetUrl } from '../../utils/asset-url';
// In template:
[src]="assetUrl(item.productAsset?.preview) + '?w=500'"
```
