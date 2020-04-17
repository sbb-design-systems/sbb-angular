import { Component } from '@angular/core';

@Component({
  selector: 'sbb-textarea-forms-example',
  templateUrl: './textarea-forms-example.component.html',
  styleUrls: ['./textarea-forms-example.component.css']
})
export class TextareaFormsExampleComponent {
  textarea = 'SBB';
  minlength: number;
  maxlength: number;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
}
