import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { LoadingModule } from '@sbb-esta/angular-public/loading';

import { FullboxLoadingExampleComponent } from './fullbox-loading-example/fullbox-loading-example.component';
import { FullscreenLoadingExampleComponent } from './fullscreen-loading-example/fullscreen-loading-example.component';
import { SimpleLoadingExampleComponent } from './simple-loading-example/simple-loading-example.component';

const EXAMPLES = [
  SimpleLoadingExampleComponent,
  FullscreenLoadingExampleComponent,
  FullboxLoadingExampleComponent,
];

@NgModule({
  imports: [CommonModule, IconArrowRightModule, LoadingModule, ButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LoadingExamplesModule {}
