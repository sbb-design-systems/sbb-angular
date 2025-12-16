import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { GranularSanityChecks, SBB_SANITY_CHECKS } from '@sbb-esta/angular/core';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(),
    SbbNotificationToast,
    {
      provide: SBB_SANITY_CHECKS,
      useValue: { doctype: true, typography: true, version: false } as GranularSanityChecks,
    },
  ],
}).catch((err) => console.error(err));
