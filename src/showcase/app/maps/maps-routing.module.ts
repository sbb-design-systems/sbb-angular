import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { MapsComponent } from './maps/maps.component';

const routes: Routes = [
  {
    path: '',
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
        component: ComponentViewerComponent,
        data: { library: 'angular-maps' }
      },
      {
        path: 'components/:id/:section',
        component: ComponentViewerComponent,
        data: { library: 'angular-maps' }
      },
      {
        path: 'advanced/:id',
        component: MarkdownViewerComponent,
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
