import { ordersFeature } from './orders.reducer';

export const {
  selectCustomerOrders,
  selectCustomerOrdersLoading,
  selectMySales,
  selectMySalesLoading,
  selectError,
} = ordersFeature;
