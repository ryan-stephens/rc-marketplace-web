import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CompletedOrder, ShippingAddress, ShippingMethod } from './checkout.model';

export const CheckoutActions = createActionGroup({
  source: 'Checkout',
  events: {
    // Load queries on checkout page init
    'Load Checkout': emptyProps(),
    'Load Active Order Success': props<{ order: any }>(),
    'Load Active Order Failure': props<{ error: string }>(),
    'Load Shipping Methods Success': props<{ methods: ShippingMethod[] }>(),
    'Load Shipping Methods Failure': props<{ error: string }>(),

    // User selects a shipping method
    'Select Shipping Method': props<{ methodId: string }>(),

    // User submits the form — triggers the sequential 4-step mutation chain
    'Place Order': props<{ address: ShippingAddress; shippingMethodId: string }>(),

    // Step 1: set shipping address
    'Set Address Success': emptyProps(),
    'Set Address Failure': props<{ error: string }>(),

    // Step 2: set shipping method
    'Set Shipping Method Success': emptyProps(),
    'Set Shipping Method Failure': props<{ error: string }>(),

    // Step 3: transition to ArrangingPayment
    'Transition To Payment Success': props<{ sellerPaypalEmail: string }>(),
    'Transition To Payment Failure': props<{ error: string }>(),

    // Step 4: add payment → order complete
    'Add Payment Success': props<{ order: CompletedOrder }>(),
    'Add Payment Failure': props<{ error: string }>(),

    // Final: navigate to confirm page
    'Order Complete': props<{ order: CompletedOrder }>(),

    // Reset state when leaving checkout
    'Reset': emptyProps(),
  },
});
