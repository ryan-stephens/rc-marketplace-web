import { createSelector } from '@ngrx/store';
import { authFeature } from './auth.reducer';

export const {
  selectCustomer,
  selectLoaded,
  selectLoading,
  selectError,
} = authFeature;

export const selectIsLoggedIn = createSelector(
  selectCustomer,
  customer => customer !== null,
);

export const selectCustomerName = createSelector(
  selectCustomer,
  customer => customer ? `${customer.firstName} ${customer.lastName}`.trim() : null,
);
