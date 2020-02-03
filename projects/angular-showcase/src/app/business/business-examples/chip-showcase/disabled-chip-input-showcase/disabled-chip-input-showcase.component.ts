import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CHIP_INPUT_OPTIONS } from '../chip-input-options';

@Component({
  selector: 'sbb-chip-disabled-showcase',
  templateUrl: 'disabled-chip-input-showcase.component.html',
  styleUrls: ['../chip-input-showcase.component.scss']
})
export class DisabledChipInputShowcaseComponent implements OnInit {
  formGroup: FormGroup;
  options = CHIP_INPUT_OPTIONS;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      chipDisabled: [{ value: ['option-1', 'option-2'], disabled: true }]
    });
  }
}
