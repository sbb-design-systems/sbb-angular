import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IntroductionComponent } from './introduction/introduction.component';
const routes: Routes = [
  {
    path: '',
    component: IntroductionComponent,
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then((m) => m.BusinessModule),
  },
  {
    path: 'core',
    loadChildren: () => import('./core/core.module').then((m) => m.CoreModule),
  },
  {
    path: 'icons',
    loadChildren: () => import('./icons/icons.module').then((m) => m.IconsModule),
  },
  {
    path: 'keycloak',
    loadChildren: () => import('./keycloak/keycloak.module').then((m) => m.KeycloakModule),
  },
  {
    path: 'public',
    loadChildren: () => import('./public/public.module').then((m) => m.PublicModule),
  },
  {
    path: 'maps',
    loadChildren: () => import('./maps/maps.module').then((m) => m.MapsModule),
  },
  {
    path: 'maps-leaflet',
    loadChildren: () =>
      import('./maps-leaflet/maps-leaflet.module').then((m) => m.MapsLeafletModule),
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
