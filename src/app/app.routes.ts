import { Routes } from '@angular/router';

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
    loadComponent: () => import('./pages/sell/sell').then(m => m.SellComponent),
  },
  {
    path: 'garage',
    loadComponent: () => import('./pages/garage/garage').then(m => m.GarageComponent),
  },
  {
    path: 'garage/:carId',
    loadComponent: () => import('./pages/garage-car/garage-car').then(m => m.GarageCarComponent),
  },
  {
    path: 'profile/:userId',
    loadComponent: () => import('./pages/profile/profile').then(m => m.ProfileComponent),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent),
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout').then(m => m.CheckoutComponent),
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account').then(m => m.AccountComponent),
  },
  { path: '**', redirectTo: '' },
];
