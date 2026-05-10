import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { AuthState } from './auth.model';

const initialState: AuthState = {
  customer: null,
  loaded: false,
  loading: false,
  error: null,
};

export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    on(AuthActions.fetchCurrentUser, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.fetchCurrentUserSuccess, (state, { customer }) => ({
      ...state,
      customer,
      loaded: true,
      loading: false,
    })),
    on(AuthActions.fetchCurrentUserFailure, state => ({
      ...state,
      loaded: true,
      loading: false,
    })),

    on(AuthActions.login, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.loginSuccess, (state, { customer }) => ({
      ...state,
      customer,
      loading: false,
      error: null,
    })),
    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(AuthActions.register, state => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(AuthActions.registerFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),

    on(AuthActions.logout, state => ({
      ...state,
      loading: true,
    })),
    on(AuthActions.logoutComplete, () => ({
      ...initialState,
      loaded: true, // stay loaded so guard doesn't re-check
    })),
  ),
});
