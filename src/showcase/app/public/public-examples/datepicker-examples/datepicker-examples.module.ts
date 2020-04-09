import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { DatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { FieldModule } from '@sbb-esta/angular-public/field';

import { DatepickerExampleComponent } from './datepicker-example/datepicker-example.component';

const EXAMPLES = [DatepickerExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DatepickerModule,
    FieldModule
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES
})
export class DatepickerExamplesModule {}
