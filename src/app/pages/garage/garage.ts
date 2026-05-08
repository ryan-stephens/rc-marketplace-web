import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { GET_MY_GARAGE } from '../../graphql/queries';
import { ADD_GARAGE_CAR, REMOVE_GARAGE_CAR } from '../../graphql/mutations';
import { FormsModule } from '@angular/forms';

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
            <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700">Save</button>
            <button type="button" (click)="showAddForm.set(false)" class="border px-4 py-2 rounded-md text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      }

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        @for (car of cars(); track car.id) {
          <div class="border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div class="flex items-start justify-between">
              <a [routerLink]="['/garage', car.id]" class="font-semibold hover:text-red-600">{{ car.name }}</a>
              <button (click)="removeCar(car.id)" class="text-gray-400 hover:text-red-500 text-xs">Remove</button>
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
        } @empty {
          <div class="col-span-2 text-center py-16 text-gray-400">
            <p class="text-lg">Your garage is empty.</p>
            <p class="text-sm mt-1">Add cars you own to track setups and share with the community.</p>
          </div>
        }
      </div>
    </div>
  `,
})
export class GarageComponent {
  showAddForm = signal(false);
  newCar: any = {};

  private apollo = inject(Apollo);

  cars = toSignal(
    this.apollo.watchQuery({ query: GET_MY_GARAGE }).valueChanges.pipe(map((r: any) => r.data.myGarage)),
    { initialValue: [] },
  );

  addCar() {
    if (!this.newCar.name) return;
    this.apollo.mutate({
      mutation: ADD_GARAGE_CAR,
      variables: { input: this.newCar },
      refetchQueries: [{ query: GET_MY_GARAGE }],
    }).subscribe(() => {
      this.newCar = {};
      this.showAddForm.set(false);
    });
  }

  removeCar(id: string) {
    this.apollo.mutate({
      mutation: REMOVE_GARAGE_CAR,
      variables: { id },
      refetchQueries: [{ query: GET_MY_GARAGE }],
    }).subscribe();
  }
}
