import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular-public/checkbox';

@Component({
  selector: 'sbb-form-field-text-input-attribute-label-example',
  templateUrl: './form-field-text-input-attribute-label-example.component.html',
})
export class FormFieldTextInputAttributeLabelExampleComponent {
  name: FormControl = new FormControl('', [Validators.required]);

  inputSize: '' | 'short' | 'medium' | 'long' = '';

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
