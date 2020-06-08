import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-business/checkbox';
import { DatepickerModule } from '@sbb-esta/angular-business/datepicker';
import { FieldModule } from '@sbb-esta/angular-business/field';

import { provideExamples } from '../../../shared/example-provider';

import { DatepickerBusinessDateAdapterExampleComponent } from './datepicker-business-date-adapter-example/datepicker-business-date-adapter-example.component';
import { DatepickerDateFilterExampleComponent } from './datepicker-date-filter-example/datepicker-date-filter-example.component';
import { DatepickerMasterSlaveExampleComponent } from './datepicker-master-slave-example/datepicker-master-slave-example.component';
import { DatepickerSimpleReactiveExampleComponent } from './datepicker-simple-reactive-example/datepicker-simple-reactive-example.component';
import { DatepickerStandaloneFormsExampleComponent } from './datepicker-standalone-forms-example/datepicker-standalone-forms-example.component';

const EXAMPLES = [
  DatepickerBusinessDateAdapterExampleComponent,
  DatepickerDateFilterExampleComponent,
  DatepickerMasterSlaveExampleComponent,
  DatepickerSimpleReactiveExampleComponent,
  DatepickerStandaloneFormsExampleComponent,
];

const EXAMPLE_INDEX = {
  'datepicker-business-date-adapter-example': DatepickerBusinessDateAdapterExampleComponent,
  'datepicker-date-filter-example': DatepickerDateFilterExampleComponent,
  'datepicker-master-slave-example': DatepickerMasterSlaveExampleComponent,
  'datepicker-simple-reactive-example': DatepickerSimpleReactiveExampleComponent,
  'datepicker-standalone-forms-example': DatepickerStandaloneFormsExampleComponent,
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DatepickerModule,
    FieldModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
  providers: [provideExamples('business', 'datepicker', EXAMPLE_INDEX)],
})
export class DatepickerExamplesModule {}
