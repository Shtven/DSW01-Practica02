import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EMPLEADO_FORM_VALIDATORS } from './empleado-form.model';
import { EmpleadoFormValue } from '../shared/models/empleado.model';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-grid">
      <label>Nombre <input formControlName="nombre" /></label>
      <label>Correo <input formControlName="correo" type="email" /></label>
      <label>Contrasena <input formControlName="contrasena" type="password" /></label>
      <label>Direccion <input formControlName="direccion" /></label>
      <label>Telefono <input formControlName="telefono" /></label>
      <label>Departamento (clave) <input formControlName="departamentoClave" /></label>

      <button type="submit" [disabled]="loading || form.invalid">{{ loading ? 'Guardando...' : submitLabel }}</button>
    </form>
  `,
  styles: `
    .form-grid { display: grid; gap: 0.75rem; }
    label { display: grid; gap: 0.25rem; font-weight: 600; }
    input { padding: 0.55rem; border: 1px solid #c6ced8; border-radius: 8px; }
    button { width: fit-content; padding: 0.65rem 1rem; border: 0; border-radius: 8px; background: #0f766e; color: #fff; }
  `
})
export class EmpleadoFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() loading = false;
  @Input() submitLabel = 'Guardar empleado';
  @Output() save = new EventEmitter<EmpleadoFormValue>();

  readonly form = this.fb.nonNullable.group({
    nombre: ['', EMPLEADO_FORM_VALIDATORS.nombre],
    contrasena: ['', EMPLEADO_FORM_VALIDATORS.contrasena],
    correo: ['', EMPLEADO_FORM_VALIDATORS.correo],
    direccion: ['', EMPLEADO_FORM_VALIDATORS.direccion],
    telefono: ['', EMPLEADO_FORM_VALIDATORS.telefono],
    departamentoClave: ['', EMPLEADO_FORM_VALIDATORS.departamentoClave]
  });

  patch(value: EmpleadoFormValue): void {
    this.form.patchValue(value);
  }

  onSubmit(): void {
    if (this.loading || this.form.invalid) {
      return;
    }

    const data = this.form.getRawValue();
    data.nombre = data.nombre.trim();
    data.correo = data.correo.trim().toLowerCase();
    data.direccion = data.direccion.trim();
    data.telefono = data.telefono.trim();
    data.departamentoClave = data.departamentoClave.trim();
    this.save.emit(data);
  }
}
