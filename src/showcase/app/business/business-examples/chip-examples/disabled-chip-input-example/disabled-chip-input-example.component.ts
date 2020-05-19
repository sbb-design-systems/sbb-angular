import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-chip-disabled-example',
  templateUrl: './disabled-chip-input-example.component.html',
})
export class DisabledChipInputExampleComponent {
  formGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.formGroup = this._formBuilder.group({
      chipDisabled: [{ value: ['option-1', 'option-2'], disabled: true }],
    });
  }
}
