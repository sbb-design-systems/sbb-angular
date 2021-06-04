import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SBB_LEAN_DATE_ADAPTER } from '@sbb-esta/angular/core';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';

import { DatepickerDateFilterExample } from './datepicker-date-filter/datepicker-date-filter-example';
import { DatepickerDateRangeExample } from './datepicker-date-range/datepicker-date-range-example';
import { DatepickerLeanDateAdapterExample } from './datepicker-lean-date-adapter/datepicker-lean-date-adapter-example';
import { DatepickerSimpleReactiveExample } from './datepicker-simple-reactive/datepicker-simple-reactive-example';
import { DatepickerStandaloneFormsExample } from './datepicker-standalone-forms/datepicker-standalone-forms-example';

export {
  DatepickerDateFilterExample,
  DatepickerDateRangeExample,
  DatepickerLeanDateAdapterExample,
  DatepickerSimpleReactiveExample,
  DatepickerStandaloneFormsExample,
};

const EXAMPLES = [
  DatepickerDateFilterExample,
  DatepickerDateRangeExample,
  DatepickerLeanDateAdapterExample,
  DatepickerSimpleReactiveExample,
  DatepickerStandaloneFormsExample,
];

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
  providers: [SBB_LEAN_DATE_ADAPTER],
})
export class DatepickerExamplesModule {}
