import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RuntimeConfig } from './runtime-config.model';

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private readonly http = inject(HttpClient);
  private config: RuntimeConfig = {
    apiBaseUrl: environment.apiBaseUrl
  };

  async load(): Promise<void> {
    try {
      const loaded = await firstValueFrom(this.http.get<RuntimeConfig>('runtime-config.json'));

      if (!loaded?.apiBaseUrl?.trim()) {
        throw new Error('Invalid runtime-config.json: apiBaseUrl is required.');
      }

      this.config = {
        apiBaseUrl: loaded.apiBaseUrl,
        frontendPort: loaded.frontendPort
      };
    } catch {
      // Allow local non-container execution to keep using static environment defaults.
      this.config = {
        apiBaseUrl: environment.apiBaseUrl
      };
    }
  }

  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }
}
