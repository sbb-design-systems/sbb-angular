import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbProcessflowModule } from '@sbb-esta/angular/processflow';

import { ProcessflowExample } from './processflow/processflow-example';

export { ProcessflowExample };

const EXAMPLES = [ProcessflowExample];

@NgModule({
  imports: [CommonModule, SbbButtonModule, SbbProcessflowModule],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class ProcessflowExamplesModule {}
