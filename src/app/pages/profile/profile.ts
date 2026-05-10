import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap, map, filter } from 'rxjs/operators';
import { GET_PUBLIC_GARAGE, GET_PUBLIC_LISTINGS } from '../../graphql/queries';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-8">User Profile</h1>

      <section class="mb-10">
        <h2 class="text-xl font-semibold mb-4">Garage</h2>
        @if (garage().length === 0) {
          <p class="text-gray-400">No cars in garage.</p>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (car of garage(); track car.id) {
              <div class="border rounded-lg p-4">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-semibold">{{ car.name }}</p>
                  @if (listingMap()[car.listingProductId]; as listing) {
                    <a [routerLink]="['/listings', listing.slug]"
                       class="flex-shrink-0 text-xs bg-red-600 text-white px-2 py-0.5 rounded hover:bg-red-700">
                      For Sale
                    </a>
                  }
                </div>
                <p class="text-sm text-gray-500">{{ car.brand }} {{ car.model }}</p>
                <div class="flex gap-2 mt-2 text-xs">
                  @if (car.rcClass) { <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{{ car.rcClass }}</span> }
                  @if (car.driveType) { <span class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ car.driveType }}</span> }
                </div>
                @if (car.setupSheets?.length) {
                  <p class="text-xs text-gray-400 mt-2">{{ car.setupSheets.length }} setup sheet{{ car.setupSheets.length !== 1 ? 's' : '' }}</p>
                }
              </div>
            }
          </div>
        }
      </section>

      <section>
        <h2 class="text-xl font-semibold mb-4">Listings for Sale</h2>
        @if (listings().length === 0) {
          <p class="text-gray-400">No active listings.</p>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (listing of listings(); track listing.id) {
              <a [routerLink]="['/listings', listing.slug]" class="border rounded-lg p-4 hover:shadow-md transition-shadow block">
                <p class="font-semibold truncate">{{ listing.name }}</p>
                <p class="text-red-600 font-bold mt-1">{{ listing.variants[0]?.price / 100 | currency }}</p>
                <div class="flex gap-1 mt-2 text-xs">
                  @if (listing.customFields?.rcClass) { <span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{{ listing.customFields.rcClass }}</span> }
                  @if (listing.customFields?.condition) { <span class="bg-green-100 text-green-700 px-2 py-0.5 rounded">{{ listing.customFields.condition }}</span> }
                </div>
              </a>
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class ProfileComponent {
  userId = input<string>('');

  private apollo = inject(Apollo);

  garage = toSignal(
    toObservable(this.userId).pipe(
      filter(id => !!id),
      switchMap(id => this.apollo.watchQuery({ query: GET_PUBLIC_GARAGE, variables: { customerId: id } }).valueChanges),
      map((r: any) => r.data?.publicGarage ?? []),
    ),
    { initialValue: [] },
  );

  listings = toSignal(
    toObservable(this.userId).pipe(
      filter(id => !!id),
      switchMap(id => this.apollo.watchQuery({ query: GET_PUBLIC_LISTINGS, variables: { customerId: id } }).valueChanges),
      map((r: any) => r.data?.publicListings ?? []),
    ),
    { initialValue: [] },
  );

  // productId → listing (for cross-referencing garage cars with their listings)
  listingMap = computed(() => {
    const map: Record<string, any> = {};
    for (const l of this.listings()) {
      map[String(l.id)] = l;
    }
    return map;
  });
}
