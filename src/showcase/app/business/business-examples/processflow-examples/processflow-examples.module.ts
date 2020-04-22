import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';

import { SkippableProcessflowExampleComponent } from './skippable-processflow-example/skippable-processflow-example.component';

const EXAMPLES = [SkippableProcessflowExampleComponent];

@NgModule({
  imports: [CommonModule, ProcessflowModule, ButtonModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class ProcessflowExamplesModule {}
