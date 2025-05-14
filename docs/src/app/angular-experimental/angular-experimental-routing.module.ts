import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { componentViewerSubnavigation } from '../shared/component-viewer/component-viewer/component-viewer-subnavigation';
import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';
import { PACKAGES } from '../shared/meta';
import { PackageViewerComponent } from '../shared/package-viewer/package-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: PackageViewerComponent,
    data: { packageData: PACKAGES['angular-experimental'] },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full',
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { packageName: 'angular-experimental' },
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { packageName: 'angular-experimental' },
        children: componentViewerSubnavigation,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularExperimentalRoutingModule {}
