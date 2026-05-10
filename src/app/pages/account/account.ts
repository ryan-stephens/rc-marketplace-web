import { Component, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="max-w-md mx-auto px-4 py-12">
      @if (auth.isLoggedIn()) {
        <div class="border rounded-lg p-8">
          <h1 class="text-2xl font-bold mb-1">Account</h1>
          <p class="text-gray-500">{{ auth.customer()?.emailAddress }}</p>
          <p class="text-sm text-gray-400 mt-0.5">{{ auth.customer()?.firstName }} {{ auth.customer()?.lastName }}</p>
          <button (click)="auth.logout()" class="mt-6 w-full border text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">
            Sign Out
          </button>
        </div>
      } @else {
        <div class="border rounded-lg p-8">
          <div class="flex border-b mb-6">
            <button (click)="mode.set('login')"
              class="flex-1 pb-3 text-sm font-medium transition-colors"
              [class]="mode() === 'login' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'">
              Sign In
            </button>
            <button (click)="mode.set('register')"
              class="flex-1 pb-3 text-sm font-medium transition-colors"
              [class]="mode() === 'register' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'">
              Create Account
            </button>
          </div>

          @if (mode() === 'login') {
            <form (ngSubmit)="login()" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input [(ngModel)]="email" name="email" type="email" required
                  class="w-full border rounded-md px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input [(ngModel)]="password" name="password" type="password" required
                  class="w-full border rounded-md px-3 py-2">
              </div>
              @if (auth.error()) { <p class="text-red-600 text-sm">{{ auth.error() }}</p> }
              <button type="submit" [disabled]="auth.loading()"
                class="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
                {{ auth.loading() ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

          } @else {
            <form (ngSubmit)="register()" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input [(ngModel)]="firstName" name="firstName" required
                    class="w-full border rounded-md px-3 py-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input [(ngModel)]="lastName" name="lastName" required
                    class="w-full border rounded-md px-3 py-2">
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input [(ngModel)]="email" name="email" type="email" required
                  class="w-full border rounded-md px-3 py-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input [(ngModel)]="password" name="password" type="password" required minlength="8"
                  class="w-full border rounded-md px-3 py-2">
                <p class="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
              </div>
              @if (auth.error()) { <p class="text-red-600 text-sm">{{ auth.error() }}</p> }
              <button type="submit" [disabled]="auth.loading()"
                class="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
                {{ auth.loading() ? 'Creating account...' : 'Create Account' }}
              </button>
            </form>
          }
        </div>
      }
    </div>
  `,
})
export class AccountComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  mode = signal<'login' | 'register'>('login');
  email = '';
  password = '';
  firstName = '';
  lastName = '';

  constructor() {
    // Navigate home when login succeeds
    effect(() => {
      if (this.auth.isLoggedIn()) {
        this.router.navigate(['/']);
      }
    });
  }

  login() {
    this.auth.login(this.email, this.password);
  }

  register() {
    this.auth.register(this.firstName, this.lastName, this.email, this.password);
  }
}
