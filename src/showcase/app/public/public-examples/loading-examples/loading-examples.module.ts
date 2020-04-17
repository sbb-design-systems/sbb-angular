import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IconArrowRightModule } from '@sbb-esta/angular-icons/arrow';
import { LoadingModule } from '@sbb-esta/angular-public/loading';

import { LoadingExampleComponent } from './loading-example/loading-example.component';

const EXAMPLES = [LoadingExampleComponent];

@NgModule({
  imports: [CommonModule, IconArrowRightModule, LoadingModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class LoadingExamplesModule {}
