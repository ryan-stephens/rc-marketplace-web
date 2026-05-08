import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { GET_PRODUCTS } from '../../graphql/queries';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <section class="bg-red-600 text-white py-20 px-6 text-center">
      <h1 class="text-4xl font-bold mb-4">The RC Marketplace</h1>
      <p class="text-lg text-red-100 mb-8">Buy, sell, and share your RC builds with the community.</p>
      <div class="flex gap-3 justify-center">
        <a routerLink="/listings" class="bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-50">Browse Listings</a>
        <a routerLink="/sell" class="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700">Sell Your Car</a>
      </div>
    </section>

    <section class="max-w-6xl mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold mb-6">Recent Listings</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (product of products(); track product.id) {
          <a [routerLink]="['/listings', product.slug]" class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            @if (product.featuredAsset) {
              <img [src]="product.featuredAsset.preview + '?w=400'" [alt]="product.name" class="w-full h-48 object-cover">
            } @else {
              <div class="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
            }
            <div class="p-3">
              <p class="font-medium text-sm truncate">{{ product.name }}</p>
              <p class="text-red-600 font-semibold mt-1">{{ product.variants[0]?.price / 100 | currency }}</p>
              <div class="flex gap-1 mt-2 flex-wrap">
                @if (product.customFields?.rcClass) {
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ product.customFields.rcClass }}</span>
                }
                @if (product.customFields?.condition) {
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ product.customFields.condition }}</span>
                }
              </div>
            </div>
          </a>
        }
      </div>
    </section>
  `,
})
export class HomeComponent {
  private apollo = inject(Apollo);

  products = toSignal(
    this.apollo.watchQuery({
      query: GET_PRODUCTS,
      variables: { options: { take: 8, sort: { createdAt: 'DESC' } } },
    }).valueChanges.pipe(map((r: any) => r.data?.products?.items ?? [])),
    { initialValue: [] },
  );
}
