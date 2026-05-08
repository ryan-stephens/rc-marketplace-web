import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { REGISTER } from '../../graphql/mutations';

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
          <button (click)="auth.logout().subscribe()" class="mt-6 w-full border text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">
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
              @if (error()) { <p class="text-red-600 text-sm">{{ error() }}</p> }
              <button type="submit" [disabled]="loading()"
                class="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
                {{ loading() ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

          } @else {
            @if (registered()) {
              <div class="text-center py-4">
                <p class="text-green-700 font-semibold">Account created!</p>
                <p class="text-sm text-gray-500 mt-1">Check your email to verify your account, then sign in.</p>
                <button (click)="mode.set('login'); registered.set(false)"
                  class="mt-4 text-red-600 text-sm hover:underline">Go to sign in</button>
              </div>
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
                @if (error()) { <p class="text-red-600 text-sm">{{ error() }}</p> }
                <button type="submit" [disabled]="loading()"
                  class="w-full bg-red-600 text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50">
                  {{ loading() ? 'Creating account...' : 'Create Account' }}
                </button>
              </form>
            }
          }
        </div>
      }
    </div>
  `,
})
export class AccountComponent {
  auth = inject(AuthService);
  private apollo = inject(Apollo);

  mode = signal<'login' | 'register'>('login');
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  error = signal('');
  loading = signal(false);
  registered = signal(false);

  login() {
    this.loading.set(true);
    this.error.set('');
    this.auth.login(this.email, this.password).subscribe({
      next: (result: any) => {
        this.loading.set(false);
        if (result.__typename !== 'CurrentUser') {
          this.error.set(result.message ?? 'Invalid credentials.');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Something went wrong.');
      },
    });
  }

  register() {
    this.loading.set(true);
    this.error.set('');
    this.apollo.mutate({
      mutation: REGISTER,
      variables: {
        input: {
          emailAddress: this.email,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
        },
      },
    }).subscribe({
      next: (res: any) => {
        this.loading.set(false);
        const result = res.data?.registerCustomerAccount;
        if (result?.__typename === 'Success' || result?.success) {
          this.registered.set(true);
        } else {
          this.error.set(result?.message ?? 'Registration failed.');
        }
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Something went wrong.');
      },
    });
  }
}
