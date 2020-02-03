import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CHIP_INPUT_OPTIONS } from '../chip-input-options';

@Component({
  selector: 'sbb-chip-disabled-showcase',
  templateUrl: 'simple-chip-input-showcase.component.html',
  styleUrls: ['../chip-input-showcase.component.scss']
})
export class SimpleChipInputShowcaseComponent implements OnInit {
  formGroup: FormGroup;
  options = CHIP_INPUT_OPTIONS;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      chip: [['option-1'], Validators.required]
    });
  }
}
