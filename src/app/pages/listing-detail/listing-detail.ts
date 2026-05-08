import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { GET_PRODUCT } from '../../graphql/queries';
import { ADD_TO_ORDER } from '../../graphql/mutations';

@Component({
  selector: 'app-listing-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      @if (product(); as p) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            @if (p.featuredAsset) {
              <img [src]="p.featuredAsset.preview + '?w=600'" [alt]="p.name" class="w-full rounded-lg object-cover">
            }
          </div>
          <div>
            <h1 class="text-2xl font-bold">{{ p.name }}</h1>
            <p class="text-3xl font-bold text-red-600 mt-2">{{ p.variants[0]?.price / 100 | currency }}</p>
            <div class="flex gap-2 mt-3 flex-wrap">
              @if (p.customFields?.brand) { <span class="text-sm bg-gray-100 px-2 py-1 rounded">{{ p.customFields.brand }}</span> }
              @if (p.customFields?.rcClass) { <span class="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{{ p.customFields.rcClass }}</span> }
              @if (p.customFields?.driveType) { <span class="text-sm bg-gray-100 px-2 py-1 rounded">{{ p.customFields.driveType }}</span> }
              @if (p.customFields?.condition) { <span class="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">{{ p.customFields.condition }}</span> }
              @if (p.customFields?.surfaceType) { <span class="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">{{ p.customFields.surfaceType }}</span> }
            </div>
            <p class="text-gray-600 mt-4 text-sm leading-relaxed">{{ p.description }}</p>
            <button (click)="addToCart(p.variants[0]?.id)"
              class="mt-6 w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">
              Buy with PayPal
            </button>
          </div>
        </div>
      } @else {
        <p class="text-center text-gray-400 py-16">Loading...</p>
      }
    </div>
  `,
})
export class ListingDetailComponent {
  id = input<string>('');

  private apollo = inject(Apollo);

  product = toSignal(
    toObservable(this.id).pipe(
      switchMap(slug => this.apollo.watchQuery({ query: GET_PRODUCT, variables: { slug } }).valueChanges),
      map((r: any) => r.data.product),
    ),
    { initialValue: null },
  );

  addToCart(variantId: string) {
    this.apollo.mutate({
      mutation: ADD_TO_ORDER,
      variables: { variantId, quantity: 1 },
    }).subscribe();
  }
}
