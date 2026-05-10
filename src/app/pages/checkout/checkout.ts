import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CheckoutActions } from '../../store/checkout/checkout.actions';
import {
  selectActiveOrder,
  selectOrderLoaded,
  selectShippingMethods,
  selectSelectedShippingMethodId,
  selectLoading,
  selectError,
} from '../../store/checkout/checkout.selectors';

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Checkout</h1>

      @if (!orderLoaded()) {
        <p class="text-gray-400 text-center py-16">Loading order...</p>
      } @else if (order()) {
        <div class="border rounded-lg p-4 mb-6">
          <h2 class="font-semibold mb-3">Order Summary</h2>
          @for (line of order().lines; track line.id) {
            <div class="flex justify-between text-sm py-2 border-b last:border-0">
              <span>{{ line.productVariant.product.name }}</span>
              <span>{{ line.unitPriceWithTax / 100 | currency: order().currencyCode }}</span>
            </div>
          }
          <div class="flex justify-between font-bold mt-3">
            <span>Total</span>
            <span class="text-red-600">{{ order().totalWithTax / 100 | currency: order().currencyCode }}</span>
          </div>
        </div>

        <div class="border rounded-lg p-4 mb-6">
          <h2 class="font-semibold mb-4">Shipping Address</h2>
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Full Name</label>
              <input [(ngModel)]="fullName" class="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            </div>
            <div class="col-span-2">
              <label class="text-sm font-medium text-gray-700">Street Address</label>
              <input [(ngModel)]="streetLine1" class="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">City</label>
              <input [(ngModel)]="city" class="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">State / Province</label>
              <input [(ngModel)]="province" class="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">ZIP / Postal Code</label>
              <input [(ngModel)]="postalCode" class="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Country Code</label>
              <input [(ngModel)]="countryCode" placeholder="US" class="mt-1 w-full border rounded-md px-3 py-2 text-sm">
            </div>
          </div>
        </div>

        @if (shippingMethods().length > 0) {
          <div class="border rounded-lg p-4 mb-6">
            <h2 class="font-semibold mb-3">Shipping Method</h2>
            @for (method of shippingMethods(); track method.id) {
              <label class="flex items-center gap-3 py-2 cursor-pointer">
                <input type="radio" name="shipping" [value]="method.id"
                  [checked]="selectedShippingMethodId() === method.id"
                  (change)="selectShipping(method.id)">
                <span class="text-sm">{{ method.name }}</span>
                <span class="text-sm text-gray-500 ml-auto">
                  {{ method.priceWithTax === 0 ? 'Free' : (method.priceWithTax / 100 | currency) }}
                </span>
              </label>
            }
          </div>
        }

        @if (error()) {
          <p class="text-red-600 text-sm mb-4">{{ error() }}</p>
        }
        @if (formError()) {
          <p class="text-red-600 text-sm mb-4">{{ formError() }}</p>
        }

        <button
          (click)="placeOrder()"
          [disabled]="loading()"
          class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50">
          {{ loading() ? 'Placing order...' : 'Place Order' }}
        </button>
      } @else {
        <p class="text-gray-400 text-center py-16">
          No active order. <a routerLink="/listings" class="text-red-600 hover:underline">Browse listings</a>.
        </p>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  private store = inject(Store);

  // Store selectors → signals
  order = this.store.selectSignal(selectActiveOrder);
  orderLoaded = this.store.selectSignal(selectOrderLoaded);
  shippingMethods = this.store.selectSignal(selectShippingMethods);
  selectedShippingMethodId = this.store.selectSignal(selectSelectedShippingMethodId);
  loading = this.store.selectSignal(selectLoading);
  error = this.store.selectSignal(selectError);

  // Local UI-only state (form fields)
  fullName = '';
  streetLine1 = '';
  city = '';
  province = '';
  postalCode = '';
  countryCode = 'US';
  formError = signal('');

  ngOnInit() {
    this.store.dispatch(CheckoutActions.loadCheckout());
  }

  selectShipping(methodId: string) {
    this.store.dispatch(CheckoutActions.selectShippingMethod({ methodId }));
  }

  placeOrder() {
    if (!this.fullName || !this.streetLine1 || !this.city || !this.postalCode) {
      this.formError.set('Please fill in all required address fields.');
      return;
    }
    if (!this.selectedShippingMethodId()) {
      this.formError.set('Please select a shipping method.');
      return;
    }
    this.formError.set('');
    this.store.dispatch(CheckoutActions.placeOrder({
      address: {
        fullName: this.fullName,
        streetLine1: this.streetLine1,
        city: this.city,
        province: this.province,
        postalCode: this.postalCode,
        countryCode: this.countryCode,
      },
      shippingMethodId: this.selectedShippingMethodId()!,
    }));
  }
}
