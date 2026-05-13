import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiClientService } from '../core/http/api-client.service';
import { SessionAuthService } from './session-auth.service';

interface EmpleadoProbePage {
  content: unknown[];
}

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  constructor(
    private readonly apiClient: ApiClientService,
    private readonly sessionAuth: SessionAuthService,
    private readonly router: Router
  ) {}

  login(username: string, password: string): Observable<boolean> {
    this.sessionAuth.login(username.trim(), password);

    return this.apiClient
      .get<EmpleadoProbePage>('/v1/empleados', { page: 0, size: 1 })
      .pipe(
        map(() => true),
        catchError(() => {
          this.sessionAuth.logout('Credenciales invalidas o sin permisos.');
          return of(false);
        })
      );
  }

  logout(): void {
    this.sessionAuth.logout();
    this.router.navigate(['/login']);
  }

  completeLoginNavigation(returnUrl?: string | null): void {
    if (returnUrl?.startsWith('/')) {
      this.router.navigateByUrl(returnUrl);
      return;
    }

    this.router.navigate(['/empleados']);
  }
}
