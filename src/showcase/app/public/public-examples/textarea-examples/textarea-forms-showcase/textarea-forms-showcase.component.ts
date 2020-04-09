import { Component } from '@angular/core';

@Component({
  selector: 'sbb-textarea-forms-showcase',
  templateUrl: './textarea-forms-showcase.component.html',
  styleUrls: ['./textarea-forms-showcase.component.css']
})
export class TextareaFormsShowcaseComponent {
  textarea = 'SBB';
  minlength: number;
  maxlength: number;
  required: boolean;
  disabled: boolean;
  readonly: boolean;
}
