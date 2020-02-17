import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-chip-simple',
  templateUrl: 'simple-chip-input.component.html',
  styleUrls: ['../chip-input.component.scss']
})
export class SimpleChipInputComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this._formBuilder.group({
      chip: [['option-1'], Validators.required]
    });
  }
}
