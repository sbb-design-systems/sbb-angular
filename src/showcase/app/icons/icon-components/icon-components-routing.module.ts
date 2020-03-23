import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IconSearchComponent } from './icon-search/icon-search.component';
import { IconViewerComponent } from './icon-viewer/icon-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: IconSearchComponent
  },
  {
    path: ':id',
    component: IconViewerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconComponentsRoutingModule {}
