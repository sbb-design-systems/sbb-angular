import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { ProcessflowModule } from '@sbb-esta/angular-public/processflow';

import { provideExamples } from '../../../shared/example-provider';

import { ProcessflowExampleComponent } from './processflow-example/processflow-example.component';

const EXAMPLES = [ProcessflowExampleComponent];

const EXAMPLE_INDEX = {
  'processflow-example': ProcessflowExampleComponent,
};

@NgModule({
  imports: [CommonModule, ButtonModule, ProcessflowModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'processflow', EXAMPLE_INDEX)],
})
export class ProcessflowExamplesModule {}
