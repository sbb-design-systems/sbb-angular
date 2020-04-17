import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProcessflowModule } from '@sbb-esta/angular-public/processflow';

import { ProcessflowExampleComponent } from './processflow-example/processflow-example.component';

const EXAMPLES = [ProcessflowExampleComponent];

@NgModule({
  imports: [CommonModule, ProcessflowModule],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class ProcessflowExamplesModule {}
