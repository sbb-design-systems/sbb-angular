import { Routes } from '@angular/router';

import { componentViewerSubnavigation } from '../shared/component-viewer/component-viewer/component-viewer-subnavigation';
import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';
import { PACKAGES } from '../shared/meta';
import { PackageViewerComponent } from '../shared/package-viewer/package-viewer.component';

import { IconOverviewComponent } from './icon-overview/icon-overview.component';

export const ANGULAR_ROUTES: Routes = [
  {
    path: '',
    component: PackageViewerComponent,
    data: { packageData: PACKAGES.angular },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full',
      },
      {
        path: 'icon-overview',
        component: IconOverviewComponent,
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { packageName: 'angular' },
      },
      {
        path: 'guides/:id',
        component: MarkdownViewerComponent,
        data: { packageName: 'angular' },
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { packageName: 'angular' },
        children: componentViewerSubnavigation,
      },
    ],
  },
];
