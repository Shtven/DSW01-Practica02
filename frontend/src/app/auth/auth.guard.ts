import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionAuthService } from './session-auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(SessionAuthService);
  const router = inject(Router);

  if (auth.snapshot.isAuthenticated) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
