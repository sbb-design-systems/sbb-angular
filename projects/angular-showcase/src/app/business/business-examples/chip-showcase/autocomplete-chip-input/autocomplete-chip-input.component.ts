import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CHIP_INPUT_OPTIONS } from '../chip-input-options';

@Component({
  selector: 'sbb-chip-autocomplete',
  templateUrl: 'autocomplete-chip-input.component.html',
  styleUrls: ['../chip-input.component.scss']
})
export class AutocompleteChipInputComponent implements OnInit {
  formGroup: FormGroup;
  options = CHIP_INPUT_OPTIONS;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      chip: [['option-1'], Validators.required]
    });
  }
}
