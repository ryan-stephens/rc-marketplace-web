export interface FacetValue {
  id: string;
  code: string;
  name: string;
}

export interface Facet {
  id: string;
  code: string;
  name: string;
  values: FacetValue[];
}

export interface ListingFilters {
  classCode: string;
  driveCode: string;
  conditionCode: string;
}

export interface SearchResult {
  productId: string;
  productName: string;
  slug: string;
  productAsset: { preview: string } | null;
  priceWithTax: { value?: number; min?: number; max?: number };
  currencyCode: string;
  facetValueIds: string[];
}

export interface MyListing {
  id: string;
  name: string;
  slug: string;
  variants: Array<{ id: string; price: number; currencyCode: string }>;
  customFields: {
    condition?: string;
    rcClass?: string;
    driveType?: string;
    brand?: string;
    model?: string;
  };
}

export interface ListingsState {
  facets: Facet[];
  facetsLoaded: boolean;
  searchResults: SearchResult[];
  searchTotalItems: number;
  filters: ListingFilters;
  searchLoading: boolean;
  myListings: MyListing[];
  myListingsLoading: boolean;
  submitting: boolean;
  createSuccess: boolean;
  error: string | null;
}
