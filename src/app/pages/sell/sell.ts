import { Component, ChangeDetectionStrategy, inject, OnInit, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth.service';
import { ListingsActions } from '../../store/listings/listings.actions';
import { selectSubmitting, selectCreateSuccess, selectError } from '../../store/listings/listings.selectors';
import type { CreateListingInput } from '../../../gql/graphql';

@Component({
  selector: 'app-sell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Create a Listing</h1>

      @if (!auth.isLoggedIn()) {
        <div class="border rounded-lg p-6 text-center">
          <p class="text-gray-600 mb-4">Sign in to list your car for sale.</p>
          <a routerLink="/account" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Sign In</a>
        </div>
      } @else {
        @if (success()) {
          <div class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p class="text-green-800 font-semibold text-lg">Listing created!</p>
            <p class="text-green-600 text-sm mt-1">Your car is now live on the marketplace.</p>
            <div class="flex gap-3 justify-center mt-4">
              <a routerLink="/listings" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">Browse Listings</a>
              <button (click)="reset()" class="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">List Another</button>
            </div>
          </div>
        } @else {
          @if (fromGarageCar()) {
            <div class="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-5">
              <span class="text-blue-500 text-lg leading-none">🏎</span>
              <div>
                <p class="text-sm font-medium text-blue-800">Pre-filled from your garage: {{ fromGarageCar() }}</p>
                <p class="text-xs text-blue-600 mt-0.5">Add a price, condition, and PayPal email to publish.</p>
              </div>
            </div>
          }
          <form (ngSubmit)="submit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input [(ngModel)]="listing.name" name="name" required
                class="w-full border rounded-md px-3 py-2"
                placeholder="e.g. TLR 22 5.0 — Carpet setup, barely used">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <input [(ngModel)]="listing.brand" name="brand" class="w-full border rounded-md px-3 py-2" placeholder="TLR, Associated, Kyosho...">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input [(ngModel)]="listing.model" name="model" class="w-full border rounded-md px-3 py-2" placeholder="22 5.0, B74.2...">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">RC Class *</label>
                <select [(ngModel)]="listing.rcClass" name="rcClass" class="w-full border rounded-md px-3 py-2">
                  <option value="">Select...</option>
                  <option value="1/10">1/10 Scale</option>
                  <option value="1/8">1/8 Scale</option>
                  <option value="1/5">1/5 Scale</option>
                  <option value="mini">Mini / Micro</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Drive Type</label>
                <select [(ngModel)]="listing.driveType" name="driveType" class="w-full border rounded-md px-3 py-2">
                  <option value="">Select...</option>
                  <option value="2wd">2WD</option>
                  <option value="4wd">4WD</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
                <select [(ngModel)]="listing.condition" name="condition" required class="w-full border rounded-md px-3 py-2">
                  <option value="">Select...</option>
                  <option value="new">New</option>
                  <option value="used_like_new">Used — Like New</option>
                  <option value="used_good">Used — Good</option>
                  <option value="used_fair">Used — Fair</option>
                  <option value="parts">Parts / Project</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Surface Type</label>
                <select [(ngModel)]="listing.surfaceType" name="surfaceType" class="w-full border rounded-md px-3 py-2">
                  <option value="">Select...</option>
                  <option value="carpet">Carpet</option>
                  <option value="dirt">Dirt / Off-Road</option>
                  <option value="asphalt">Asphalt</option>
                  <option value="universal">Universal</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input [(ngModel)]="listing.priceDisplay" name="price" type="number" min="1" required
                  class="w-full border rounded-md pl-7 pr-3 py-2" placeholder="0.00">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Your PayPal Email *</label>
              <input [(ngModel)]="listing.paypalEmail" name="paypalEmail" type="email" required
                class="w-full border rounded-md px-3 py-2">
              <p class="text-xs text-gray-500 mt-1">Buyers pay you directly to this PayPal address.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea [(ngModel)]="listing.description" name="description" rows="4"
                class="w-full border rounded-md px-3 py-2"
                placeholder="Describe condition, included items, build history..."></textarea>
            </div>

            @if (formError()) { <p class="text-red-600 text-sm">{{ formError() }}</p> }
            @if (error()) { <p class="text-red-600 text-sm">{{ error() }}</p> }

            <button type="submit" [disabled]="submitting()"
              class="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
              {{ submitting() ? 'Creating listing...' : 'Publish Listing' }}
            </button>
          </form>
        }
      }
    </div>
  `,
})
export class SellComponent implements OnInit {
  auth = inject(AuthService);
  private store = inject(Store);

  submitting = this.store.selectSignal(selectSubmitting);
  error = this.store.selectSignal(selectError);
  success = this.store.selectSignal(selectCreateSuccess);

  listing: any = {};
  formError = signal('');
  fromGarageCar = signal<string | null>(null);

  ngOnInit() {
    this.store.dispatch(ListingsActions.resetCreate());
    const state = history.state?.fromGarage;
    if (state) {
      this.listing = {
        name: state.name ?? '',
        brand: state.brand ?? '',
        model: state.model ?? '',
        rcClass: state.rcClass ?? '',
        driveType: state.driveType ?? '',
        description: state.notes ?? '',
      };
      this.fromGarageCar.set(state.name);
    }
  }

  submit() {
    if (!this.listing.name || !this.listing.condition || !this.listing.priceDisplay || !this.listing.paypalEmail) {
      this.formError.set('Please fill in all required fields.');
      return;
    }
    this.formError.set('');
    const input: CreateListingInput = {
      name: this.listing.name,
      condition: this.listing.condition,
      price: Math.round(Number(this.listing.priceDisplay) * 100),
      paypalEmail: this.listing.paypalEmail,
      description: this.listing.description || null,
      brand: this.listing.brand || null,
      model: this.listing.model || null,
      rcClass: this.listing.rcClass || null,
      driveType: this.listing.driveType || null,
      surfaceType: this.listing.surfaceType || null,
    };
    this.store.dispatch(ListingsActions.createListing({ input }));
  }

  reset() {
    this.listing = {};
    this.formError.set('');
    this.store.dispatch(ListingsActions.resetCreate());
  }
}
