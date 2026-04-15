import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SessionState {
  isAuthenticated: boolean;
  username?: string;
  authHeader?: string;
  lastAuthError?: string;
}

@Injectable({ providedIn: 'root' })
export class SessionAuthService {
  private readonly stateSubject = new BehaviorSubject<SessionState>({
    isAuthenticated: false
  });

  readonly state$ = this.stateSubject.asObservable();

  get snapshot(): SessionState {
    return this.stateSubject.value;
  }

  login(username: string, password: string): void {
    const token = btoa(`${username}:${password}`);
    this.stateSubject.next({
      isAuthenticated: true,
      username,
      authHeader: `Basic ${token}`
    });
  }

  logout(errorMessage?: string): void {
    this.stateSubject.next({
      isAuthenticated: false,
      lastAuthError: errorMessage
    });
  }

  getAuthHeader(): string | undefined {
    return this.snapshot.authHeader;
  }
}
