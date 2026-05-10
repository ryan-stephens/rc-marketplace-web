import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { GET_FACETS, GET_MY_LISTINGS, SEARCH_LISTINGS } from '../../graphql/queries';
import { CREATE_LISTING, DELETE_LISTING } from '../../graphql/mutations';
import { ListingsActions } from './listings.actions';
import { selectCodeMap, selectFacetsLoaded } from './listings.selectors';

@Injectable()
export class ListingsEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);
  private store = inject(Store);

  loadFacets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadFacets),
      withLatestFrom(this.store.select(selectFacetsLoaded)),
      switchMap(([, alreadyLoaded]) => {
        if (alreadyLoaded) return of({ type: '[Listings] Facets Already Loaded' } as any);
        return this.apollo.query({ query: GET_FACETS }).pipe(
          map((res: any) => ListingsActions.loadFacetsSuccess({
            facets: res.data?.facets?.items ?? [],
          })),
          catchError(err => of(ListingsActions.loadFacetsFailure({
            error: err.message ?? 'Failed to load facets.',
          }))),
        );
      }),
    )
  );

  search$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.search),
      withLatestFrom(this.store.select(selectCodeMap)),
      switchMap(([{ filters }, codeMap]) => {
        const facetValueFilters: Array<{ and: string }> = [];
        if (filters.classCode) {
          const id = codeMap['rc-class']?.[filters.classCode];
          if (id) facetValueFilters.push({ and: id });
        }
        if (filters.driveCode) {
          const id = codeMap['drive-type']?.[filters.driveCode];
          if (id) facetValueFilters.push({ and: id });
        }
        if (filters.conditionCode) {
          const id = codeMap['condition']?.[filters.conditionCode];
          if (id) facetValueFilters.push({ and: id });
        }

        return this.apollo.query({
          query: SEARCH_LISTINGS,
          variables: {
            input: {
              groupByProduct: true,
              take: 50,
              ...(facetValueFilters.length ? { facetValueFilters } : {}),
            },
          },
          fetchPolicy: 'network-only',
        }).pipe(
          map((res: any) => {
            const search = res.data?.search ?? {};
            return ListingsActions.searchSuccess({
              items: search.items ?? [],
              totalItems: search.totalItems ?? 0,
            });
          }),
          catchError(err => of(ListingsActions.searchFailure({
            error: err.message ?? 'Search failed.',
          }))),
        );
      }),
    )
  );

  loadMyListings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.loadMyListings),
      switchMap(() =>
        this.apollo.query({ query: GET_MY_LISTINGS, fetchPolicy: 'network-only' }).pipe(
          map((res: any) => ListingsActions.loadMyListingsSuccess({
            listings: res.data?.myListings ?? [],
          })),
          catchError(err => of(ListingsActions.loadMyListingsFailure({
            error: err.message ?? 'Failed to load listings.',
          }))),
        )
      ),
    )
  );

  createListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.createListing),
      switchMap(({ input }) =>
        this.apollo.mutate({ mutation: CREATE_LISTING, variables: { input } }).pipe(
          map(() => ListingsActions.createListingSuccess()),
          catchError(err => of(ListingsActions.createListingFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to create listing.',
          }))),
        )
      ),
    )
  );

  deleteListing$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ListingsActions.deleteListing),
      switchMap(({ id }) =>
        this.apollo.mutate({ mutation: DELETE_LISTING, variables: { id } }).pipe(
          map(() => ListingsActions.deleteListingSuccess({ id })),
          catchError(err => of(ListingsActions.deleteListingFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to delete listing.',
          }))),
        )
      ),
    )
  );
}
