import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

import { IconsComponent } from './icons/icons.component';

const routes: Routes = [
  {
    path: '',
    component: IconsComponent,
    data: { library: 'angular-icons' },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full'
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { library: 'angular-icons' }
      },
      {
        path: 'search',
        redirectTo: 'components'
      },
      {
        path: 'components',
        loadChildren: () =>
          import('./icon-components/icon-components.module').then(m => m.IconComponentsModule)
      },
      {
        path: 'experimental',
        loadChildren: () =>
          import('./experimental-icons/experimental-icons.module').then(
            m => m.ExperimentalIconsModule
          )
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IconsRoutingModule {}
