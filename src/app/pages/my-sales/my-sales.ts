import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { OrdersActions } from '../../store/orders/orders.actions';
import { selectMySales, selectMySalesLoading } from '../../store/orders/orders.selectors';

@Component({
  selector: 'app-my-sales',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">My Sales</h1>

      @if (loading()) {
        <p class="text-gray-500 text-center py-16">Loading...</p>
      } @else if (sales().length === 0) {
        <p class="text-gray-500 text-center py-16">No orders yet for your listings.</p>
      } @else {
        <div class="space-y-4">
          @for (order of sales(); track order.id) {
            <div class="border rounded-lg p-4">
              <div class="flex items-start justify-between mb-3">
                <div>
                  <span class="font-mono text-sm text-gray-500">{{ order.code }}</span>
                  <span class="ml-3 text-xs px-2 py-0.5 rounded-full" [class]="stateClass(order.state)">
                    {{ order.state }}
                  </span>
                  @if (order.orderPlacedAt) {
                    <span class="ml-3 text-xs text-gray-400">{{ order.orderPlacedAt | date: 'mediumDate' }}</span>
                  }
                </div>
                <span class="font-bold text-red-600">{{ order.totalWithTax / 100 | currency: order.currencyCode }}</span>
              </div>

              @if (order.customer) {
                <p class="text-sm text-gray-600 mb-2">
                  Buyer: <span class="font-medium">{{ order.customer.firstName }} {{ order.customer.lastName }}</span>
                </p>
              }

              <div class="divide-y border rounded mb-3">
                @for (line of order.lines; track line.id) {
                  <div class="flex justify-between text-sm px-3 py-2">
                    <span>{{ line.productVariant.product.name }}</span>
                    <span class="text-gray-500">{{ line.unitPriceWithTax / 100 | currency: order.currencyCode }} × {{ line.quantity }}</span>
                  </div>
                }
              </div>

              @if (order.fulfillments?.length) {
                <div class="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <p class="font-medium text-green-800">Shipped</p>
                  @for (f of order.fulfillments; track f.id) {
                    @if (f.method) { <p class="text-green-700">Carrier: {{ f.method }}</p> }
                    @if (f.trackingCode) { <p class="text-green-700">Tracking: {{ f.trackingCode }}</p> }
                  }
                </div>
              } @else if (order.state === 'PaymentSettled') {
                @if (shippingOrderId() === order.id) {
                  <div class="bg-gray-50 border rounded p-3 mt-2 space-y-2">
                    <p class="text-sm font-medium">Mark as Shipped</p>
                    <div class="flex gap-2">
                      <input [(ngModel)]="carrier" placeholder="Carrier (e.g. UPS, FedEx)" class="flex-1 border rounded px-2 py-1.5 text-sm">
                      <input [(ngModel)]="trackingCode" placeholder="Tracking number (optional)" class="flex-1 border rounded px-2 py-1.5 text-sm">
                    </div>
                    @if (shipError()) {
                      <p class="text-red-600 text-xs">{{ shipError() }}</p>
                    }
                    <div class="flex gap-2">
                      <button (click)="submitShipment(order.id)" [disabled]="shipping()"
                        class="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50">
                        {{ shipping() ? 'Saving...' : 'Confirm Shipment' }}
                      </button>
                      <button (click)="shippingOrderId.set('')" class="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                    </div>
                  </div>
                } @else {
                  <div class="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm flex items-center justify-between">
                    <p class="text-yellow-800">Awaiting shipment — confirm you received payment via PayPal before shipping.</p>
                    <button (click)="startShipping(order.id)"
                      class="ml-4 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap">
                      Mark as Shipped
                    </button>
                  </div>
                }
              }
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MySalesComponent implements OnInit {
  private store = inject(Store);

  sales = this.store.selectSignal(selectMySales);
  loading = this.store.selectSignal(selectMySalesLoading);

  // UI-only state — which order's form is open + form fields
  shippingOrderId = signal('');
  carrier = '';
  trackingCode = '';
  shipping = signal(false);
  shipError = signal('');

  ngOnInit() {
    this.store.dispatch(OrdersActions.loadMySales());
  }

  stateClass(state: string): string {
    if (state === 'PaymentSettled') return 'bg-yellow-100 text-yellow-700';
    if (state === 'Shipped' || state === 'Delivered') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-600';
  }

  startShipping(orderId: string) {
    this.carrier = '';
    this.trackingCode = '';
    this.shipError.set('');
    this.shippingOrderId.set(orderId);
  }

  submitShipment(orderId: string) {
    if (!this.carrier) {
      this.shipError.set('Please enter a carrier name.');
      return;
    }
    this.shipping.set(true);
    this.shipError.set('');

    this.store.dispatch(OrdersActions.shipOrder({
      orderId,
      carrier: this.carrier,
      trackingCode: this.trackingCode || null,
    }));

    // Listen for the result via the store — mySales updates on shipOrderSuccess
    // For simplicity, reset shipping state after dispatch (effect handles the rest)
    // A more robust approach would use a selectSignal effect to react to success/failure
    setTimeout(() => {
      this.shipping.set(false);
      this.shippingOrderId.set('');
    }, 1500);
  }
}
