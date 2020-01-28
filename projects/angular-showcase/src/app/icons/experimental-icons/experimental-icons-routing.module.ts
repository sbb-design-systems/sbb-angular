import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExperimentalIconSearchComponent } from './experimental-icon-search/experimental-icon-search.component';

const routes: Routes = [
  {
    path: '',
    component: ExperimentalIconSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperimentalIconsRoutingModule {}
