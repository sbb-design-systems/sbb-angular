import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';
import { PACKAGES } from '../shared/meta';
import { PackageViewerComponent } from '../shared/package-viewer/package-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: PackageViewerComponent,
    data: { packageData: PACKAGES['angular-maps'] },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full',
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { packageName: 'angular-maps' },
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { packageName: 'angular-maps' },
      },
      {
        path: 'components/:id/:section',
        component: ComponentViewerComponent,
        data: { packageName: 'angular-maps' },
      },
      {
        path: 'advanced/:id',
        component: MarkdownViewerComponent,
        data: { packageName: 'angular-maps' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapsRoutingModule {}
