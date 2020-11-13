import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular-public/checkbox';

@Component({
  selector: 'sbb-form-field-text-input-sbb-label-example',
  templateUrl: './form-field-text-input-sbb-label-example.component.html',
})
export class FormFieldTextInputSbbLabelExampleComponent {
  name: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
