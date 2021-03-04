import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbDatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { SbbTimeInputModule } from '@sbb-esta/angular-public/time-input';
import { SbbTooltipModule } from '@sbb-esta/angular-public/tooltip';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbSelectModule } from '@sbb-esta/angular/select';

import { FormFieldDatepickerExample } from './form-field-datepicker/form-field-datepicker-example';
import { FormFieldSbbSelectExample } from './form-field-sbb-select/form-field-sbb-select-example';
import { FormFieldSelectExample } from './form-field-select/form-field-select-example';
import { FormFieldTextInputAttributeLabelExample } from './form-field-text-input-attribute-label/form-field-text-input-attribute-label-example';
import { FormFieldTextInputSbbLabelExample } from './form-field-text-input-sbb-label/form-field-text-input-sbb-label-example';
import { FormFieldTextareaTooltipExample } from './form-field-textarea-tooltip/form-field-textarea-tooltip-example';
import { FormFieldTimeInputExample } from './form-field-time-input/form-field-time-input-example';

export {
  FormFieldTextareaTooltipExample,
  FormFieldTextInputAttributeLabelExample,
  FormFieldTextInputSbbLabelExample,
  FormFieldSelectExample,
  FormFieldSbbSelectExample,
  FormFieldTimeInputExample,
  FormFieldDatepickerExample,
};

const EXAMPLES = [
  FormFieldTextareaTooltipExample,
  FormFieldTextInputAttributeLabelExample,
  FormFieldTextInputSbbLabelExample,
  FormFieldSelectExample,
  FormFieldSbbSelectExample,
  FormFieldTimeInputExample,
  FormFieldDatepickerExample,
];

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
})
export class FormFieldExamplesModule {}
