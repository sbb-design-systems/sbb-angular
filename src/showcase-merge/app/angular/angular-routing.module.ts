import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { AngularComponent } from './angular/angular.component';
import { IconOverviewComponent } from './angular/icon-overview/icon-overview.component';

const routes: Routes = [
  {
    path: '',
    component: AngularComponent,
    data: { library: 'angular' },
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
        data: { library: 'angular' },
      },
      {
        path: 'guides/:id',
        component: MarkdownViewerComponent,
        data: { library: 'angular' },
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { library: 'angular' },
      },
      {
        path: 'components/:id/:section',
        component: ComponentViewerComponent,
        data: { library: 'angular' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularRoutingModule {}
