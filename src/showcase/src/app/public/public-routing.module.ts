import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicComponentViewerModule } from '../features/public-component-viewer/public-component-viewer.module';
import { PublicComponentViewerComponent } from '../features/public-component-viewer/public-component-viewer/public-component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { PublicComponent } from './public/public.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    data: { library: 'angular-public' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full'
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { library: 'angular-public' }
      },
      {
        path: 'components/:id',
        component: PublicComponentViewerComponent,
        data: { library: 'angular-public' }
      },
      {
        path: 'components/:id/:section',
        component: PublicComponentViewerComponent,
        data: { library: 'angular-public' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), PublicComponentViewerModule],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
