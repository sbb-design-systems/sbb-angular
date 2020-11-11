import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbDatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';

import { provideExamples } from '../../../shared/example-provider';

import { DatepickerDateFilterExampleComponent } from './datepicker-date-filter-example/datepicker-date-filter-example.component';
import { DatepickerDateRangeExampleComponent } from './datepicker-date-range-example/datepicker-date-range-example.component';
import { DatepickerSimpleReactiveExampleComponent } from './datepicker-simple-reactive-example/datepicker-simple-reactive-example.component';
import { DatepickerStandaloneFormsExampleComponent } from './datepicker-standalone-forms-example/datepicker-standalone-forms-example.component';

const EXAMPLES = [
  DatepickerDateFilterExampleComponent,
  DatepickerDateRangeExampleComponent,
  DatepickerSimpleReactiveExampleComponent,
  DatepickerStandaloneFormsExampleComponent,
];

const EXAMPLE_INDEX = {
  'datepicker-simple-reactive-example': DatepickerSimpleReactiveExampleComponent,
  'datepicker-date-range-example': DatepickerDateRangeExampleComponent,
  'datepicker-date-filter-example': DatepickerDateFilterExampleComponent,
  'datepicker-standalone-forms-example': DatepickerStandaloneFormsExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbDatepickerModule,
    SbbFormFieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('public', 'datepicker', EXAMPLE_INDEX)],
})
export class DatepickerExamplesModule {}
