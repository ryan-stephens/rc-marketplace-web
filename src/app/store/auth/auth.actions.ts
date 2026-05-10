import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Customer } from './auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Fetch current user on app init
    'Fetch Current User': emptyProps(),
    'Fetch Current User Success': props<{ customer: Customer | null }>(),
    'Fetch Current User Failure': emptyProps(), // silent — user is just not logged in

    // Login
    'Login': props<{ email: string; password: string }>(),
    'Login Success': props<{ customer: Customer }>(),
    'Login Failure': props<{ error: string }>(),

    // Register
    'Register': props<{ firstName: string; lastName: string; email: string; password: string }>(),
    'Register Failure': props<{ error: string }>(),

    // Logout
    'Logout': emptyProps(),
    'Logout Complete': emptyProps(),
  },
});
