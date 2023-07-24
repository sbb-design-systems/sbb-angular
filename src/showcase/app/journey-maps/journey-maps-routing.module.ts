import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { componentViewerSubnavigation } from '../shared/component-viewer/component-viewer/component-viewer-subnavigation';
import { ComponentViewerComponent } from '../shared/component-viewer/component-viewer/component-viewer.component';
import { HtmlViewerComponent } from '../shared/component-viewer/html-viewer/html-viewer.component';
import { LoaderBuilder } from '../shared/loader-builder';
import { MarkdownViewerComponent } from '../shared/markdown-viewer/markdown-viewer.component';
import { PACKAGES } from '../shared/meta';
import { PackageViewerComponent } from '../shared/package-viewer/package-viewer.component';

const routes: Routes = [
  {
    path: '',
    component: PackageViewerComponent,
    data: { packageData: PACKAGES['journey-maps'] },
    children: [
      {
        path: '',
        redirectTo: 'introduction/getting-started',
        pathMatch: 'full',
      },
      {
        path: 'introduction/:id',
        component: MarkdownViewerComponent,
        data: { packageName: 'journey-maps' },
      },
      {
        path: 'components/web-component',
        component: ComponentViewerComponent,
        data: { packageName: 'journey-maps', id: 'web-component' },
        children: [
          {
            path: 'overview',
            component: HtmlViewerComponent,
            data: {
              loaderBuilderInterceptor: (loaderBuilder: LoaderBuilder) =>
                loaderBuilder.fromModuleDocumentation(),
            },
          },
          {
            path: 'api',
            component: HtmlViewerComponent,
            data: {
              loaderBuilderInterceptor: (loaderBuilder: LoaderBuilder) =>
                loaderBuilder.fromApiDocumentation(),
            },
          },
          {
            path: 'examples',
            data: { id: 'web-component-examples' },
            component: MarkdownViewerComponent,
          },
          {
            path: '**',
            redirectTo: 'overview',
          },
        ],
      },
      {
        path: 'components/:id',
        component: ComponentViewerComponent,
        data: { packageName: 'journey-maps' },
        children: componentViewerSubnavigation,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JourneyMapsRoutingModule {}
