import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular-business/button';
import { SbbCheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { SbbDatepickerModule } from '@sbb-esta/angular-business/datepicker';
import { SbbFieldModule } from '@sbb-esta/angular-business/field';
import { SbbSelectModule } from '@sbb-esta/angular-business/select';
import { SbbTimeInputModule } from '@sbb-esta/angular-business/time-input';
import { SbbTooltipModule } from '@sbb-esta/angular-business/tooltip';

import { provideExamples } from '../../../shared/example-provider';

import { FieldDatepickerExampleComponent } from './field-datepicker-example/field-datepicker-example.component';
import { FieldSbbSelectExampleComponent } from './field-sbb-select-example/field-sbb-select-example.component';
import { FieldSelectExampleComponent } from './field-select-example/field-select-example.component';
import { FieldTextInputAttributeLabelExampleComponent } from './field-text-input-attribute-label-example/field-text-input-attribute-label-example.component';
import { FieldTextInputSbbLabelExampleComponent } from './field-text-input-sbb-label-example/field-text-input-sbb-label-example.component';
import { FieldTextareaTooltipExample } from './field-textarea-tooltip-example/field-textarea-tooltip-example.component';
import { FieldTimeInputExampleComponent } from './field-time-input-example/field-time-input-example.component';

const EXAMPLES = [
  FieldTextareaTooltipExample,
  FieldTextInputAttributeLabelExampleComponent,
  FieldTextInputSbbLabelExampleComponent,
  FieldSelectExampleComponent,
  FieldSbbSelectExampleComponent,
  FieldTimeInputExampleComponent,
  FieldDatepickerExampleComponent,
];

const EXAMPLE_INDEX = {
  'field-text-input-attribute-label-example': FieldTextInputAttributeLabelExampleComponent,
  'field-text-input-SBB-label-example': FieldTextInputSbbLabelExampleComponent,
  'field-select-example': FieldSelectExampleComponent,
  'field-SBB-select-example': FieldSbbSelectExampleComponent,
  'field-datepicker-example': FieldDatepickerExampleComponent,
  'field-time-input-example': FieldTimeInputExampleComponent,
  'field-textarea-tooltip-example': FieldTextareaTooltipExample,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbDatepickerModule,
    SbbFieldModule,
    SbbSelectModule,
    SbbTooltipModule,
    SbbTimeInputModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'field', EXAMPLE_INDEX)],
})
export class FieldExamplesModule {}
