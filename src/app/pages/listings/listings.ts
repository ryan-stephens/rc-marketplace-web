import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ListingsActions } from '../../store/listings/listings.actions';
import {
  selectSearchResults,
  selectSearchTotalItems,
  selectSearchLoading,
  selectLabelMap,
  selectCodeMap,
} from '../../store/listings/listings.selectors';
import { assetUrl } from '../../utils/asset-url';

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
          <option value="1-10">1/10 Scale</option>
          <option value="1-8">1/8 Scale</option>
          <option value="1-5">1/5 Scale</option>
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
          <option value="used-like-new">Used — Like New</option>
          <option value="used-good">Used — Good</option>
          <option value="used-fair">Used — Fair</option>
          <option value="parts">Parts / Project</option>
        </select>
        @if (totalItems() > 0) {
          <span class="text-sm text-gray-500 self-center ml-auto">
            {{ totalItems() }} listing{{ totalItems() !== 1 ? 's' : '' }}
          </span>
        }
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (item of results(); track item.productId) {
          <a [routerLink]="['/listings', item.slug]" class="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            @if (item.productAsset) {
              <img [src]="assetUrl(item.productAsset.preview) + '?w=500'" [alt]="item.productName" class="w-full h-52 object-cover">
            } @else {
              <div class="w-full h-52 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
            }
            <div class="p-4">
              <p class="font-semibold truncate">{{ item.productName }}</p>
              <p class="text-red-600 font-bold text-lg mt-1">
                {{ itemPrice(item) / 100 | currency: item.currencyCode }}
              </p>
              <div class="flex gap-1 mt-2 flex-wrap">
                @for (fvId of item.facetValueIds; track fvId) {
                  @if (labelMap()[fvId]; as lbl) {
                    @if (lbl.facetCode === 'rc-class' || lbl.facetCode === 'condition') {
                      <span class="text-xs px-2 py-0.5 rounded"
                        [class]="lbl.facetCode === 'rc-class' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'">
                        {{ lbl.label }}
                      </span>
                    }
                  }
                }
              </div>
            </div>
          </a>
        } @empty {
          @if (!loading()) {
            <p class="col-span-3 text-center text-gray-500 py-12">No listings found.</p>
          }
        }
      </div>
    </div>
  `,
})
export class ListingsComponent implements OnInit {
  readonly assetUrl = assetUrl;

  private store = inject(Store);

  results = this.store.selectSignal(selectSearchResults);
  totalItems = this.store.selectSignal(selectSearchTotalItems);
  loading = this.store.selectSignal(selectSearchLoading);
  labelMap = this.store.selectSignal(selectLabelMap);
  private codeMap = this.store.selectSignal(selectCodeMap);

  // UI-only filter state
  filterClass = '';
  filterDrive = '';
  filterCondition = '';

  ngOnInit() {
    this.store.dispatch(ListingsActions.loadFacets());
    this.store.dispatch(ListingsActions.search({
      filters: { classCode: '', driveCode: '', conditionCode: '' },
    }));
  }

  applyFilters() {
    this.store.dispatch(ListingsActions.search({
      filters: {
        classCode: this.filterClass,
        driveCode: this.filterDrive,
        conditionCode: this.filterCondition,
      },
    }));
  }

  itemPrice(item: any): number {
    return item.priceWithTax?.value ?? item.priceWithTax?.min ?? 0;
  }
}
