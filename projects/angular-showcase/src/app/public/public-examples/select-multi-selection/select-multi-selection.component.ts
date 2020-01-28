import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-multi-selection',
  templateUrl: './select-multi-selection.component.html',
  styleUrls: ['./select-multi-selection.component.scss']
})
export class SelectMultiSelectionComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: [[]],
      optionDisabled: false
    });
  }
}
