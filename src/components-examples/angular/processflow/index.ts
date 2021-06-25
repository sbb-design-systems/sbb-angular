import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbFormFieldModule, SbbInputModule } from '@sbb-esta/angular/form-field';
import { SbbProcessflowModule } from '@sbb-esta/angular/processflow';

import { ProcessflowEditableExample } from './processflow-editable/processflow-editable-example';
import { ProcessflowLazyContentExample } from './processflow-lazy-content/processflow-lazy-content-example';
import { ProcessflowOverviewExample } from './processflow-overview/processflow-overview-example';

export { ProcessflowEditableExample, ProcessflowOverviewExample, ProcessflowLazyContentExample };

const EXAMPLES = [
  ProcessflowEditableExample,
  ProcessflowOverviewExample,
  ProcessflowLazyContentExample,
];

@NgModule({
  imports: [
    FormsModule,
    SbbButtonModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbProcessflowModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  entryComponents: EXAMPLES,
})
export class ProcessflowExamplesModule {}
