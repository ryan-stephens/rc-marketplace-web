import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Apollo } from 'apollo-angular';
import { catchError, map, of, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  GET_ACTIVE_ORDER,
  GET_ELIGIBLE_SHIPPING_METHODS,
} from '../../graphql/queries';
import {
  ADD_PAYMENT_TO_ORDER,
  SET_ORDER_SHIPPING_ADDRESS,
  SET_ORDER_SHIPPING_METHOD,
  TRANSITION_ORDER_TO_STATE,
} from '../../graphql/mutations';
import { CheckoutActions } from './checkout.actions';
import {
  selectActiveOrder,
  selectSelectedShippingMethodId,
} from './checkout.selectors';

@Injectable()
export class CheckoutEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);
  private router = inject(Router);
  private store = inject(Store);

  // ── Queries ──────────────────────────────────────────────────────────────

  loadActiveOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.loadCheckout),
      switchMap(() =>
        this.apollo.query({ query: GET_ACTIVE_ORDER, fetchPolicy: 'network-only' }).pipe(
          map((res: any) => CheckoutActions.loadActiveOrderSuccess({
            order: res.data?.activeOrder ?? null,
          })),
          catchError(err => of(CheckoutActions.loadActiveOrderFailure({
            error: err.message ?? 'Failed to load order.',
          }))),
        )
      ),
    )
  );

  loadShippingMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.loadCheckout),
      switchMap(() =>
        this.apollo.query({ query: GET_ELIGIBLE_SHIPPING_METHODS }).pipe(
          map((res: any) => CheckoutActions.loadShippingMethodsSuccess({
            methods: res.data?.eligibleShippingMethods ?? [],
          })),
          catchError(err => of(CheckoutActions.loadShippingMethodsFailure({
            error: err.message ?? 'Failed to load shipping methods.',
          }))),
        )
      ),
    )
  );

  // ── Sequential checkout mutation chain ────────────────────────────────────
  // Each step is triggered by the previous step's success action.
  // Every failure action sets error + stops loading — no further steps run.

  // Step 1: set shipping address
  setAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.placeOrder),
      switchMap(({ address }) =>
        this.apollo.mutate({
          mutation: SET_ORDER_SHIPPING_ADDRESS,
          variables: { input: address },
        }).pipe(
          map((res: any) => res.data.setOrderShippingAddress),
          map(result => result?.errorCode
            ? CheckoutActions.setAddressFailure({ error: result.message ?? 'Address error.' })
            : CheckoutActions.setAddressSuccess()
          ),
          catchError(err => of(CheckoutActions.setAddressFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Address error.',
          }))),
        )
      ),
    )
  );

  // Step 2: set shipping method (triggered by step 1 success)
  setShippingMethod$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.setAddressSuccess),
      withLatestFrom(this.store.select(selectSelectedShippingMethodId)),
      switchMap(([, methodId]) =>
        this.apollo.mutate({
          mutation: SET_ORDER_SHIPPING_METHOD,
          variables: { shippingMethodId: [methodId!] },
        }).pipe(
          map((res: any) => res.data.setOrderShippingMethod),
          map(result => result?.errorCode
            ? CheckoutActions.setShippingMethodFailure({ error: result.message ?? 'Shipping method error.' })
            : CheckoutActions.setShippingMethodSuccess()
          ),
          catchError(err => of(CheckoutActions.setShippingMethodFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Shipping method error.',
          }))),
        )
      ),
    )
  );

  // Step 3: transition order to ArrangingPayment (triggered by step 2 success)
  transitionToPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.setShippingMethodSuccess),
      withLatestFrom(this.store.select(selectActiveOrder)),
      switchMap(([, activeOrder]) => {
        const sellerPaypalEmail =
          activeOrder?.lines?.[0]?.productVariant?.product?.customFields?.sellerPaypalEmail ?? '';
        return this.apollo.mutate({
          mutation: TRANSITION_ORDER_TO_STATE,
          variables: { state: 'ArrangingPayment' },
        }).pipe(
          map((res: any) => res.data.transitionOrderToState),
          map(result => result?.errorCode
            ? CheckoutActions.transitionToPaymentFailure({ error: result.message ?? 'Order transition error.' })
            : CheckoutActions.transitionToPaymentSuccess({ sellerPaypalEmail })
          ),
          catchError(err => of(CheckoutActions.transitionToPaymentFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Order transition error.',
          }))),
        );
      }),
    )
  );

  // Step 4: add payment (triggered by step 3 success)
  addPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.transitionToPaymentSuccess),
      switchMap(({ sellerPaypalEmail }) =>
        this.apollo.mutate({
          mutation: ADD_PAYMENT_TO_ORDER,
          variables: { input: { method: 'paypal', metadata: { sellerPaypalEmail } } },
        }).pipe(
          map((res: any) => res.data.addPaymentToOrder),
          map(result => {
            if (result?.errorCode) {
              return CheckoutActions.addPaymentFailure({ error: result.message ?? 'Payment error.' });
            }
            const payment = result?.payments?.[0];
            const completed = {
              code: result?.code ?? '',
              sellerPaypalEmail: payment?.metadata?.sellerPaypalEmail ?? sellerPaypalEmail,
              amountDue: payment?.metadata?.amountDue ?? ((result?.totalWithTax ?? 0) / 100).toFixed(2),
              currencyCode: result?.currencyCode ?? 'USD',
            };
            return CheckoutActions.orderComplete({ order: completed });
          }),
          catchError(err => of(CheckoutActions.addPaymentFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Payment error.',
          }))),
        )
      ),
    )
  );

  // ── Navigation (no dispatch) ──────────────────────────────────────────────

  navigateToConfirm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CheckoutActions.orderComplete),
      tap(() => this.router.navigate(['/checkout/confirm'])),
    ),
    { dispatch: false }
  );
}
