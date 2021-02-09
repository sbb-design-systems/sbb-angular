import { Component } from '@angular/core';

/**
 * @title Textarea Forms
 * @order 20
 */
@Component({
  selector: 'sbb-textarea-forms-example',
  templateUrl: './textarea-forms-example.html',
  styleUrls: ['./textarea-forms-example.css'],
})
export class TextareaFormsExample {
  textarea = 'SBB';
  minlength: number;
  maxlength: number;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
}
