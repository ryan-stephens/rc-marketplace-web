import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { ListingsActions } from '../../store/listings/listings.actions';
import { selectMyListings, selectMyListingsLoading } from '../../store/listings/listings.selectors';

@Component({
  selector: 'app-my-listings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">My Listings</h1>
        <a routerLink="/sell" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">+ New Listing</a>
      </div>

      @if (loading()) {
        <p class="text-center text-gray-400 py-16">Loading...</p>
      } @else if (listings().length === 0) {
        <div class="text-center py-16 text-gray-500">
          <p class="text-lg">No listings yet.</p>
          <a routerLink="/sell" class="mt-4 inline-block text-red-600 hover:underline">Create your first listing →</a>
        </div>
      } @else {
        <div class="divide-y border rounded-lg">
          @for (listing of listings(); track listing.id) {
            <div class="flex items-center justify-between p-4">
              <div>
                <p class="font-semibold">{{ listing.name }}</p>
                <div class="flex gap-2 mt-1 text-xs text-gray-500">
                  @if (listing.customFields?.brand) { <span>{{ listing.customFields.brand }}</span> }
                  @if (listing.customFields?.rcClass) { <span>{{ listing.customFields.rcClass }}</span> }
                  @if (listing.customFields?.condition) { <span>{{ listing.customFields.condition }}</span> }
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-bold text-red-600">{{ (listing.variants[0]?.price ?? 0) / 100 | currency }}</span>
                <a [routerLink]="['/listings', listing.slug]" class="text-sm text-blue-600 hover:underline">View</a>
                <button (click)="deleteListing(listing.id)" class="text-sm text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class MyListingsComponent implements OnInit {
  private store = inject(Store);

  listings = this.store.selectSignal(selectMyListings);
  loading = this.store.selectSignal(selectMyListingsLoading);

  ngOnInit() {
    this.store.dispatch(ListingsActions.loadMyListings());
  }

  deleteListing(id: string) {
    if (!confirm('Delete this listing?')) return;
    this.store.dispatch(ListingsActions.deleteListing({ id }));
  }
}
