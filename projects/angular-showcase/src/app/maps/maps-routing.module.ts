import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusinessComponentViewerComponent } from '../features/business-component-viewer/business-component-viewer/business-component-viewer.component';
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
        component: BusinessComponentViewerComponent,
        data: { library: 'angular-maps' }
      },
      {
        path: 'components/:id/:section',
        component: BusinessComponentViewerComponent,
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
