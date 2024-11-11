import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Input with error messages
 * @order 20
 */
@Component({
  selector: 'sbb-input-errors-example',
  templateUrl: 'input-errors-example.html',
  styleUrls: ['input-errors-example.css'],
  imports: [FormsModule, SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
})
export class InputErrorsExample {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
}
