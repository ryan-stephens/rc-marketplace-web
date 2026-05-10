import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCompletedOrder } from '../../store/checkout/checkout.selectors';

@Component({
  selector: 'app-checkout-confirm',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-16 text-center">
      <svg class="mx-auto mb-4 w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <h1 class="text-2xl font-bold mb-2">Order Placed!</h1>
      @if (order()?.code) {
        <p class="text-gray-500 mb-8">Order <span class="font-mono font-medium">{{ order()!.code }}</span></p>
      }

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left mb-8">
        <h2 class="font-semibold text-blue-900 mb-3 text-lg">Complete Your Payment</h2>
        <p class="text-blue-800 text-sm mb-4">
          Your order is reserved. Send payment directly to the seller via PayPal:
        </p>
        <div class="bg-white rounded-lg border border-blue-200 p-4 space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Send to (PayPal)</span>
            <span class="font-semibold text-gray-900 select-all">{{ order()?.sellerPaypalEmail }}</span>
          </div>
          <div class="flex justify-between items-center border-t pt-3">
            <span class="text-sm text-gray-600">Amount</span>
            <span class="font-bold text-lg text-gray-900">
              {{ '$' + order()?.amountDue + ' ' + order()?.currencyCode }}
            </span>
          </div>
        </div>
        <p class="text-blue-700 text-xs mt-4">
          Log in to PayPal → Send & Request → Send money → enter the email above and the amount shown.
        </p>
      </div>

      <div class="flex gap-3 justify-center">
        <a routerLink="/orders" class="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-medium">
          View My Orders
        </a>
        <a routerLink="/listings" class="border px-6 py-2.5 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
          Continue Browsing
        </a>
      </div>
    </div>
  `,
})
export class CheckoutConfirmComponent {
  private store = inject(Store);
  order = this.store.selectSignal(selectCompletedOrder);
}
