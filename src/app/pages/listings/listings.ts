import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { GET_PRODUCTS } from '../../graphql/queries';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-listings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">Browse Listings</h1>
        <a routerLink="/sell" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">+ List a Car</a>
      </div>

      <div class="flex gap-3 mb-6 flex-wrap">
        <select [(ngModel)]="filterClass" (ngModelChange)="applyFilters()" class="border rounded-md px-3 py-1.5 text-sm">
          <option value="">All Classes</option>
          <option value="1/10">1/10 Scale</option>
          <option value="1/8">1/8 Scale</option>
          <option value="1/5">1/5 Scale</option>
          <option value="mini">Mini / Micro</option>
        </select>
        <select [(ngModel)]="filterDrive" (ngModelChange)="applyFilters()" class="border rounded-md px-3 py-1.5 text-sm">
          <option value="">All Drive Types</option>
          <option value="2wd">2WD</option>
          <option value="4wd">4WD</option>
        </select>
        <select [(ngModel)]="filterCondition" (ngModelChange)="applyFilters()" class="border rounded-md px-3 py-1.5 text-sm">
          <option value="">All Conditions</option>
          <option value="new">New</option>
          <option value="used_like_new">Used — Like New</option>
          <option value="used_good">Used — Good</option>
          <option value="used_fair">Used — Fair</option>
          <option value="parts">Parts / Project</option>
        </select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (product of products(); track product.id) {
          <a [routerLink]="['/listings', product.slug]" class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            @if (product.featuredAsset) {
              <img [src]="product.featuredAsset.preview + '?w=500'" [alt]="product.name" class="w-full h-52 object-cover">
            } @else {
              <div class="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
            }
            <div class="p-4">
              <p class="font-semibold truncate">{{ product.name }}</p>
              <p class="text-red-600 font-bold text-lg mt-1">{{ product.variants[0]?.price / 100 | currency }}</p>
              <div class="flex gap-1 mt-2 flex-wrap">
                @if (product.customFields?.brand) {
                  <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ product.customFields.brand }}</span>
                }
                @if (product.customFields?.rcClass) {
                  <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{{ product.customFields.rcClass }}</span>
                }
                @if (product.customFields?.condition) {
                  <span class="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{{ product.customFields.condition }}</span>
                }
              </div>
            </div>
          </a>
        } @empty {
          <p class="col-span-3 text-center text-gray-500 py-12">No listings found.</p>
        }
      </div>
    </div>
  `,
})
export class ListingsComponent {
  filterClass = '';
  filterDrive = '';
  filterCondition = '';

  private apollo = inject(Apollo);

  products = toSignal(
    this.apollo.watchQuery({
      query: GET_PRODUCTS,
      variables: { options: { take: 50, sort: { createdAt: 'DESC' } } },
    }).valueChanges.pipe(map((r: any) => r.data.products.items)),
    { initialValue: [] },
  );

  applyFilters() {
    // TODO: pass filter variables into the query
  }
}
