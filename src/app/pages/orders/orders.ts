import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-orders',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="max-w-4xl mx-auto px-4 py-8"><h1 class="text-2xl font-bold mb-4">My Orders</h1><p class="text-gray-400">Order history coming soon.</p></div>`,
})
export class OrdersComponent {}
