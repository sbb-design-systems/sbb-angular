import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbTextareaModule } from '@sbb-esta/angular/textarea';

/**
 * @title Textarea Reactive Forms With Sbb Form Field
 * @order 10
 */
@Component({
  selector: 'sbb-textarea-reactive-forms-with-sbb-form-field-example',
  templateUrl: 'textarea-reactive-forms-with-sbb-form-field-example.html',
  styleUrls: ['textarea-reactive-forms-with-sbb-form-field-example.css'],
  imports: [FormsModule, ReactiveFormsModule, SbbFormFieldModule, SbbTextareaModule, JsonPipe],
})
export class TextareaReactiveFormsWithSbbFormFieldExample {
  form: FormGroup = new FormGroup({
    textarea: new FormControl('', [Validators.required]),
  });
}
