import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular-public/form-field';
import { SBB_BUSINESS_DATE_ADAPTER } from '@sbb-esta/angular/core';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';

import { DatepickerBusinessDateAdapterExample } from './datepicker-business-date-adapter/datepicker-business-date-adapter-example';
import { DatepickerDateFilterExample } from './datepicker-date-filter/datepicker-date-filter-example';
import { DatepickerDateRangeExample } from './datepicker-date-range/datepicker-date-range-example';
import { DatepickerSimpleReactiveExample } from './datepicker-simple-reactive/datepicker-simple-reactive-example';
import { DatepickerStandaloneFormsExample } from './datepicker-standalone-forms/datepicker-standalone-forms-example';

export {
  DatepickerDateFilterExample,
  DatepickerDateRangeExample,
  DatepickerSimpleReactiveExample,
  DatepickerStandaloneFormsExample,
  DatepickerBusinessDateAdapterExample,
};

const EXAMPLES = [
  DatepickerDateFilterExample,
  DatepickerDateRangeExample,
  DatepickerSimpleReactiveExample,
  DatepickerStandaloneFormsExample,
  DatepickerBusinessDateAdapterExample,
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
  providers: [SBB_BUSINESS_DATE_ADAPTER],
})
export class DatepickerExamplesModule {}
