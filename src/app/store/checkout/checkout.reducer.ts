import { createFeature, createReducer, on } from '@ngrx/store';
import { CheckoutActions } from './checkout.actions';
import { CheckoutState } from './checkout.model';

const initialState: CheckoutState = {
  activeOrder: null,
  orderLoaded: false,
  shippingMethods: [],
  selectedShippingMethodId: null,
  completedOrder: null,
  loading: false,
  error: null,
};

export const checkoutFeature = createFeature({
  name: 'checkout',
  reducer: createReducer(
    initialState,

    on(CheckoutActions.loadCheckout, state => ({
      ...state,
      orderLoaded: false,
      error: null,
    })),
    on(CheckoutActions.loadActiveOrderSuccess, (state, { order }) => ({
      ...state,
      activeOrder: order,
      orderLoaded: true,
    })),
    on(CheckoutActions.loadActiveOrderFailure, (state, { error }) => ({
      ...state,
      orderLoaded: true,
      error,
    })),
    on(CheckoutActions.loadShippingMethodsSuccess, (state, { methods }) => ({
      ...state,
      shippingMethods: methods,
      // Auto-select first method if none selected
      selectedShippingMethodId: state.selectedShippingMethodId ?? methods[0]?.id ?? null,
    })),
    on(CheckoutActions.loadShippingMethodsFailure, (state, { error }) => ({
      ...state,
      error,
    })),

    on(CheckoutActions.selectShippingMethod, (state, { methodId }) => ({
      ...state,
      selectedShippingMethodId: methodId,
    })),

    on(CheckoutActions.placeOrder, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(CheckoutActions.setAddressFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: `Address: ${error}`,
    })),
    on(CheckoutActions.setShippingMethodFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: `Shipping: ${error}`,
    })),
    on(CheckoutActions.transitionToPaymentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error: `Order transition: ${error}`,
    })),
    on(CheckoutActions.addPaymentFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(CheckoutActions.orderComplete, (state, { order }) => ({
      ...state,
      loading: false,
      completedOrder: order,
      activeOrder: null,
    })),

    on(CheckoutActions.reset, () => initialState),
  ),
});
