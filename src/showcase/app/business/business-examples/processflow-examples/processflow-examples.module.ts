import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';

import { SkippableProcessflowComponent } from './skippable-processflow/skippable-processflow.component';

const EXAMPLES = [SkippableProcessflowComponent];

@NgModule({
  imports: [CommonModule, ProcessflowModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class ProcessflowExamplesModule {}
