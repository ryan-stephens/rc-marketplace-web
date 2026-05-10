import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { authFeature } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { checkoutFeature } from './store/checkout/checkout.reducer';
import { CheckoutEffects } from './store/checkout/checkout.effects';
import { garageFeature } from './store/garage/garage.reducer';
import { GarageEffects } from './store/garage/garage.effects';
import { listingsFeature } from './store/listings/listings.reducer';
import { ListingsEffects } from './store/listings/listings.effects';
import { ordersFeature } from './store/orders/orders.reducer';
import { OrdersEffects } from './store/orders/orders.effects';

export const AUTH_TOKEN_KEY = 'vendure-auth-token';

function vendureAuthInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const newToken = event.headers.get('vendure-auth-token');
        if (newToken) localStorage.setItem(AUTH_TOKEN_KEY, newToken);
      }
    }),
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([vendureAuthInterceptor])),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: environment.apiUrl }),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: { fetchPolicy: 'cache-and-network' },
        },
      };
    }),
    provideStore({
      [authFeature.name]: authFeature.reducer,
      [checkoutFeature.name]: checkoutFeature.reducer,
      [garageFeature.name]: garageFeature.reducer,
      [listingsFeature.name]: listingsFeature.reducer,
      [ordersFeature.name]: ordersFeature.reducer,
    }),
    provideEffects([AuthEffects, CheckoutEffects, GarageEffects, ListingsEffects, OrdersEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      connectInZone: true,
    }),
  ],
};
