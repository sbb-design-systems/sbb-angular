import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular-business/checkbox';

@Component({
  selector: 'sbb-field-text-input-sbb-label-example',
  templateUrl: './field-text-input-sbb-label-example.component.html',
})
export class FieldTextInputSbbLabelExampleComponent {
  name: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
