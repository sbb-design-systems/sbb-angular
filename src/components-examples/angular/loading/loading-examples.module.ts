import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbLoadingModule } from '@sbb-esta/angular/loading';

import { FullboxLoadingExampleComponent } from './loading-fullbox/fullbox-loading-example.component';
import { FullscreenLoadingExampleComponent } from './loading-fullscreen/fullscreen-loading-example.component';
import { InlineLoadingExampleComponent } from './loading-inline/inline-loading-example.component';
import { SimpleLoadingExampleComponent } from './loading-simple/simple-loading-example.component';

const EXAMPLES = [
  FullboxLoadingExampleComponent,
  FullscreenLoadingExampleComponent,
  InlineLoadingExampleComponent,
  SimpleLoadingExampleComponent,
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
})
export class LoadingExamplesModule {}
