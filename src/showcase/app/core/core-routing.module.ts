import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ApiViewerComponent } from '../shared/api-viewer/api-viewer.component';
import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { CoreComponent } from './core/core.component';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    data: { library: 'angular-core' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full'
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { library: 'angular-core' }
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { library: 'angular-core' }
      },
      {
        path: 'components/:id/:section',
        component: ComponentViewerComponent,
        data: { library: 'angular-core' }
      },
      {
        path: 'api/:id',
        component: ApiViewerComponent,
        data: { library: 'angular-core' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
