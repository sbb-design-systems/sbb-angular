import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

/**
 * @title Form Field Sbb Select
 * @order 40
 */
@Component({
  selector: 'sbb-form-field-sbb-select-example',
  templateUrl: 'form-field-sbb-select-example.html',
})
export class FormFieldSbbSelectExample {
  select: UntypedFormControl = new UntypedFormControl('', [Validators.required]);
}
