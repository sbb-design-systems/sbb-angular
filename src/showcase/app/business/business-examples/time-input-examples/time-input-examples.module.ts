import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular-business/form-field';
import { SbbTimeInputModule } from '@sbb-esta/angular-business/time-input';

import { provideExamples } from '../../../shared/example-provider';

import { TimeInputExampleComponent } from './time-input-example/time-input-example.component';
import { TimeInputFormExampleComponent } from './time-input-form-example/time-input-form-example.component';

const EXAMPLES = [TimeInputExampleComponent, TimeInputFormExampleComponent];

const EXAMPLE_INDEX = {
  'time-input-example': TimeInputExampleComponent,
  'time-input-form-example': TimeInputFormExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbFormFieldModule,
    SbbTimeInputModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'time-input', EXAMPLE_INDEX)],
})
export class TimeInputExamplesModule {}
