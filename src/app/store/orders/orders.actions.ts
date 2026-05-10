import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const OrdersActions = createActionGroup({
  source: 'Orders',
  events: {
    'Load Customer Orders': emptyProps(),
    'Load Customer Orders Success': props<{ orders: any[] }>(),
    'Load Customer Orders Failure': props<{ error: string }>(),

    'Load My Sales': emptyProps(),
    'Load My Sales Success': props<{ sales: any[] }>(),
    'Load My Sales Failure': props<{ error: string }>(),

    'Ship Order': props<{ orderId: string; carrier: string; trackingCode: string | null }>(),
    'Ship Order Success': props<{ updatedOrder: any }>(),
    'Ship Order Failure': props<{ orderId: string; error: string }>(),
  },
});
