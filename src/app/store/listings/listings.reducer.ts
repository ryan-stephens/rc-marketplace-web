import { createFeature, createReducer, on } from '@ngrx/store';
import { ListingsActions } from './listings.actions';
import { ListingsState } from './listings.model';

const initialState: ListingsState = {
  facets: [],
  facetsLoaded: false,
  searchResults: [],
  searchTotalItems: 0,
  filters: { classCode: '', driveCode: '', conditionCode: '' },
  searchLoading: false,
  myListings: [],
  myListingsLoading: false,
  submitting: false,
  createSuccess: false,
  error: null,
};

export const listingsFeature = createFeature({
  name: 'listings',
  reducer: createReducer(
    initialState,

    on(ListingsActions.loadFacets, state => ({ ...state })),
    on(ListingsActions.loadFacetsSuccess, (state, { facets }) => ({
      ...state,
      facets,
      facetsLoaded: true,
    })),
    on(ListingsActions.loadFacetsFailure, (state, { error }) => ({
      ...state,
      error,
    })),

    on(ListingsActions.search, (state, { filters }) => ({
      ...state,
      filters,
      searchLoading: true,
      error: null,
    })),
    on(ListingsActions.searchSuccess, (state, { items, totalItems }) => ({
      ...state,
      searchResults: items,
      searchTotalItems: totalItems,
      searchLoading: false,
    })),
    on(ListingsActions.searchFailure, (state, { error }) => ({
      ...state,
      searchLoading: false,
      error,
    })),

    on(ListingsActions.loadMyListings, state => ({
      ...state,
      myListingsLoading: true,
      error: null,
    })),
    on(ListingsActions.loadMyListingsSuccess, (state, { listings }) => ({
      ...state,
      myListings: listings,
      myListingsLoading: false,
    })),
    on(ListingsActions.loadMyListingsFailure, (state, { error }) => ({
      ...state,
      myListingsLoading: false,
      error,
    })),

    on(ListingsActions.createListing, state => ({
      ...state,
      submitting: true,
      createSuccess: false,
      error: null,
    })),
    on(ListingsActions.createListingSuccess, state => ({
      ...state,
      submitting: false,
      createSuccess: true,
    })),
    on(ListingsActions.createListingFailure, (state, { error }) => ({
      ...state,
      submitting: false,
      error,
    })),
    on(ListingsActions.resetCreate, state => ({
      ...state,
      createSuccess: false,
      error: null,
    })),

    on(ListingsActions.deleteListingSuccess, (state, { id }) => ({
      ...state,
      myListings: state.myListings.filter(l => l.id !== id),
    })),
    on(ListingsActions.deleteListingFailure, (state, { error }) => ({
      ...state,
      error,
    })),
  ),
});
