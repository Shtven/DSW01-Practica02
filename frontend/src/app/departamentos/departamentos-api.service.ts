import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../core/http/api-client.service';
import { Departamento, DepartamentoFormValue, DepartamentoPage } from '../shared/models/departamento.model';

@Injectable({ providedIn: 'root' })
export class DepartamentosApiService {
  constructor(private readonly apiClient: ApiClientService) {}

  list(page: number, size: number): Observable<DepartamentoPage> {
    return this.apiClient.get<DepartamentoPage>('/v1/departamentos', { page, size });
  }

  getByClave(clave: string): Observable<Departamento> {
    return this.apiClient.get<Departamento>(`/v1/departamentos/${encodeURIComponent(clave)}`);
  }

  create(payload: DepartamentoFormValue): Observable<Departamento> {
    return this.apiClient.post<Departamento, DepartamentoFormValue>('/v1/departamentos', payload);
  }

  update(clave: string, payload: DepartamentoFormValue): Observable<Departamento> {
    return this.apiClient.put<Departamento, DepartamentoFormValue>(`/v1/departamentos/${encodeURIComponent(clave)}`, payload);
  }

  delete(clave: string): Observable<void> {
    return this.apiClient.delete(`/v1/departamentos/${encodeURIComponent(clave)}`);
  }
}
