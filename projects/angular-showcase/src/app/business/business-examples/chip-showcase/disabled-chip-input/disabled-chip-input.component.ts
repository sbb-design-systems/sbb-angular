import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CHIP_INPUT_OPTIONS } from '../chip-input-options';

@Component({
  selector: 'sbb-chip-disabled',
  templateUrl: 'disabled-chip-input.component.html',
  styleUrls: ['../chip-input.component.scss']
})
export class DisabledChipInputComponent implements OnInit {
  formGroup: FormGroup;
  options = CHIP_INPUT_OPTIONS;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      chipDisabled: [{ value: ['option-1', 'option-2'], disabled: true }]
    });
  }
}
