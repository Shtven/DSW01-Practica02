import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionAuthService } from '../../auth/session-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthErrorHandler {
  private readonly router = inject(Router);
  private readonly auth = inject(SessionAuthService);

  handle(error: HttpErrorResponse): void {
    if (error.status === 401 || error.status === 403) {
      this.auth.logout('Tu sesion ya no es valida. Inicia sesion nuevamente.');
      this.router.navigate(['/login']);
    }
  }
}
