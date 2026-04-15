import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthFacade } from './auth/auth.facade';
import { SessionAuthService } from './auth/session-auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly sessionAuth = inject(SessionAuthService);
  private readonly authFacade = inject(AuthFacade);
  private readonly session = toSignal(this.sessionAuth.state$, { initialValue: this.sessionAuth.snapshot });
  protected readonly isAuthenticated = computed(() => this.session().isAuthenticated);
  protected readonly username = computed(() => this.session().username ?? '');

  logout(): void {
    this.authFacade.logout();
  }
}
