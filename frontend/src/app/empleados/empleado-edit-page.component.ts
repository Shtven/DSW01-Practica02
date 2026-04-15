import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestFeedbackComponent } from '../shared/ui/request-feedback.component';
import { RequestState } from '../shared/models/request-state.model';
import { EmpleadoFormComponent } from './empleado-form.component';
import { EmpleadoFormValue } from '../shared/models/empleado.model';
import { EmpleadosApiService } from './empleados-api.service';
import { EmpleadoErrorPresenter } from './empleado-error.presenter';
import { ApiErrorMapper } from '../core/http/api-error.mapper';

@Component({
  selector: 'app-empleado-edit-page',
  standalone: true,
  imports: [CommonModule, RequestFeedbackComponent, EmpleadoFormComponent],
  template: `
    <section>
      <h2>{{ isEdit ? 'Editar empleado' : 'Nuevo empleado' }}</h2>
      <app-request-feedback [state]="state"></app-request-feedback>
      <app-empleado-form #formCmp [loading]="saving" [submitLabel]="isEdit ? 'Actualizar empleado' : 'Crear empleado'" (save)="save($event)"></app-empleado-form>
    </section>
  `
})
export class EmpleadoEditPageComponent implements OnInit {
  @ViewChild('formCmp') private formComponent?: EmpleadoFormComponent;

  saving = false;
  isEdit = false;
  private clave: string | null = null;
  state: RequestState = { loading: false };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: EmpleadosApiService,
    private readonly errorMapper: ApiErrorMapper,
    private readonly errorPresenter: EmpleadoErrorPresenter
  ) {}

  ngOnInit(): void {
    this.clave = this.route.snapshot.paramMap.get('clave');
    this.isEdit = !!this.clave;

    if (!this.clave) {
      return;
    }

    this.state = { loading: true };
    this.api.getByClave(this.clave).subscribe({
      next: (empleado) => {
        this.formComponent?.patch({
          nombre: empleado.nombre,
          contrasena: 'admin1234',
          correo: empleado.correo,
          direccion: empleado.direccion,
          telefono: empleado.telefono,
          departamentoClave: empleado.departamentoClave
        });
        this.state = { loading: false };
      },
      error: (error) => {
        this.state = { loading: false, error: this.errorMapper.fromHttp(error).message };
      }
    });
  }

  save(payload: EmpleadoFormValue): void {
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
        void this.router.navigate(['/empleados']);
      },
      error: (error) => {
        this.saving = false;
        const apiError = this.errorMapper.fromHttp(error);
        this.state = { loading: false, error: this.errorPresenter.toMessage(apiError) };
      }
    });
  }
}
