import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { BusinessComponentViewerComponent } from './business-component-viewer/business-component-viewer.component';
import { BusinessComponent } from './business/business.component';

const routes: Routes = [
  {
    path: '',
    component: BusinessComponent,
    data: { library: 'angular-business' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full'
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { library: 'angular-business' }
      },
      {
        path: 'components/:id',
        component: BusinessComponentViewerComponent,
        data: { library: 'angular-business' }
      },
      {
        path: 'components/:id/:section',
        component: BusinessComponentViewerComponent,
        data: { library: 'angular-business' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule {}
