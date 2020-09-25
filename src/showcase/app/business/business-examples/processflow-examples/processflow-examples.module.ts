import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbProcessflowModule } from '@sbb-esta/angular-business/processflow';

import { provideExamples } from '../../../shared/example-provider';

import { SkippableProcessflowExampleComponent } from './skippable-processflow-example/skippable-processflow-example.component';

const EXAMPLES = [SkippableProcessflowExampleComponent];

const EXAMPLE_INDEX = {
  'skippable-processflow-example': SkippableProcessflowExampleComponent,
};

@NgModule({
  imports: [CommonModule, SbbButtonModule, SbbProcessflowModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'processflow', EXAMPLE_INDEX)],
})
export class ProcessflowExamplesModule {}
