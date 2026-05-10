import { createFeature, createReducer, on } from '@ngrx/store';
import { OrdersActions } from './orders.actions';

export interface OrdersState {
  customerOrders: any[];
  customerOrdersLoading: boolean;
  mySales: any[];
  mySalesLoading: boolean;
  shippingOrderId: string | null; // which order is being shipped
  error: string | null;
}

const initialState: OrdersState = {
  customerOrders: [],
  customerOrdersLoading: false,
  mySales: [],
  mySalesLoading: false,
  shippingOrderId: null,
  error: null,
};

export const ordersFeature = createFeature({
  name: 'orders',
  reducer: createReducer(
    initialState,

    on(OrdersActions.loadCustomerOrders, state => ({
      ...state,
      customerOrdersLoading: true,
      error: null,
    })),
    on(OrdersActions.loadCustomerOrdersSuccess, (state, { orders }) => ({
      ...state,
      customerOrders: orders,
      customerOrdersLoading: false,
    })),
    on(OrdersActions.loadCustomerOrdersFailure, (state, { error }) => ({
      ...state,
      customerOrdersLoading: false,
      error,
    })),

    on(OrdersActions.loadMySales, state => ({
      ...state,
      mySalesLoading: true,
      error: null,
    })),
    on(OrdersActions.loadMySalesSuccess, (state, { sales }) => ({
      ...state,
      mySales: sales,
      mySalesLoading: false,
    })),
    on(OrdersActions.loadMySalesFailure, (state, { error }) => ({
      ...state,
      mySalesLoading: false,
      error,
    })),

    on(OrdersActions.shipOrderSuccess, (state, { updatedOrder }) => ({
      ...state,
      mySales: state.mySales.map(o => o.id === updatedOrder.id ? updatedOrder : o),
      shippingOrderId: null,
    })),
    on(OrdersActions.shipOrderFailure, (state, { error }) => ({
      ...state,
      error,
    })),
  ),
});
