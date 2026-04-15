import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { basicAuthInterceptor } from './core/http/basic-auth.interceptor';
import { retryGetInterceptor } from './core/http/retry-get.interceptor';
import { RuntimeConfigService } from './core/config/runtime-config.service';

function initializeRuntimeConfig(runtimeConfig: RuntimeConfigService): () => Promise<void> {
  return () => runtimeConfig.load();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([basicAuthInterceptor, retryGetInterceptor])),
    provideClientHydration(withEventReplay()),
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: initializeRuntimeConfig,
      deps: [RuntimeConfigService]
    }
  ]
};
