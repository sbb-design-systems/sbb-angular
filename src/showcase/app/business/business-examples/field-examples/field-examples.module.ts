import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  CheckboxModule,
  DatepickerModule,
  FieldModule,
  SelectModule,
} from '@sbb-esta/angular-business';

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
