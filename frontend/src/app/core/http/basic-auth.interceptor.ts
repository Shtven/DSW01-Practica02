import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { SessionAuthService } from '../../auth/session-auth.service';
import { AuthErrorHandler } from './auth-error.handler';

export const basicAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(SessionAuthService);
  const authErrorHandler = inject(AuthErrorHandler);

  const authHeader = session.getAuthHeader();
  const isApiRequest = req.url.includes('/api/v1/');

  const cloned = (authHeader && isApiRequest)
    ? req.clone({
        setHeaders: {
          Authorization: authHeader
        }
      })
    : req;

  return next(cloned).pipe(
    catchError((error) => {
      authErrorHandler.handle(error);
      return throwError(() => error);
    })
  );
};
