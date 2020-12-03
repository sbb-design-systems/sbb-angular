import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'sbb-reactive-forms-chip-input-example',
  templateUrl: './reactive-forms-chip-input-example.component.html',
})
export class ReactiveFormsChipInputExampleComponent {
  formGroup: FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.formGroup = this._formBuilder.group({
      chip: [['option-1'], Validators.required],
    });
  }
}
