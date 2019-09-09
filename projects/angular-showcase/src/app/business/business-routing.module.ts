import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { BusinessComponent } from './business/business.component';
import { ComponentViewerComponent } from './component-viewer/component-viewer.component';

const routes: Routes = [
  {
    path: 'business',
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
        component: ComponentViewerComponent,
        data: { library: 'angular-business' }
      },
      {
        path: 'components/:id/:section',
        component: ComponentViewerComponent,
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
