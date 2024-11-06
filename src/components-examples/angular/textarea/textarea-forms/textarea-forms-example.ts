import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTextareaModule } from '@sbb-esta/angular/textarea';

/**
 * @title Textarea Forms
 * @order 20
 */
@Component({
  selector: 'sbb-textarea-forms-example',
  templateUrl: 'textarea-forms-example.html',
  styleUrls: ['textarea-forms-example.css'],
  imports: [
    SbbTextareaModule,
    FormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbCheckboxModule,
    JsonPipe,
  ],
})
export class TextareaFormsExample {
  textarea = 'SBB';
  minlength: number;
  maxlength: number;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
}
