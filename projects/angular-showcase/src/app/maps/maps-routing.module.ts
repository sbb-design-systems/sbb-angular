import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicComponentViewerComponent } from '../features/public-component-viewer/public-component-viewer/public-component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { MapsComponent } from './maps/maps.component';

const routes: Routes = [
  {
    path: 'maps',
    component: MapsComponent,
    data: { library: 'angular-maps' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full'
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { library: 'angular-maps' }
      },
      {
        path: 'components/:id',
        component: PublicComponentViewerComponent,
        data: { library: 'angular-maps' }
      },
      {
        path: 'components/:id/:section',
        component: PublicComponentViewerComponent,
        data: { library: 'angular-maps' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule {}
