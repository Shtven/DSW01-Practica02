import { Injectable } from '@angular/core';
import { ApiError } from '../shared/models/api-error.model';

@Injectable({ providedIn: 'root' })
export class EmpleadoErrorPresenter {
  toMessage(error: ApiError): string {
    if (error.status === 400) {
      return error.message || 'Verifica los datos del empleado.';
    }

    if (error.status === 404) {
      return 'No se encontro el empleado o el departamento seleccionado.';
    }

    if (error.status === 409) {
      return 'Ya existe un empleado con los datos proporcionados.';
    }

    return error.message || 'No fue posible completar la operacion de empleado.';
  }
}
