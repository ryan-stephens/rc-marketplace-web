import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { OrdersActions } from '../../store/orders/orders.actions';
import { selectCustomerOrders, selectCustomerOrdersLoading } from '../../store/orders/orders.selectors';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">My Orders</h1>

      @if (loading()) {
        <p class="text-center text-gray-400 py-16">Loading...</p>
      } @else if (orders().length === 0) {
        <p class="text-center text-gray-500 py-16">No orders yet.</p>
      } @else {
        <div class="space-y-4">
          @for (order of orders(); track order.id) {
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <span class="font-mono text-sm text-gray-500">{{ order.code }}</span>
                  <span class="ml-3 text-xs px-2 py-0.5 rounded-full"
                    [class]="order.state === 'PaymentSettled' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'">
                    {{ order.state }}
                  </span>
                </div>
                <div class="text-right">
                  <p class="font-bold text-red-600">{{ order.totalWithTax / 100 | currency: order.currencyCode }}</p>
                  @if (order.orderPlacedAt) {
                    <p class="text-xs text-gray-400">{{ order.orderPlacedAt | date: 'mediumDate' }}</p>
                  }
                </div>
              </div>
              <div class="divide-y">
                @for (line of order.lines; track line.id) {
                  <div class="py-2 flex justify-between text-sm">
                    <span>{{ line.productVariant.product.name }}</span>
                    <span class="text-gray-600">{{ line.unitPriceWithTax / 100 | currency: order.currencyCode }} × {{ line.quantity }}</span>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class OrdersComponent implements OnInit {
  private store = inject(Store);

  orders = this.store.selectSignal(selectCustomerOrders);
  loading = this.store.selectSignal(selectCustomerOrdersLoading);

  ngOnInit() {
    this.store.dispatch(OrdersActions.loadCustomerOrders());
  }
}
