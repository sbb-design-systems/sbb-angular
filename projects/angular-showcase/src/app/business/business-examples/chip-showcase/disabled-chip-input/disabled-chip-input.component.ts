import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-chip-disabled',
  templateUrl: './disabled-chip-input.component.html'
})
export class DisabledChipInputComponent {
  formGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.formGroup = this._formBuilder.group({
      chipDisabled: [{ value: ['option-1', 'option-2'], disabled: true }]
    });
  }
}
