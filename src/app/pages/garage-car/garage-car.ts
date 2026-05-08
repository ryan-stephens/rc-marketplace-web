import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { GET_MY_GARAGE } from '../../graphql/queries';
import { ADD_SETUP_SHEET, REMOVE_SETUP_SHEET } from '../../graphql/mutations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-garage-car',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      @if (car(); as c) {
        <h1 class="text-2xl font-bold mb-1">{{ c.name }}</h1>
        @if (c.brand || c.model) { <p class="text-gray-500 mb-6">{{ c.brand }} {{ c.model }}</p> }

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Setup Sheets</h2>
          <button (click)="showAdd.set(!showAdd())" class="bg-red-600 text-white px-3 py-1.5 rounded text-sm hover:bg-red-700">+ Add Sheet</button>
        </div>

        @if (showAdd()) {
          <form (ngSubmit)="addSheet(c.id)" class="border rounded-lg p-5 mb-6 bg-gray-50">
            <div class="grid grid-cols-2 gap-4">
              <div><label class="text-sm font-medium text-gray-700">Track Name</label>
                <input [(ngModel)]="sheet.trackName" name="trackName" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></div>
              <div><label class="text-sm font-medium text-gray-700">Date</label>
                <input [(ngModel)]="sheet.trackDate" name="trackDate" type="date" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></div>
              <div><label class="text-sm font-medium text-gray-700">Motor</label>
                <input [(ngModel)]="sheet.motor" name="motor" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></div>
              <div><label class="text-sm font-medium text-gray-700">ESC</label>
                <input [(ngModel)]="sheet.esc" name="esc" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></div>
              <div><label class="text-sm font-medium text-gray-700">Battery</label>
                <input [(ngModel)]="sheet.battery" name="battery" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></div>
              <div><label class="text-sm font-medium text-gray-700">Servo</label>
                <input [(ngModel)]="sheet.servo" name="servo" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></div>
              <div><label class="text-sm font-medium text-gray-700">Front Tire (Brand / Compound)</label>
                <div class="flex gap-1 mt-1">
                  <input [(ngModel)]="sheet.frontTireBrand" name="frontTireBrand" placeholder="Brand" class="w-full border rounded px-2 py-1.5 text-sm">
                  <input [(ngModel)]="sheet.frontTireCompound" name="frontTireCompound" placeholder="Compound" class="w-full border rounded px-2 py-1.5 text-sm">
                </div>
              </div>
              <div><label class="text-sm font-medium text-gray-700">Rear Tire (Brand / Compound)</label>
                <div class="flex gap-1 mt-1">
                  <input [(ngModel)]="sheet.rearTireBrand" name="rearTireBrand" placeholder="Brand" class="w-full border rounded px-2 py-1.5 text-sm">
                  <input [(ngModel)]="sheet.rearTireCompound" name="rearTireCompound" placeholder="Compound" class="w-full border rounded px-2 py-1.5 text-sm">
                </div>
              </div>
              <div><label class="text-sm font-medium text-gray-700">Pinion / Spur</label>
                <div class="flex gap-1 mt-1">
                  <input [(ngModel)]="sheet.pinion" name="pinion" type="number" placeholder="Pinion" class="w-full border rounded px-2 py-1.5 text-sm">
                  <input [(ngModel)]="sheet.spur" name="spur" type="number" placeholder="Spur" class="w-full border rounded px-2 py-1.5 text-sm">
                </div>
              </div>
              <div class="col-span-2"><label class="text-sm font-medium text-gray-700">Suspension Notes</label>
                <textarea [(ngModel)]="sheet.suspensionNotes" name="suspensionNotes" rows="2" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></textarea></div>
              <div class="col-span-2"><label class="text-sm font-medium text-gray-700">General Notes</label>
                <textarea [(ngModel)]="sheet.generalNotes" name="generalNotes" rows="2" class="w-full border rounded px-2 py-1.5 text-sm mt-1"></textarea></div>
            </div>
            <div class="flex gap-3 mt-4">
              <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">Save</button>
              <button type="button" (click)="showAdd.set(false)" class="border px-4 py-2 rounded text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </form>
        }

        <div class="space-y-4">
          @for (s of c.setupSheets; track s.id) {
            <div class="border rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <div>
                  <p class="font-medium">{{ s.trackName || 'Unnamed Session' }}</p>
                  @if (s.trackDate) { <p class="text-sm text-gray-500">{{ s.trackDate }}</p> }
                </div>
                <button (click)="removeSheet(s.id, c.id)" class="text-gray-400 hover:text-red-500 text-xs">Remove</button>
              </div>
              <div class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-3">
                @if (s.motor) { <div><span class="text-gray-500">Motor:</span> {{ s.motor }}</div> }
                @if (s.esc) { <div><span class="text-gray-500">ESC:</span> {{ s.esc }}</div> }
                @if (s.battery) { <div><span class="text-gray-500">Battery:</span> {{ s.battery }}</div> }
                @if (s.servo) { <div><span class="text-gray-500">Servo:</span> {{ s.servo }}</div> }
                @if (s.frontTireBrand) { <div><span class="text-gray-500">Front:</span> {{ s.frontTireBrand }} {{ s.frontTireCompound }}</div> }
                @if (s.rearTireBrand) { <div><span class="text-gray-500">Rear:</span> {{ s.rearTireBrand }} {{ s.rearTireCompound }}</div> }
                @if (s.pinion) { <div><span class="text-gray-500">Gearing:</span> {{ s.pinion }}T / {{ s.spur }}T</div> }
              </div>
              @if (s.suspensionNotes) {
                <p class="text-sm mt-2"><span class="text-gray-500">Suspension:</span> {{ s.suspensionNotes }}</p>
              }
            </div>
          } @empty {
            <p class="text-gray-400 text-center py-8">No setup sheets yet. Add your first one.</p>
          }
        </div>
      }
    </div>
  `,
})
export class GarageCarComponent {
  carId = input<string>('');
  showAdd = signal(false);
  sheet: any = {};

  private apollo = inject(Apollo);

  private allCars = toSignal(
    this.apollo.watchQuery({ query: GET_MY_GARAGE }).valueChanges.pipe(map((r: any) => r.data.myGarage)),
    { initialValue: [] as any[] },
  );

  car = () => this.allCars().find((c: any) => c.id === this.carId()) ?? null;

  addSheet(carId: string) {
    this.apollo.mutate({
      mutation: ADD_SETUP_SHEET,
      variables: { input: { ...this.sheet, garageCarId: carId } },
      refetchQueries: [{ query: GET_MY_GARAGE }],
    }).subscribe(() => {
      this.sheet = {};
      this.showAdd.set(false);
    });
  }

  removeSheet(id: string, _carId: string) {
    this.apollo.mutate({
      mutation: REMOVE_SETUP_SHEET,
      variables: { id },
      refetchQueries: [{ query: GET_MY_GARAGE }],
    }).subscribe();
  }
}
