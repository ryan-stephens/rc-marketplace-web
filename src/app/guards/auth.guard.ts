import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allow = () => auth.isLoggedIn() ? true : router.createUrlTree(['/account']);

  if (auth.loaded()) return allow();

  return toObservable(auth.loaded).pipe(
    filter(loaded => loaded),
    take(1),
    map(() => allow()),
  );
};
