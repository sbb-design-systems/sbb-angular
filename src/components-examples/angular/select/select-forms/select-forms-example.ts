import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbSelectModule } from '@sbb-esta/angular/select';

/**
 * @title Select Template Driven Forms
 * @order 20
 */
@Component({
  selector: 'sbb-select-forms-example',
  templateUrl: 'select-forms-example.html',
  imports: [
    SbbFormFieldModule,
    SbbSelectModule,
    FormsModule,
    SbbOptionModule,
    SbbCheckboxModule,
    JsonPipe,
  ],
})
export class SelectFormsExample {
  value: string;
  disabled: boolean = false;
  optionDisabled: boolean = false;
}
