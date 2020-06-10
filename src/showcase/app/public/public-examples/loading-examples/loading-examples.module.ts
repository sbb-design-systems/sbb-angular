import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { LoadingModule } from '@sbb-esta/angular-public/loading';

import { provideExamples } from '../../../shared/example-provider';

import { FullboxLoadingExampleComponent } from './fullbox-loading-example/fullbox-loading-example.component';
import { FullscreenLoadingExampleComponent } from './fullscreen-loading-example/fullscreen-loading-example.component';
import { SimpleLoadingExampleComponent } from './simple-loading-example/simple-loading-example.component';

const EXAMPLES = [
  FullboxLoadingExampleComponent,
  FullscreenLoadingExampleComponent,
  SimpleLoadingExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-loading-example': SimpleLoadingExampleComponent,
  'fullbox-loading-example': FullboxLoadingExampleComponent,
  'fullscreen-loading-example': FullscreenLoadingExampleComponent,
};

@NgModule({
  imports: [CommonModule, ButtonModule, LoadingModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'loading', EXAMPLE_INDEX)],
})
export class LoadingExamplesModule {}
