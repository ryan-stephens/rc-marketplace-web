import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { GET_ALL_GARAGES } from '../../graphql/queries';

@Component({
  selector: 'app-garages',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="mb-6">
        <h1 class="text-2xl font-bold">Community Garages</h1>
        <p class="text-gray-500 text-sm mt-1">Browse builds and setup sheets from the RC community.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (garage of garages(); track garage.customerId) {
          <a [routerLink]="['/profile', garage.customerId]"
             class="border rounded-xl p-5 hover:shadow-md transition-shadow bg-white block">
            <div class="flex items-center justify-between mb-3">
              <div>
                <p class="font-semibold text-gray-900">{{ garage.customerName }}</p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ garage.carCount }} car{{ garage.carCount !== 1 ? 's' : '' }} ·
                  {{ totalSheets(garage) }} setup sheet{{ totalSheets(garage) !== 1 ? 's' : '' }}
                </p>
              </div>
              <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                {{ garage.customerName.charAt(0).toUpperCase() }}
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              @for (car of garage.previewCars; track car.id) {
                <div class="flex items-center justify-between text-sm">
                  <span class="text-gray-700 truncate">{{ car.name }}</span>
                  <div class="flex gap-1 ml-2 flex-shrink-0">
                    @if (car.rcClass) {
                      <span class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{{ car.rcClass }}</span>
                    }
                    @if (car.driveType) {
                      <span class="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{{ car.driveType }}</span>
                    }
                  </div>
                </div>
              }
              @if (garage.carCount > garage.previewCars.length) {
                <p class="text-xs text-gray-400 mt-1">+{{ garage.carCount - garage.previewCars.length }} more</p>
              }
            </div>
          </a>
        } @empty {
          <p class="col-span-3 text-center text-gray-400 py-16">No community garages yet.</p>
        }
      </div>
    </div>
  `,
})
export class GaragesComponent {
  private apollo = inject(Apollo);

  garages = toSignal(
    this.apollo.watchQuery({ query: GET_ALL_GARAGES }).valueChanges.pipe(
      map((r: any) => r.data?.allGarages ?? []),
    ),
    { initialValue: [] as any[] },
  );

  totalSheets(garage: any): number {
    return garage.previewCars.reduce((sum: number, car: any) => sum + (car.setupSheets?.length ?? 0), 0);
  }
}
