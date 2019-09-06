import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';

const routes: Routes = [
  {
    path: 'keycloak',
    component: MarkdownViewerComponent,
    data: { library: 'angular-keycloak', id: 'README' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeycloakRoutingModule {}
