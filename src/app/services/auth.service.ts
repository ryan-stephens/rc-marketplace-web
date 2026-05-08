import { Injectable, signal, computed } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { GET_ACTIVE_CUSTOMER } from '../graphql/queries';
import { LOGIN, LOGOUT } from '../graphql/mutations';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _customer = signal<any | null>(null);

  readonly customer = this._customer.asReadonly();
  readonly isLoggedIn = computed(() => this._customer() !== null);

  constructor(private apollo: Apollo, private router: Router) {
    this.fetchCurrentUser();
  }

  fetchCurrentUser() {
    this.apollo.query({ query: GET_ACTIVE_CUSTOMER, fetchPolicy: 'network-only' })
      .subscribe(({ data }: any) => {
        this._customer.set(data.activeCustomer ?? null);
      });
  }

  login(username: string, password: string) {
    return this.apollo.mutate({ mutation: LOGIN, variables: { username, password } }).pipe(
      map((res: any) => res.data.login),
      tap(result => {
        if (result.__typename === 'CurrentUser') {
          this.fetchCurrentUser();
        }
      }),
    );
  }

  logout() {
    return this.apollo.mutate({ mutation: LOGOUT }).pipe(
      tap(() => {
        localStorage.removeItem('vendure-auth-token');
        this._customer.set(null);
        this.apollo.client.clearStore();
        this.router.navigate(['/']);
      }),
    );
  }
}
