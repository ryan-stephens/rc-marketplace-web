import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold mb-6">Create a Listing</h1>
      <form class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input [(ngModel)]="listing.name" name="name" class="w-full border rounded-md px-3 py-2" placeholder="e.g. TLR 22 5.0 — Carpet setup, barely used">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input [(ngModel)]="listing.brand" name="brand" class="w-full border rounded-md px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input [(ngModel)]="listing.model" name="model" class="w-full border rounded-md px-3 py-2">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">RC Class</label>
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
            <select [(ngModel)]="listing.condition" name="condition" class="w-full border rounded-md px-3 py-2">
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
          <input [(ngModel)]="listing.price" name="price" type="number" class="w-full border rounded-md px-3 py-2" placeholder="0.00">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Your PayPal Email *</label>
          <input [(ngModel)]="listing.paypalEmail" name="paypalEmail" type="email" class="w-full border rounded-md px-3 py-2">
          <p class="text-xs text-gray-500 mt-1">Buyers will pay you directly to this email via PayPal.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea [(ngModel)]="listing.description" name="description" rows="4" class="w-full border rounded-md px-3 py-2" placeholder="Describe the condition, included items, history..."></textarea>
        </div>
        <button type="submit" class="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700">
          Submit Listing
        </button>
      </form>
    </div>
  `,
})
export class SellComponent {
  listing: any = {};
}
