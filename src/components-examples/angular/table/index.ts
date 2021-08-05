import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbTableModule } from '@sbb-esta/angular/table';

import { TableExample } from './table/table-example';

export { TableExample };

const EXAMPLES = [TableExample];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SbbButtonModule,
    SbbCheckboxModule,
    SbbFormFieldModule,
    SbbRadioButtonModule,
    SbbTableModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class TableExamplesModule {}
