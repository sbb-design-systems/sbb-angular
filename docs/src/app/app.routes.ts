import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { SbbNotificationToast } from '@sbb-esta/angular/notification-toast';

import { HowToUpdateComponent } from './howtoupdate/how-to-update.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { ModeNotificationToastComponent } from './shared/mode-notification-toast/mode-notification-toast.component';
import { VariantSwitch } from './variant-switch';

const modeSessionStorageKey = 'sbbAngularMode';
const offBrandColorMode = 'sbb-off-brand-colors';

export const APP_ROUTES: Routes = [
  {
    path: '',
    canActivate: [VariantSwitch],
    canActivateChild: [
      (route) => {
        if (route.queryParams.mode === offBrandColorMode) {
          sessionStorage.setItem(modeSessionStorageKey, offBrandColorMode);
        }

        if (sessionStorage.getItem(modeSessionStorageKey) === offBrandColorMode) {
          document.documentElement.classList.add('sbb-off-brand-colors');
          inject(SbbNotificationToast).openFromComponent(ModeNotificationToastComponent, {
            type: 'info',
            verticalPosition: 'top',
          });
        } else {
          document.documentElement.classList.remove(`sbb-off-brand-colors`);
        }

        const variantPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue(
          '--sbb-color-red',
        );
        document
          .querySelector('meta[name="theme-color"]')!
          .setAttribute('content', variantPrimaryColor);
        document
          .querySelector('meta[name="msapplication-TileColor"]')!
          .setAttribute('content', variantPrimaryColor);

        return true;
      },
    ],
    children: [
      {
        path: '',
        component: IntroductionComponent,
      },
      {
        path: 'howtoupdate',
        component: HowToUpdateComponent,
      },
      {
        path: 'angular',
        loadChildren: () => import('./angular/angular.routes').then((m) => m.ANGULAR_ROUTES),
      },
      {
        path: 'angular-experimental',
        loadChildren: () =>
          import('./angular-experimental/angular-experimental.routes').then(
            (m) => m.ANGULAR_EXPERIMENTAL_ROUTES,
          ),
      },
      {
        path: 'journey-maps',
        loadChildren: () =>
          import('./journey-maps/journey-maps.routes').then((m) => m.JOURNEY_MAPS_ROUTES),
      },
      {
        path: 'journey-maps-wc',
        loadChildren: () =>
          import('./journey-maps-wc/journey-maps-wc.routes').then((m) => m.JOURNEY_MAPS_WC_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
