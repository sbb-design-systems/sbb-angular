import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular-public/checkbox';

@Component({
  selector: 'sbb-field-text-input-attribute-label-example',
  templateUrl: './field-text-input-attribute-label-example.component.html',
})
export class FieldTextInputAttributeLabelExampleComponent {
  name: FormControl = new FormControl('', [Validators.required]);

  inputMode: 'default' | 'short' | 'medium' | 'long' = 'default';
  modes = ['default', 'short', 'medium', 'long'];

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
