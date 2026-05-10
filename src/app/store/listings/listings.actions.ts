import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { CreateListingInput } from '../../../gql/graphql';
import { Facet, ListingFilters, MyListing, SearchResult } from './listings.model';

export const ListingsActions = createActionGroup({
  source: 'Listings',
  events: {
    // Facets — loaded once on first visit to /listings
    'Load Facets': emptyProps(),
    'Load Facets Success': props<{ facets: Facet[] }>(),
    'Load Facets Failure': props<{ error: string }>(),

    // Search — triggered on init and on filter change
    'Search': props<{ filters: ListingFilters }>(),
    'Search Success': props<{ items: SearchResult[]; totalItems: number }>(),
    'Search Failure': props<{ error: string }>(),

    // My listings
    'Load My Listings': emptyProps(),
    'Load My Listings Success': props<{ listings: MyListing[] }>(),
    'Load My Listings Failure': props<{ error: string }>(),

    // Create listing (from /sell form)
    'Create Listing': props<{ input: CreateListingInput }>(),
    'Create Listing Success': emptyProps(),
    'Create Listing Failure': props<{ error: string }>(),
    'Reset Create': emptyProps(),

    // Delete listing
    'Delete Listing': props<{ id: string }>(),
    'Delete Listing Success': props<{ id: string }>(),
    'Delete Listing Failure': props<{ error: string }>(),
  },
});
