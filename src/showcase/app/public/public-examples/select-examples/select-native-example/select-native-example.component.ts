import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'sbb-select-native-example',
  templateUrl: './select-native-example.component.html',
})
export class SelectNativeExampleComponent {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false,
    });
  }
}
