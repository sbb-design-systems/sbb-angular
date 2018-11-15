import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './home/home.component';
import { ComponentsListComponent } from './components-list/components-list.component';
import { IconsListComponent } from './icons-list/icons-list.component';

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
