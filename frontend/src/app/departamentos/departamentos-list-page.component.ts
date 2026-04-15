import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RequestFeedbackComponent } from '../shared/ui/request-feedback.component';
import { RequestState } from '../shared/models/request-state.model';
import { Departamento } from '../shared/models/departamento.model';
import { DepartamentosApiService } from './departamentos-api.service';
import { ApiErrorMapper } from '../core/http/api-error.mapper';

@Component({
  selector: 'app-departamentos-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RequestFeedbackComponent],
  template: `
    <section>
      <header class="page-head">
        <h2>Departamentos</h2>
        <a routerLink="/departamentos/nuevo">Nuevo departamento</a>
      </header>

      <app-request-feedback [state]="state" emptyLabel="No hay departamentos registrados"></app-request-feedback>

      <table *ngIf="!state.loading && departamentos.length > 0">
        <thead>
          <tr><th>Clave</th><th>Nombre</th><th>Empleados</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let departamento of departamentos">
            <td>{{ departamento.clave }}</td>
            <td>{{ departamento.nombre }}</td>
            <td>{{ departamento.empleados.length }}</td>
            <td>
              <a [routerLink]="['/departamentos', departamento.clave, 'editar']">Editar</a>
              <button (click)="remove(departamento.clave)" [disabled]="deleting[departamento.clave]">Eliminar</button>
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
export class DepartamentosListPageComponent implements OnInit {
  departamentos: Departamento[] = [];
  deleting: Record<string, boolean> = {};
  state: RequestState = { loading: false };

  private page = 0;
  private readonly size = 20;

  constructor(
    private readonly api: DepartamentosApiService,
    private readonly errorMapper: ApiErrorMapper
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.state = { loading: true };

    this.api.list(this.page, this.size).subscribe({
      next: (response) => {
        this.departamentos = response.content;
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

    const confirmed = window.confirm(`Eliminar departamento ${clave}?`);
    if (!confirmed) {
      return;
    }

    this.deleting[clave] = true;
    this.api.delete(clave).subscribe({
      next: () => {
        this.deleting[clave] = false;
        this.state = { ...this.state, success: `Departamento ${clave} eliminado.` };
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
