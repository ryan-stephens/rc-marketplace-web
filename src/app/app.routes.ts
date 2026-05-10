import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent),
  },
  {
    path: 'listings',
    loadComponent: () => import('./pages/listings/listings').then(m => m.ListingsComponent),
  },
  {
    path: 'listings/:id',
    loadComponent: () => import('./pages/listing-detail/listing-detail').then(m => m.ListingDetailComponent),
  },
  {
    path: 'sell',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/sell/sell').then(m => m.SellComponent),
  },
  {
    path: 'garage',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/garage/garage').then(m => m.GarageComponent),
  },
  {
    path: 'garage/:carId',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/garage-car/garage-car').then(m => m.GarageCarComponent),
  },
  {
    path: 'my-listings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-listings/my-listings').then(m => m.MyListingsComponent),
  },
  {
    path: 'my-sales',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-sales/my-sales').then(m => m.MySalesComponent),
  },
  {
    path: 'garages',
    loadComponent: () => import('./pages/garages/garages').then(m => m.GaragesComponent),
  },
  {
    path: 'profile/:userId',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent),
  },
  {
    path: 'checkout/confirm',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout-confirm/checkout-confirm').then(m => m.CheckoutConfirmComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account').then(m => m.AccountComponent),
  },
  { path: '**', redirectTo: '' },
];
