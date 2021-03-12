import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbTimeInputModule } from '@sbb-esta/angular/time-input';

import { SimpleTimeInputExample } from './simple-time-input/simple-time-input-example';
import { TimeInputFormsExample } from './time-input-forms/time-input-forms-example';
import { TimeInputReactiveFormsExample } from './time-input-reactive-forms/time-input-reactive-forms-example';

export { SimpleTimeInputExample, TimeInputReactiveFormsExample, TimeInputFormsExample };

const EXAMPLES = [SimpleTimeInputExample, TimeInputReactiveFormsExample, TimeInputFormsExample];

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
})
export class TimeInputExamplesModule {}
