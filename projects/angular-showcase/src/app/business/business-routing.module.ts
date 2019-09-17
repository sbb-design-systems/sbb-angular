import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicComponentViewerModule } from '../features/public-component-viewer/public-component-viewer.module';
import { PublicComponentViewerComponent } from '../features/public-component-viewer/public-component-viewer/public-component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { BusinessComponent } from './business/business.component';

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
        component: PublicComponentViewerComponent,
        data: { library: 'angular-business' }
      },
      {
        path: 'components/:id/:section',
        component: PublicComponentViewerComponent,
        data: { library: 'angular-business' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), PublicComponentViewerModule],
  exports: [RouterModule]
})
export class BusinessRoutingModule {}
