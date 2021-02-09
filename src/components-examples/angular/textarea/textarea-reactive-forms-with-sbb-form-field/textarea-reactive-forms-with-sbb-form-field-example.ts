import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

/**
 * @title Textarea Reactive Forms With Sbb Form Field
 * @order 10
 */
@Component({
  selector: 'sbb-textarea-reactive-forms-with-sbb-form-field-example',
  templateUrl: './textarea-reactive-forms-with-sbb-form-field-example.html',
  styleUrls: ['./textarea-reactive-forms-with-sbb-form-field-example.css'],
})
export class TextareaReactiveFormsWithSbbFormFieldExample {
  form: FormGroup = new FormGroup({
    textarea: new FormControl('', [Validators.required]),
  });
}
