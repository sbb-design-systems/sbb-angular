import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { AngularComponent } from './angular/angular.component';

const routes: Routes = [
  {
    path: '',
    component: AngularComponent,
    data: { library: 'public' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full',
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { library: 'public' },
      },
      {
        path: 'guides/:id',
        component: MarkdownViewerComponent,
        data: { library: 'public' },
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { library: 'public' },
      },
      {
        path: 'components/:id/:section',
        component: ComponentViewerComponent,
        data: { library: 'public' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AngularRoutingModule {}
