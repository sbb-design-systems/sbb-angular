import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HowToUpdateComponent } from './howtoupdate/how-to-update.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { VariantSwitch } from './variant-switch';

const routes: Routes = [
  {
    path: '',
    canActivate: [VariantSwitch],
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
        loadChildren: () => import('./angular/angular.module').then((m) => m.AngularModule),
      },
      {
        path: 'angular-experimental',
        loadChildren: () =>
          import('./angular-experimental/angular-experimental.module').then(
            (m) => m.AngularExperimentalModule
          ),
      },
      {
        path: 'angular-maps',
        loadChildren: () => import('./maps/maps.module').then((m) => m.MapsModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
