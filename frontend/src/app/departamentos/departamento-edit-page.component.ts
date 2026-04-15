import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestFeedbackComponent } from '../shared/ui/request-feedback.component';
import { RequestState } from '../shared/models/request-state.model';
import { DepartamentoFormComponent } from './departamento-form.component';
import { DepartamentoFormValue } from '../shared/models/departamento.model';
import { DepartamentosApiService } from './departamentos-api.service';
import { ApiErrorMapper } from '../core/http/api-error.mapper';

@Component({
  selector: 'app-departamento-edit-page',
  standalone: true,
  imports: [CommonModule, RequestFeedbackComponent, DepartamentoFormComponent],
  template: `
    <section>
      <h2>{{ isEdit ? 'Editar departamento' : 'Nuevo departamento' }}</h2>
      <app-request-feedback [state]="state"></app-request-feedback>
      <app-departamento-form #formCmp [loading]="saving" [submitLabel]="isEdit ? 'Actualizar departamento' : 'Crear departamento'" (save)="save($event)"></app-departamento-form>
    </section>
  `
})
export class DepartamentoEditPageComponent implements OnInit {
  @ViewChild('formCmp') private formComponent?: DepartamentoFormComponent;

  saving = false;
  isEdit = false;
  private clave: string | null = null;
  state: RequestState = { loading: false };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: DepartamentosApiService,
    private readonly errorMapper: ApiErrorMapper
  ) {}

  ngOnInit(): void {
    this.clave = this.route.snapshot.paramMap.get('clave');
    this.isEdit = !!this.clave;

    if (!this.clave) {
      return;
    }

    this.state = { loading: true };
    this.api.getByClave(this.clave).subscribe({
      next: (departamento) => {
        this.formComponent?.patch({
          nombre: departamento.nombre
        });
        this.state = { loading: false };
      },
      error: (error) => {
        this.state = { loading: false, error: this.errorMapper.fromHttp(error).message };
      }
    });
  }

  save(payload: DepartamentoFormValue): void {
    if (this.saving) {
      return;
    }

    this.saving = true;

    const operation = this.isEdit && this.clave
      ? this.api.update(this.clave, payload)
      : this.api.create(payload);

    operation.subscribe({
      next: () => {
        this.saving = false;
        void this.router.navigate(['/departamentos']);
      },
      error: (error) => {
        this.saving = false;
        this.state = { loading: false, error: this.errorMapper.fromHttp(error).message };
      }
    });
  }
}
