import { Component, ChangeDetectionStrategy, signal, HostListener } from '@angular/core';
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

      <div class="flex items-center gap-5 text-sm">
        <a routerLink="/listings" routerLinkActive="text-red-600 font-medium"
           class="text-gray-600 hover:text-gray-900">Browse</a>
        <a routerLink="/garages" routerLinkActive="text-red-600 font-medium"
           class="text-gray-600 hover:text-gray-900">Garages</a>

        @if (auth.isLoggedIn()) {
          <a routerLink="/sell" routerLinkActive="text-red-600 font-medium"
             class="text-gray-600 hover:text-gray-900">Sell</a>

          <!-- User dropdown -->
          <div class="relative" (click)="$event.stopPropagation()">
            <button
              (click)="menuOpen.set(!menuOpen())"
              class="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium">
              {{ auth.customer()?.firstName }}
              <svg class="w-3.5 h-3.5 text-gray-400 transition-transform"
                [class.rotate-180]="menuOpen()"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            @if (menuOpen()) {
              <div class="absolute right-0 top-full mt-1.5 w-44 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                <a routerLink="/garage" (click)="menuOpen.set(false)"
                   class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  My Garage
                </a>
                <a routerLink="/my-listings" (click)="menuOpen.set(false)"
                   class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  My Listings
                </a>
                <a routerLink="/my-sales" (click)="menuOpen.set(false)"
                   class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  My Sales
                </a>
                <a routerLink="/orders" (click)="menuOpen.set(false)"
                   class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Orders
                </a>
                <div class="border-t border-gray-100 my-1"></div>
                <button (click)="logout()"
                   class="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                  Sign out
                </button>
              </div>
            }
          </div>
        } @else {
          <a routerLink="/account" class="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700">
            Sign in
          </a>
        }
      </div>
    </nav>
  `,
})
export class NavComponent {
  auth = inject(AuthService);
  menuOpen = signal(false);

  @HostListener('document:click')
  closeMenu() {
    this.menuOpen.set(false);
  }

  logout() {
    this.menuOpen.set(false);
    this.auth.logout();
  }
}
