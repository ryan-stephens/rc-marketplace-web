import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="max-w-4xl mx-auto px-4 py-8"><p class="text-gray-400">Profile for user {{ userId() }} — coming soon.</p></div>`,
})
export class ProfileComponent {
  userId = input<string>('');
}
