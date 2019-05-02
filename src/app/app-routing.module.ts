import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ComponentsListComponent } from './components-list/components-list.component';
import { ContentComponent } from './content/content.component';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { HomeComponent } from './home/home.component';
import { IconsListComponent } from './icons-list/icons-list.component';
import { TypographyComponent } from './typography/typography.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { page: 'home' }
  },
  {
    path: 'content/:id',
    component: ContentComponent,
    pathMatch: 'full',
    data: { page: 'content' }
  },
  {
    path: 'components-list',
    component: ComponentsListComponent,
    pathMatch: 'full',
    data: { page: 'component-list' }
  },
  {
    path: 'icons-list',
    component: IconsListComponent,
    pathMatch: 'full',
    data: { page: 'icons-list' }
  },
  {
    path: 'typography',
    component: TypographyComponent,
    pathMatch: 'full',
    data: { page: 'typography' }
  },
  {
    path: 'getting-started',
    component: GettingStartedComponent,
    pathMatch: 'full',
    data: { page: 'getting-started' }
  },
  {
    path: '**',
    component: HomeComponent,
    data: { page: 'home' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
