import { Component } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular/checkbox';

/**
 * @title Form Field Text Input Sbb Label
 * @order 20
 */
@Component({
  selector: 'sbb-form-field-text-input-sbb-label-example',
  templateUrl: 'form-field-text-input-sbb-label-example.html',
})
export class FormFieldTextInputSbbLabelExample {
  name: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
