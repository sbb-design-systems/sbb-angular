import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

/**
 * @title Select Native
 * @order 30
 */
@Component({
  selector: 'sbb-select-native-example',
  templateUrl: 'select-native-example.html',
})
export class SelectNativeExample {
  form: UntypedFormGroup;

  constructor(formBuilder: UntypedFormBuilder) {
    this.form = formBuilder.group({
      value: '',
      optionDisabled: false,
      readonly: false,
    });
  }
}
