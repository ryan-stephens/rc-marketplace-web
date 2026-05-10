import { createSelector } from '@ngrx/store';
import { listingsFeature } from './listings.reducer';

export const {
  selectFacets,
  selectFacetsLoaded,
  selectSearchResults,
  selectSearchTotalItems,
  selectFilters,
  selectSearchLoading,
  selectMyListings,
  selectMyListingsLoading,
  selectSubmitting,
  selectCreateSuccess,
  selectError,
} = listingsFeature;

// { 'rc-class': { '1-10': 'id42' }, ... } — for filter dropdowns → facet value IDs
export const selectCodeMap = createSelector(selectFacets, facets => {
  const map: Record<string, Record<string, string>> = {};
  for (const facet of facets) {
    map[facet.code] = {};
    for (const val of facet.values) {
      map[facet.code][val.code] = String(val.id);
    }
  }
  return map;
});

// { 'id42': { label: '1/10 Scale', facetCode: 'rc-class' } } — for badge display
export const selectLabelMap = createSelector(selectFacets, facets => {
  const map: Record<string, { label: string; facetCode: string }> = {};
  for (const facet of facets) {
    for (const val of facet.values) {
      map[String(val.id)] = { label: val.name, facetCode: facet.code };
    }
  }
  return map;
});
