import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@sbb-esta/angular-business/button';
import { ProcessflowModule } from '@sbb-esta/angular-business/processflow';

import { provideExamples } from '../../../shared/example-provider';

import { SkippableProcessflowExampleComponent } from './skippable-processflow-example/skippable-processflow-example.component';

const EXAMPLES = [SkippableProcessflowExampleComponent];

const EXAMPLE_INDEX = {
  'skippable-processflow-example': SkippableProcessflowExampleComponent,
};

@NgModule({
  imports: [CommonModule, ButtonModule, ProcessflowModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'processflow', EXAMPLE_INDEX)],
})
export class ProcessflowExamplesModule {}
