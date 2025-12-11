import '@angular/common/locales/global/en-CH';
import '@sbb-esta/angular/i18n';

import { enableProdMode, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { environment } from './environments/environment';
import { SbbAngularDocsExample } from './app/sbb-angular-docs-example';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(SbbAngularDocsExample, {
  providers: [
    { provide: LOCALE_ID, useValue: 'en-CH' },
    provideAnimations(),
    provideHttpClient(),
    provideRouter([]),
  ],
}).catch(err => console.error(err));
