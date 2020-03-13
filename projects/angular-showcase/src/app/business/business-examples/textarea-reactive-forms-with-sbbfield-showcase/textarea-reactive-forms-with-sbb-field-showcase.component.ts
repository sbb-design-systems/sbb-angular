import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-textarea-reactive-forms-with-sbb-field-showcase',
  templateUrl: './textarea-reactive-forms-with-sbb-field-showcase.component.html',
  styleUrls: ['./textarea-reactive-forms-with-sbb-field-showcase.component.scss']
})
export class TextareaReactiveFormsWithSbbFieldShowcaseComponent {
  form: FormGroup = new FormGroup({
    textarea: new FormControl('', [Validators.required])
  });
}
