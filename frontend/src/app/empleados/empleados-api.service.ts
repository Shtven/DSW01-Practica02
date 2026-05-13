import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from '../core/http/api-client.service';
import { Empleado, EmpleadoFormValue, EmpleadoPage } from '../shared/models/empleado.model';

@Injectable({ providedIn: 'root' })
export class EmpleadosApiService {
  constructor(private readonly apiClient: ApiClientService) {}

  list(page: number, size: number): Observable<EmpleadoPage> {
    return this.apiClient.get<EmpleadoPage>('/v1/empleados', { page, size });
  }

  getByClave(clave: string): Observable<Empleado> {
    return this.apiClient.get<Empleado>(`/v1/empleados/${encodeURIComponent(clave)}`);
  }

  create(payload: EmpleadoFormValue): Observable<Empleado> {
    return this.apiClient.post<Empleado, EmpleadoFormValue>('/v1/empleados', payload);
  }

  update(clave: string, payload: EmpleadoFormValue): Observable<Empleado> {
    return this.apiClient.put<Empleado, EmpleadoFormValue>(`/v1/empleados/${encodeURIComponent(clave)}`, payload);
  }

  delete(clave: string): Observable<void> {
    return this.apiClient.delete(`/v1/empleados/${encodeURIComponent(clave)}`);
  }
}
