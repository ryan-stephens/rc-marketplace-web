import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { GarageActions } from '../../store/garage/garage.actions';
import { selectAllCars, selectLoading, selectSubmitting } from '../../store/garage/garage.selectors';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-garage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">My Garage</h1>
        <button (click)="showAddForm.set(!showAddForm())" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
          + Add Car
        </button>
      </div>

      @if (showAddForm()) {
        <form (ngSubmit)="addCar()" class="border rounded-lg p-6 mb-6 bg-gray-50">
          <h2 class="font-semibold mb-4">Add a Car to Your Garage</h2>
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input [(ngModel)]="newCar.name" name="name" required class="w-full border rounded-md px-3 py-2 text-sm" placeholder="e.g. My TLR 22 5.0">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input [(ngModel)]="newCar.brand" name="brand" class="w-full border rounded-md px-3 py-2 text-sm" placeholder="TLR, Associated, Kyosho...">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
              <input [(ngModel)]="newCar.model" name="model" class="w-full border rounded-md px-3 py-2 text-sm" placeholder="22 5.0, B74.2...">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">RC Class</label>
              <select [(ngModel)]="newCar.rcClass" name="rcClass" class="w-full border rounded-md px-3 py-2 text-sm">
                <option value="">Select...</option>
                <option value="1/10">1/10 Scale</option>
                <option value="1/8">1/8 Scale</option>
                <option value="1/5">1/5 Scale</option>
                <option value="mini">Mini / Micro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Drive Type</label>
              <select [(ngModel)]="newCar.driveType" name="driveType" class="w-full border rounded-md px-3 py-2 text-sm">
                <option value="">Select...</option>
                <option value="2wd">2WD</option>
                <option value="4wd">4WD</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea [(ngModel)]="newCar.notes" name="notes" rows="2" class="w-full border rounded-md px-3 py-2 text-sm"></textarea>
            </div>
          </div>
          <div class="flex gap-3 mt-4">
            <button type="submit" [disabled]="submitting()" class="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-50">
              {{ submitting() ? 'Saving...' : 'Save' }}
            </button>
            <button type="button" (click)="showAddForm.set(false)" class="border px-4 py-2 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      }

      @if (loading()) {
        <p class="text-gray-400 text-center py-8">Loading garage...</p>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        @for (car of cars(); track car.id) {
          <div class="border rounded-lg overflow-hidden">
            <div class="p-4">
              <div class="flex items-start justify-between">
                <a [routerLink]="['/garage', car.id]" class="font-semibold hover:text-red-600">{{ car.name }}</a>
                <div class="flex items-center gap-2">
                  @if (car.listingProductId) {
                    <span class="text-xs text-green-600 font-medium">Listed ✓</span>
                  } @else {
                    <button (click)="toggleQuickList(car.id)"
                      class="text-xs font-medium"
                      [class]="quickListCarId() === car.id ? 'text-gray-400' : 'text-green-600 hover:text-green-800'">
                      {{ quickListCarId() === car.id ? 'Cancel' : 'List for Sale' }}
                    </button>
                  }
                  <button (click)="removeCar(car.id)" class="text-gray-400 hover:text-red-500 text-xs">Remove</button>
                </div>
              </div>
              @if (car.brand || car.model) {
                <p class="text-sm text-gray-500 mt-0.5">{{ car.brand }} {{ car.model }}</p>
              }
              <div class="flex gap-1 mt-2 flex-wrap">
                @if (car.rcClass) { <span class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{{ car.rcClass }}</span> }
                @if (car.driveType) { <span class="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{{ car.driveType }}</span> }
              </div>
              <p class="text-xs text-gray-400 mt-2">{{ car.setupSheets.length }} setup sheet{{ car.setupSheets.length !== 1 ? 's' : '' }}</p>
            </div>

            @if (quickListCarId() === car.id) {
              <div class="border-t bg-green-50 p-4">
                <p class="text-xs font-semibold text-green-800 mb-3">List "{{ car.name }}" for sale</p>
                <div class="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label class="text-xs font-medium text-gray-600">Price (USD) *</label>
                    <div class="relative mt-1">
                      <span class="absolute left-2 top-1.5 text-gray-400 text-xs">$</span>
                      <input [(ngModel)]="quickList.price" [name]="'price-' + car.id"
                        type="number" min="1" placeholder="0"
                        class="w-full border rounded px-2 pl-5 py-1.5 text-sm">
                    </div>
                  </div>
                  <div>
                    <label class="text-xs font-medium text-gray-600">Condition *</label>
                    <select [(ngModel)]="quickList.condition" [name]="'condition-' + car.id"
                      class="w-full border rounded px-2 py-1.5 text-sm mt-1">
                      <option value="">Select...</option>
                      <option value="new">New</option>
                      <option value="used_like_new">Like New</option>
                      <option value="used_good">Good</option>
                      <option value="used_fair">Fair</option>
                      <option value="parts">Parts</option>
                    </select>
                  </div>
                  <div class="col-span-2">
                    <label class="text-xs font-medium text-gray-600">Your PayPal Email *</label>
                    <input [(ngModel)]="quickList.paypalEmail" [name]="'paypal-' + car.id"
                      type="email" placeholder="you@paypal.com"
                      class="w-full border rounded px-2 py-1.5 text-sm mt-1">
                  </div>
                </div>
                @if (quickListError()) {
                  <p class="text-red-600 text-xs mb-2">{{ quickListError() }}</p>
                }
                <button (click)="publishListing(car)" [disabled]="quickListSubmitting()"
                  class="w-full bg-green-600 text-white py-2 rounded text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {{ quickListSubmitting() ? 'Publishing...' : 'Publish Listing' }}
                </button>
              </div>
            }

            @if (car.listingProductId) {
              <div class="border-t bg-green-50 px-4 py-3 flex items-center justify-between">
                <p class="text-xs text-green-700 font-medium">Listed for sale</p>
                <a routerLink="/listings" class="text-xs text-green-700 underline">View on marketplace →</a>
              </div>
            }
          </div>
        } @empty {
          @if (!loading()) {
            <div class="col-span-2 text-center py-16 text-gray-400">
              <p class="text-lg">Your garage is empty.</p>
              <p class="text-sm mt-1">Add cars you own to track setups and share with the community.</p>
            </div>
          }
        }
      </div>
    </div>
  `,
})
export class GarageComponent implements OnInit {
  private store = inject(Store);
  private auth = inject(AuthService);

  // Store state
  cars = this.store.selectSignal(selectAllCars);
  loading = this.store.selectSignal(selectLoading);
  submitting = this.store.selectSignal(selectSubmitting);

  // UI-only local signals (toggle state, no cross-component concern)
  showAddForm = signal(false);
  newCar: any = {};
  quickListCarId = signal<string | null>(null);
  quickList: any = {};
  quickListSubmitting = signal(false);
  quickListError = signal('');

  ngOnInit() {
    this.store.dispatch(GarageActions.loadGarage());
  }

  toggleQuickList(carId: string) {
    if (this.quickListCarId() === carId) {
      this.quickListCarId.set(null);
    } else {
      this.quickList = {
        paypalEmail: (this.auth.customer() as any)?.customFields?.paypalEmail ?? '',
      };
      this.quickListError.set('');
      this.quickListCarId.set(carId);
    }
  }

  publishListing(car: any) {
    if (!this.quickList.price || !this.quickList.condition || !this.quickList.paypalEmail) {
      this.quickListError.set('Price, condition, and PayPal email are required.');
      return;
    }
    this.quickListSubmitting.set(true);
    this.quickListError.set('');

    this.store.dispatch(GarageActions.publishListing({
      input: {
        carId: car.id,
        name: car.name,
        brand: car.brand,
        model: car.model,
        rcClass: car.rcClass,
        driveType: car.driveType,
        description: car.notes,
        condition: this.quickList.condition,
        price: Math.round(Number(this.quickList.price) * 100),
        paypalEmail: this.quickList.paypalEmail,
      },
    }));

    // Reset UI on next render — store updates drive the actual success state
    setTimeout(() => {
      this.quickListSubmitting.set(false);
      this.quickListCarId.set(null);
    }, 500);
  }

  addCar() {
    if (!this.newCar.name) return;
    this.store.dispatch(GarageActions.addCar({ input: { ...this.newCar } }));
    this.newCar = {};
    this.showAddForm.set(false);
  }

  removeCar(id: string) {
    this.store.dispatch(GarageActions.removeCar({ id }));
  }
}
