import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/auth/auth.actions';
import {
  selectCustomer,
  selectIsLoggedIn,
  selectLoaded,
  selectLoading,
  selectError,
} from '../store/auth/auth.selectors';

/**
 * Thin facade over the auth NgRx feature store.
 * Exposes the same signal-based API as before — all consumers unchanged.
 * All side effects (Apollo calls, localStorage, navigation) live in AuthEffects.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private store = inject(Store);

  readonly customer = this.store.selectSignal(selectCustomer);
  readonly isLoggedIn = this.store.selectSignal(selectIsLoggedIn);
  readonly loaded = this.store.selectSignal(selectLoaded);
  readonly loading = this.store.selectSignal(selectLoading);
  readonly error = this.store.selectSignal(selectError);

  constructor() {
    this.store.dispatch(AuthActions.fetchCurrentUser());
  }

  login(email: string, password: string): void {
    this.store.dispatch(AuthActions.login({ email, password }));
  }

  register(firstName: string, lastName: string, email: string, password: string): void {
    this.store.dispatch(AuthActions.register({ firstName, lastName, email, password }));
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
