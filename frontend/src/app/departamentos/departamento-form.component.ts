import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DepartamentoFormValue } from '../shared/models/departamento.model';
import { DEPARTAMENTO_FORM_VALIDATORS } from './departamento-form.model';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-grid">
      <label>Nombre <input formControlName="nombre" /></label>
      <button type="submit" [disabled]="loading || form.invalid">{{ loading ? 'Guardando...' : submitLabel }}</button>
    </form>
  `,
  styles: `
    .form-grid { display: grid; gap: 0.75rem; }
    input { padding: 0.55rem; border: 1px solid #c6ced8; border-radius: 8px; }
    button { width: fit-content; padding: 0.65rem 1rem; border: 0; border-radius: 8px; background: #7c3aed; color: #fff; }
  `
})
export class DepartamentoFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() loading = false;
  @Input() submitLabel = 'Guardar departamento';
  @Output() save = new EventEmitter<DepartamentoFormValue>();

  readonly form = this.fb.nonNullable.group({
    nombre: ['', DEPARTAMENTO_FORM_VALIDATORS.nombre]
  });

  patch(value: DepartamentoFormValue): void {
    this.form.patchValue(value);
  }

  onSubmit(): void {
    if (this.loading || this.form.invalid) {
      return;
    }

    const data = this.form.getRawValue();
    data.nombre = data.nombre.trim();
    this.save.emit(data);
  }
}
