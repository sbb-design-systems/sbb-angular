import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SBB_LEAN_DATE_ADAPTER } from '@sbb-esta/angular/core';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbInputModule } from '@sbb-esta/angular/input';

import { CalendarConfigurationExample } from './calendar-configuration/calendar-configuration-example';
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
  CalendarConfigurationExample,
};

const EXAMPLES = [
  DatepickerDateFilterExample,
  DatepickerDateRangeExample,
  DatepickerLeanDateAdapterExample,
  DatepickerSimpleReactiveExample,
  DatepickerStandaloneFormsExample,
  CalendarConfigurationExample,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
    SbbDatepickerModule,
    SbbInputModule,
    SbbButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [SBB_LEAN_DATE_ADAPTER],
})
export class DatepickerExamplesModule {}
