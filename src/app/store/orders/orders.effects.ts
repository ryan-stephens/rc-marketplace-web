import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';
import { catchError, map, of, switchMap } from 'rxjs';
import { GET_CUSTOMER_ORDERS, GET_MY_SALES } from '../../graphql/queries';
import { SHIP_SALE_ORDER } from '../../graphql/mutations';
import { OrdersActions } from './orders.actions';

@Injectable()
export class OrdersEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);

  loadCustomerOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadCustomerOrders),
      switchMap(() =>
        this.apollo.query({ query: GET_CUSTOMER_ORDERS, fetchPolicy: 'network-only' }).pipe(
          map((res: any) => OrdersActions.loadCustomerOrdersSuccess({
            orders: res.data?.activeCustomer?.orders?.items ?? [],
          })),
          catchError(err => of(OrdersActions.loadCustomerOrdersFailure({
            error: err.message ?? 'Failed to load orders.',
          }))),
        )
      ),
    )
  );

  loadMySales$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.loadMySales),
      switchMap(() =>
        this.apollo.query({ query: GET_MY_SALES, fetchPolicy: 'network-only' }).pipe(
          map((res: any) => OrdersActions.loadMySalesSuccess({
            sales: res.data?.mySales ?? [],
          })),
          catchError(err => of(OrdersActions.loadMySalesFailure({
            error: err.message ?? 'Failed to load sales.',
          }))),
        )
      ),
    )
  );

  shipOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrdersActions.shipOrder),
      switchMap(({ orderId, carrier, trackingCode }) =>
        this.apollo.mutate({
          mutation: SHIP_SALE_ORDER,
          variables: { input: { orderId, carrier, trackingCode } },
        }).pipe(
          map((res: any) => OrdersActions.shipOrderSuccess({
            updatedOrder: res.data?.shipSaleOrder,
          })),
          catchError(err => of(OrdersActions.shipOrderFailure({
            orderId,
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Failed to ship order.',
          }))),
        )
      ),
    )
  );
}
