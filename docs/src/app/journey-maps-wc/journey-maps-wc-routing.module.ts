import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';
import { PACKAGES } from '../shared/meta';
import { PackageViewerComponent } from '../shared/package-viewer/package-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: PackageViewerComponent,
    data: { packageData: PACKAGES['journey-maps-wc'] },
    children: [
      {
        path: '',
        redirectTo: 'documentation/getting-started',
        pathMatch: 'full',
      },
      {
        path: 'documentation/:id',
        component: MarkdownViewerComponent,
        data: { packageName: 'journey-maps-wc' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyMapsWcRoutingModule {}
