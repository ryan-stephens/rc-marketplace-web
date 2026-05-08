import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <a routerLink="/" class="text-xl font-bold text-red-600">RC Marketplace</a>
      <div class="flex items-center gap-4 text-sm">
        <a routerLink="/listings" routerLinkActive="text-red-600 font-medium" class="text-gray-600 hover:text-gray-900">Browse</a>
        @if (auth.isLoggedIn()) {
          <a routerLink="/sell" class="text-gray-600 hover:text-gray-900">Sell</a>
          <a routerLink="/garage" class="text-gray-600 hover:text-gray-900">My Garage</a>
          <a routerLink="/orders" class="text-gray-600 hover:text-gray-900">Orders</a>
          <a routerLink="/account" class="text-gray-600 hover:text-gray-900">{{ auth.customer()?.firstName }}</a>
          <button (click)="auth.logout().subscribe()" class="text-gray-500 hover:text-gray-700">Sign out</button>
        } @else {
          <a routerLink="/account" class="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700">Sign in</a>
        }
      </div>
    </nav>
  `,
})
export class NavComponent {
  auth = inject(AuthService);
}
