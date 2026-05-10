import { Component, ChangeDetectionStrategy, input, signal, computed, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, map, filter } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { GET_PRODUCT } from '../../graphql/queries';
import { ADD_TO_ORDER } from '../../graphql/mutations';
import { assetUrl } from '../../utils/asset-url';

@Component({
  selector: 'app-listing-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      @if (product(); as p) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

          <!-- Image gallery -->
          <div>
            @if (activeImage()) {
              <img [src]="assetUrl(activeImage()) + '?w=700'"
                   [alt]="p.name"
                   class="w-full rounded-lg object-cover aspect-square">
            } @else {
              <div class="w-full rounded-lg bg-gray-100 flex items-center justify-center aspect-square text-gray-400">
                No image
              </div>
            }
            @if (allAssets().length > 1) {
              <div class="flex gap-2 mt-3 overflow-x-auto pb-1">
                @for (asset of allAssets(); track asset.preview) {
                  <button (click)="activeImage.set(asset.preview)"
                    class="flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-colors"
                    [class]="activeImage() === asset.preview ? 'border-red-600' : 'border-transparent hover:border-gray-300'">
                    <img [src]="assetUrl(asset.preview) + '?w=100'" class="w-full h-full object-cover">
                  </button>
                }
              </div>
            }
          </div>

          <!-- Info -->
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
            @if (p.description) {
              <p class="text-gray-600 mt-4 text-sm leading-relaxed">{{ p.description }}</p>
            }
            @if (buyError()) {
              <p class="mt-4 text-red-600 text-sm">{{ buyError() }}</p>
            }
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
  private router = inject(Router);

  product = toSignal(
    toObservable(this.id).pipe(
      filter(slug => !!slug),
      switchMap(slug => this.apollo.watchQuery({ query: GET_PRODUCT, variables: { slug } }).valueChanges),
      map((r: any) => r.data?.product ?? null),
    ),
    { initialValue: null as any },
  );

  // All assets deduplicated — featuredAsset first, then remaining assets
  allAssets = computed(() => {
    const p = this.product();
    if (!p) return [];
    const seen = new Set<string>();
    const result: Array<{ preview: string }> = [];
    if (p.featuredAsset?.preview) {
      seen.add(p.featuredAsset.preview);
      result.push(p.featuredAsset);
    }
    for (const a of p.assets ?? []) {
      if (!seen.has(a.preview)) {
        seen.add(a.preview);
        result.push(a);
      }
    }
    return result;
  });

  activeImage = signal<string | null>(null);

  constructor() {
    // Reset active image when product changes, defaulting to featuredAsset
    toObservable(this.allAssets).subscribe(assets => {
      this.activeImage.set(assets[0]?.preview ?? null);
    });
  }

  readonly assetUrl = assetUrl;
  buyError = signal('');

  addToCart(variantId: string) {
    this.buyError.set('');
    this.apollo.mutate({
      mutation: ADD_TO_ORDER,
      variables: { variantId, quantity: 1 },
    }).subscribe({
      next: (result: any) => {
        const data = result?.data?.addItemToOrder;
        if (data?.errorCode) {
          this.buyError.set(data.message ?? 'Could not add item to order.');
          return;
        }
        this.router.navigate(['/checkout']);
      },
      error: (e) => this.buyError.set(e.message ?? 'An error occurred.'),
    });
  }
}
