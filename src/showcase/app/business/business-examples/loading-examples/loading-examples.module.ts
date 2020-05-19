import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { LoadingModule } from '@sbb-esta/angular-business/loading';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';

import { LoadingExampleComponent } from './loading-example/loading-example.component';

const EXAMPLES = [LoadingExampleComponent];

@NgModule({
  imports: [CommonModule, IconArrowRightModule, LoadingModule, ButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class LoadingExamplesModule {}
