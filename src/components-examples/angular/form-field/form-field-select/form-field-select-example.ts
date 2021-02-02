import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * @title Form Field Select
 * @order 30
 */
@Component({
  selector: 'sbb-form-field-select-example',
  templateUrl: './form-field-select-example.html',
})
export class FormFieldSelectExample {
  select: FormControl = new FormControl('', [Validators.required]);
}
