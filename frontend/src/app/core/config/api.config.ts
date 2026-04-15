import { inject, InjectionToken } from '@angular/core';
import { RuntimeConfigService } from './runtime-config.service';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => inject(RuntimeConfigService).apiBaseUrl || 'http://localhost:8080'
});
