import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string
  ) {}

  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Observable<T> {
    return this.http.get<T>(`${this.apiBaseUrl}${path}`, {
      params: this.toHttpParams(params)
    });
  }

  post<T, B>(path: string, body: B): Observable<T> {
    return this.http.post<T>(`${this.apiBaseUrl}${path}`, body);
  }

  put<T, B>(path: string, body: B): Observable<T> {
    return this.http.put<T>(`${this.apiBaseUrl}${path}`, body);
  }

  delete(path: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}${path}`);
  }

  private toHttpParams(params?: Record<string, string | number | boolean | undefined>): HttpParams {
    let httpParams = new HttpParams();

    if (!params) {
      return httpParams;
    }

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }
}
