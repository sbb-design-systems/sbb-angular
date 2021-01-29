import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

/**
 * @title Select Native
 * @order 30
 */
@Component({
  selector: 'sbb-select-native-example',
  templateUrl: './select-native-example.html',
})
export class SelectNativeExample {
  form: FormGroup;

  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false,
    });
  }
}
