import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from '../../shared/models/api-error.model';

@Injectable({ providedIn: 'root' })
export class ApiErrorMapper {
  fromHttp(error: HttpErrorResponse): ApiError {
    const payload = (typeof error.error === 'object' && error.error) ? error.error as Partial<ApiError> : {};
    const unavailableByNetwork = error.status === 0;
    const fallbackMessage = unavailableByNetwork
      ? 'La API no esta disponible temporalmente. Verifica API_BASE_URL e intenta nuevamente.'
      : (error.message || 'Error de comunicacion con el servidor');

    return {
      status: error.status,
      message: payload.message || fallbackMessage,
      path: payload.path,
      error: payload.error || error.statusText
    };
  }
}
