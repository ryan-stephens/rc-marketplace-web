import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-checkout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="max-w-2xl mx-auto px-4 py-8"><h1 class="text-2xl font-bold mb-4">Checkout</h1><p class="text-gray-400">PayPal checkout flow coming soon.</p></div>`,
})
export class CheckoutComponent {}
