import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular/checkbox';

/**
 * @title Form Field Text Input Attribute Label
 * @order 10
 */
@Component({
  selector: 'sbb-form-field-text-input-attribute-label-example',
  templateUrl: './form-field-text-input-attribute-label-example.html',
})
export class FormFieldTextInputAttributeLabelExample {
  name: FormControl = new FormControl('', [Validators.required]);

  inputSize: '' | 'short' | 'medium' | 'long' = '';

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
