import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Apollo } from 'apollo-angular';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { GET_ACTIVE_CUSTOMER } from '../../graphql/queries';
import { LOGIN, LOGOUT, REGISTER } from '../../graphql/mutations';
import { AuthActions } from './auth.actions';
import { AUTH_TOKEN_KEY } from '../../app.config';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private apollo = inject(Apollo);
  private router = inject(Router);

  // Triggered once on app init from AuthService constructor
  fetchCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.fetchCurrentUser),
      switchMap(() =>
        this.apollo.query({ query: GET_ACTIVE_CUSTOMER, fetchPolicy: 'network-only' }).pipe(
          map((res: any) => AuthActions.fetchCurrentUserSuccess({
            customer: res.data.activeCustomer ?? null,
          })),
          catchError(() => of(AuthActions.fetchCurrentUserFailure())),
        )
      ),
    )
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.apollo.mutate({ mutation: LOGIN, variables: { username: email, password } }).pipe(
          map((res: any) => res.data.login),
          switchMap(result => {
            if (result.__typename !== 'CurrentUser') {
              return of(AuthActions.loginFailure({ error: result.message ?? 'Invalid credentials.' }));
            }
            // Fetch full customer profile after successful login
            return this.apollo.query({ query: GET_ACTIVE_CUSTOMER, fetchPolicy: 'network-only' }).pipe(
              map((res: any) => AuthActions.loginSuccess({ customer: res.data.activeCustomer })),
              catchError(() => of(AuthActions.loginFailure({ error: 'Login succeeded but failed to load profile.' }))),
            );
          }),
          catchError(err => of(AuthActions.loginFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Login failed.',
          }))),
        )
      ),
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ firstName, lastName, email, password }) =>
        this.apollo.mutate({
          mutation: REGISTER,
          variables: { input: { firstName, lastName, emailAddress: email, password } },
        }).pipe(
          map((res: any) => res.data.registerCustomerAccount),
          switchMap(result => {
            if (result?.__typename !== 'Success' && !result?.success) {
              return of(AuthActions.registerFailure({ error: result?.message ?? 'Registration failed.' }));
            }
            // Auto-login after registration (requireVerification: false)
            return of(AuthActions.login({ email, password }));
          }),
          catchError(err => of(AuthActions.registerFailure({
            error: err.graphQLErrors?.[0]?.message ?? err.message ?? 'Registration failed.',
          }))),
        )
      ),
    )
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.apollo.mutate({ mutation: LOGOUT }).pipe(
          map(() => AuthActions.logoutComplete()),
          catchError(() => of(AuthActions.logoutComplete())), // always complete logout
        )
      ),
    )
  );

  // Side effects — no dispatch

  logoutComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutComplete),
      tap(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        this.apollo.client.clearStore();
        this.router.navigate(['/']);
      }),
    ),
    { dispatch: false }
  );
}
