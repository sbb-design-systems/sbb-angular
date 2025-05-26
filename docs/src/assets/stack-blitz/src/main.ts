import '@angular/localize/init';
import '@angular/common/locales/global/en-CH';
import '@sbb-esta/angular/i18n';

$localize.locale = 'en-CH';

import { enableProdMode } from '@angular/core';
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
  providers: [provideAnimations(), provideHttpClient(), provideRouter([])],
}).catch(err => console.error(err));
