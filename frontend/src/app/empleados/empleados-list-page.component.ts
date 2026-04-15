import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RequestFeedbackComponent } from '../shared/ui/request-feedback.component';
import { RequestState } from '../shared/models/request-state.model';
import { Empleado } from '../shared/models/empleado.model';
import { EmpleadosApiService } from './empleados-api.service';
import { ApiErrorMapper } from '../core/http/api-error.mapper';

@Component({
  selector: 'app-empleados-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RequestFeedbackComponent],
  template: `
    <section>
      <header class="page-head">
        <h2>Empleados</h2>
        <a routerLink="/empleados/nuevo">Nuevo empleado</a>
      </header>

      <app-request-feedback [state]="state" emptyLabel="No hay empleados registrados"></app-request-feedback>

      <table *ngIf="!state.loading && empleados.length > 0">
        <thead>
          <tr><th>Clave</th><th>Nombre</th><th>Correo</th><th>Departamento</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let empleado of empleados">
            <td>{{ empleado.clave }}</td>
            <td>{{ empleado.nombre }}</td>
            <td>{{ empleado.correo }}</td>
            <td>{{ empleado.departamentoClave }}</td>
            <td>
              <a [routerLink]="['/empleados', empleado.clave, 'editar']">Editar</a>
              <button (click)="remove(empleado.clave)" [disabled]="deleting[empleado.clave]">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  `,
  styles: `
    .page-head { display: flex; justify-content: space-between; align-items: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 0.75rem; }
    th, td { border-bottom: 1px solid #e2e8f0; text-align: left; padding: 0.5rem; }
    td button { margin-left: 0.5rem; }
  `
})
export class EmpleadosListPageComponent implements OnInit {
  empleados: Empleado[] = [];
  deleting: Record<string, boolean> = {};
  state: RequestState = { loading: false };

  private page = 0;
  private readonly size = 20;

  constructor(
    private readonly api: EmpleadosApiService,
    private readonly errorMapper: ApiErrorMapper
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.state = { loading: true };

    this.api.list(this.page, this.size).subscribe({
      next: (response) => {
        this.empleados = response.content;
        this.state = {
          loading: false,
          empty: response.content.length === 0,
          lastUpdatedAt: Date.now()
        };
      },
      error: (error) => {
        this.state = {
          loading: false,
          error: this.errorMapper.fromHttp(error).message
        };
      }
    });
  }

  remove(clave: string): void {
    if (this.deleting[clave]) {
      return;
    }

    const confirmed = window.confirm(`Eliminar empleado ${clave}?`);
    if (!confirmed) {
      return;
    }

    this.deleting[clave] = true;
    this.api.delete(clave).subscribe({
      next: () => {
        this.deleting[clave] = false;
        this.state = { ...this.state, success: `Empleado ${clave} eliminado.` };
        this.load();
      },
      error: (error) => {
        this.deleting[clave] = false;
        this.state = {
          ...this.state,
          error: this.errorMapper.fromHttp(error).message
        };
      }
    });
  }
}
