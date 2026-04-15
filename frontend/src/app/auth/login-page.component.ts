import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthFacade } from './auth.facade';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h1>Acceso de administrador</h1>
      <p>Inicia sesion para usar los modulos de empleados y departamentos.</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <label for="username">Correo</label>
        <input id="username" formControlName="username" type="email" autocomplete="username" />

        <label for="password">Contrasena</label>
        <input id="password" formControlName="password" type="password" autocomplete="current-password" />

        <button type="submit" [disabled]="loading || form.invalid">{{ loading ? 'Ingresando...' : 'Ingresar' }}</button>
      </form>

      <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
    </section>
  `,
  styles: `
    .card { max-width: 420px; margin: 3rem auto; padding: 1.5rem; border-radius: 12px; background: #fff; box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
    form { display: grid; gap: 0.625rem; }
    label { font-weight: 600; }
    input { padding: 0.625rem; border: 1px solid #c6ced8; border-radius: 8px; }
    button { margin-top: 0.5rem; padding: 0.75rem; border: 0; border-radius: 8px; background: #1d4ed8; color: #fff; font-weight: 600; }
    .error { margin-top: 0.75rem; color: #991b1b; }
  `
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authFacade = inject(AuthFacade);
  private readonly route = inject(ActivatedRoute);

  loading = false;
  errorMessage = '';

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  submit(): void {
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.form.getRawValue();

    this.authFacade.login(username.trim(), password).pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((ok) => {
      if (!ok) {
        this.errorMessage = 'No se pudo autenticar. Verifica tus credenciales.';
        return;
      }

      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
      this.authFacade.completeLoginNavigation(returnUrl);
    });
  }
}
