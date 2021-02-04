import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * @title Form Field Sbb Select
 * @order 40
 */
@Component({
  selector: 'sbb-form-field-sbb-select-example',
  templateUrl: './form-field-sbb-select-example.html',
})
export class FormFieldSbbSelectExample {
  select: FormControl = new FormControl('', [Validators.required]);
}
