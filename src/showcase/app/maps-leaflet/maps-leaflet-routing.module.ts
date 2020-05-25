import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { MapsLeafletComponent } from './maps-leaflet/maps-leaflet.component';

const routes: Routes = [
  {
    path: '',
    component: MapsLeafletComponent,
    data: { library: 'maps-leaflet' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full',
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { library: 'maps-leaflet' },
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { library: 'maps-leaflet' },
      },
      {
        path: 'components/:id/:section',
        component: ComponentViewerComponent,
        data: { library: 'maps-leaflet' },
      },
      {
        path: 'advanced/:id',
        component: MarkdownViewerComponent,
        data: { library: 'maps-leaflet' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsLeafletRoutingModule {}
