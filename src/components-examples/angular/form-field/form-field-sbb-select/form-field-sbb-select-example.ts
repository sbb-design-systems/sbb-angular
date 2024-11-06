import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbSelectModule } from '@sbb-esta/angular/select';

/**
 * @title Form Field Sbb Select
 * @order 40
 */
@Component({
  selector: 'sbb-form-field-sbb-select-example',
  templateUrl: 'form-field-sbb-select-example.html',
  imports: [SbbFormFieldModule, SbbSelectModule, FormsModule, ReactiveFormsModule, SbbOptionModule],
})
export class FormFieldSbbSelectExample {
  select: FormControl = new FormControl('', [Validators.required]);
}
