import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-public/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbDatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SbbSelectModule } from '@sbb-esta/angular-public/select';
import { SbbTimeInputModule } from '@sbb-esta/angular-public/time-input';
import { SbbTooltipModule } from '@sbb-esta/angular-public/tooltip';

import { provideExamples } from '../../../shared/example-provider';

import { FormFieldDatepickerExampleComponent } from './form-field-datepicker-example/form-field-datepicker-example.component';
import { FormFieldSbbSelectExampleComponent } from './form-field-sbb-select-example/form-field-sbb-select-example.component';
import { FormFieldSelectExampleComponent } from './form-field-select-example/form-field-select-example.component';
import { FormFieldTextInputAttributeLabelExampleComponent } from './form-field-text-input-attribute-label-example/form-field-text-input-attribute-label-example.component';
import { FormFieldTextInputSbbLabelExampleComponent } from './form-field-text-input-sbb-label-example/form-field-text-input-sbb-label-example.component';
import { FormFieldTextareaTooltipExample } from './form-field-textarea-tooltip-example/form-field-textarea-tooltip-example.component';
import { FormFieldTimeInputExampleComponent } from './form-field-time-input-example/form-field-time-input-example.component';

const EXAMPLES = [
  FormFieldTextareaTooltipExample,
  FormFieldTextInputAttributeLabelExampleComponent,
  FormFieldTextInputSbbLabelExampleComponent,
  FormFieldSelectExampleComponent,
  FormFieldSbbSelectExampleComponent,
  FormFieldTimeInputExampleComponent,
  FormFieldDatepickerExampleComponent,
];

const EXAMPLE_INDEX = {
  'form-field-text-input-attribute-label-example': FormFieldTextInputAttributeLabelExampleComponent,
  'form-field-text-input-sbb-label-example': FormFieldTextInputSbbLabelExampleComponent,
  'form-field-select-example': FormFieldSelectExampleComponent,
  'form-field-sbb-select-example': FormFieldSbbSelectExampleComponent,
  'form-field-datepicker-example': FormFieldDatepickerExampleComponent,
  'form-field-time-input-example': FormFieldTimeInputExampleComponent,
  'form-field-textarea-tooltip-example': FormFieldTextareaTooltipExample,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbDatepickerModule,
    SbbFormFieldModule,
    SbbSelectModule,
    SbbTooltipModule,
    SbbTimeInputModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'form-field', EXAMPLE_INDEX)],
})
export class FormFieldExamplesModule {}
