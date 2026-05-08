import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="max-w-md mx-auto px-4 py-12">
      @if (!auth.isLoggedIn()) {
        <div class="border rounded-lg p-8">
          <h1 class="text-2xl font-bold mb-6 text-center">Sign In</h1>
          @if (mode() === 'login') {
            <form (ngSubmit)="login()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input [(ngModel)]="email" name="email" type="email" class="w-full border rounded-md px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input [(ngModel)]="password" name="password" type="password" class="w-full border rounded-md px-3 py-2">
              </div>
              @if (error()) { <p class="text-red-600 text-sm">{{ error() }}</p> }
              <button type="submit" class="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700">Sign In</button>
              <p class="text-center text-sm text-gray-500">
                Don't have an account? <button type="button" (click)="mode.set('register')" class="text-red-600 hover:underline">Register</button>
              </p>
            </form>
          } @else {
            <p class="text-center text-sm text-gray-500 mb-4">
              Already have an account? <button (click)="mode.set('login')" class="text-red-600 hover:underline">Sign in</button>
            </p>
            <p class="text-center text-gray-400 text-sm">Registration form coming soon.</p>
          }
        </div>
      } @else {
        <div class="border rounded-lg p-8">
          <h1 class="text-2xl font-bold mb-2">Account</h1>
          <p class="text-gray-500">{{ auth.customer()?.emailAddress }}</p>
          <button (click)="auth.logout().subscribe()" class="mt-6 w-full border text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">Sign Out</button>
        </div>
      }
    </div>
  `,
})
export class AccountComponent {
  auth = inject(AuthService);
  mode = signal<'login' | 'register'>('login');
  email = '';
  password = '';
  error = signal('');

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (result: any) => {
        if (result.__typename !== 'CurrentUser') {
          this.error.set(result.message ?? 'Login failed');
        }
      },
      error: () => this.error.set('An error occurred'),
    });
  }
}
