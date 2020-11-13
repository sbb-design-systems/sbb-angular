import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-textarea-reactive-forms-with-sbb-form-field-example',
  templateUrl: './textarea-reactive-forms-with-sbb-form-field-example.component.html',
  styleUrls: ['./textarea-reactive-forms-with-sbb-form-field-example.component.css'],
})
export class TextareaReactiveFormsWithSbbFormFieldExampleComponent {
  form: FormGroup = new FormGroup({
    textarea: new FormControl('', [Validators.required]),
  });
}
