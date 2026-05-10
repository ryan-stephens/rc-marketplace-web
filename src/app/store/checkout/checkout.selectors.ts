import { checkoutFeature } from './checkout.reducer';

export const {
  selectActiveOrder,
  selectOrderLoaded,
  selectShippingMethods,
  selectSelectedShippingMethodId,
  selectCompletedOrder,
  selectLoading,
  selectError,
} = checkoutFeature;
