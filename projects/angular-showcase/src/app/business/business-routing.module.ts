import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { BusinessComponent } from './business/business.component';
import { ComponentViewerComponent } from './component-viewer/component-viewer.component';

const routes: Routes = [
  {
    path: 'business',
    component: BusinessComponent,
    data: { library: 'angular-public' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full'
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule {}
