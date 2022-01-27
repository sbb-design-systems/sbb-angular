import { Routes } from '@angular/router';

import { LoaderBuilder } from '../../loader-builder';
import { ExampleListViewerComponent } from '../example-list-viewer/example-list-viewer.component';
import { HtmlViewerComponent } from '../html-viewer/html-viewer.component';

export const componentViewerSubnavigation: Routes = [
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
    component: ExampleListViewerComponent,
  },
  {
    path: '**',
    redirectTo: 'overview',
  },
];
