import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from '@sbb-esta/angular-public/button';
import { CheckboxModule } from '@sbb-esta/angular-public/checkbox';
import { DatepickerModule } from '@sbb-esta/angular-public/datepicker';
import { FieldModule } from '@sbb-esta/angular-public/field';
import { SelectModule } from '@sbb-esta/angular-public/select';

import { FieldExampleComponent } from './field-example/field-example.component';

const EXAMPLES = [FieldExampleComponent];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FieldModule,
    CheckboxModule,
    DatepickerModule,
    SelectModule,
    ButtonModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class FieldExamplesModule {}
