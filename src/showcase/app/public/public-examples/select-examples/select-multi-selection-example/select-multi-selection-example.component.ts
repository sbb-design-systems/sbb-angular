import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-multi-selection-example',
  templateUrl: './select-multi-selection-example.component.html'
})
export class SelectMultiSelectionExampleComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: [[]],
      optionDisabled: false
    });
  }
}
