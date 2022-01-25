import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbShowOnDirtyErrorStateMatcher } from '@sbb-esta/angular/core';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbSelectModule } from '@sbb-esta/angular/select';
import { SbbTimeInputModule } from '@sbb-esta/angular/time-input';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

import { FormFieldDatepickerExample } from './form-field-datepicker/form-field-datepicker-example';
import { FormFieldDirtyErrorStateExample } from './form-field-dirty-error-state/form-field-dirty-error-state-example';
import { FormFieldGroupVerticalExample } from './form-field-group-vertical/form-field-group-vertical-example';
import { FormFieldGroupExample } from './form-field-group/form-field-group-example';
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
  FormFieldDirtyErrorStateExample,
  FormFieldGroupExample,
  FormFieldGroupVerticalExample,
};

const EXAMPLES = [
  FormFieldTextareaTooltipExample,
  FormFieldTextInputAttributeLabelExample,
  FormFieldTextInputSbbLabelExample,
  FormFieldSelectExample,
  FormFieldSbbSelectExample,
  FormFieldTimeInputExample,
  FormFieldDatepickerExample,
  FormFieldDirtyErrorStateExample,
  FormFieldGroupExample,
  FormFieldGroupVerticalExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbDatepickerModule,
    SbbInputModule,
    SbbSelectModule,
    SbbTooltipModule,
    SbbTimeInputModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [SbbShowOnDirtyErrorStateMatcher],
})
export class FormFieldExamplesModule {}
