import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbLoadingModule } from '@sbb-esta/angular-business/loading';

import { provideExamples } from '../../../shared/example-provider';

import { FullboxLoadingExampleComponent } from './fullbox-loading-example/fullbox-loading-example.component';
import { FullscreenLoadingExampleComponent } from './fullscreen-loading-example/fullscreen-loading-example.component';
import { InlineLoadingExampleComponent } from './inline-loading-example/inline-loading-example.component';
import { SimpleLoadingExampleComponent } from './simple-loading-example/simple-loading-example.component';

const EXAMPLES = [
  FullboxLoadingExampleComponent,
  FullscreenLoadingExampleComponent,
  SimpleLoadingExampleComponent,
  InlineLoadingExampleComponent,
];

const EXAMPLE_INDEX = {
  'simple-loading-example': SimpleLoadingExampleComponent,
  'fullbox-loading-example': FullboxLoadingExampleComponent,
  'fullscreen-loading-example': FullscreenLoadingExampleComponent,
  'inline-loading-example': InlineLoadingExampleComponent,
};

@NgModule({
  imports: [CommonModule, SbbButtonModule, SbbLoadingModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'loading', EXAMPLE_INDEX)],
})
export class LoadingExamplesModule {}
