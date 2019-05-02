import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-textarea-showcase',
  templateUrl: './textarea-showcase.component.html',
  styleUrls: ['./textarea-showcase.component.scss']
})
export class TextareaShowcaseComponent {

  textArea1 = 'SBB';
  disabled: boolean;
  minlength: number;
  maxlength: number;
  required: boolean;
  isVisible = true;
  readonly: boolean;

  formGroup: FormGroup = new FormGroup({
    textarea: new FormControl('SBB')
  });

  setValue($event) {
    this.formGroup.controls['textarea'].setValue($event.target.value);
  }

}
