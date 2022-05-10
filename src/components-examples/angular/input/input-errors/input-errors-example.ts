import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

/**
 * @title Input with error messages
 * @order 20
 */
@Component({
  selector: 'sbb-input-errors-example',
  templateUrl: 'input-errors-example.html',
  styleUrls: ['input-errors-example.css'],
})
export class InputErrorsExample {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
}
