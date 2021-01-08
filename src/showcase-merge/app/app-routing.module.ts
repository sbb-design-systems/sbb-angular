import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HowToUpdateComponent } from './howtoupdate/how-to-update.component';
import { IntroductionComponent } from './introduction/introduction.component';

const routes: Routes = [
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
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
