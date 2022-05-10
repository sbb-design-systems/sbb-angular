import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

/**
 * @title Select Native
 * @order 30
 */
@Component({
  selector: 'sbb-select-native-example',
  templateUrl: 'select-native-example.html',
})
export class SelectNativeExample {
  form = this._formBuilder.group({
    value: '',
    optionDisabled: false,
    readonly: false,
  });

  constructor(private _formBuilder: FormBuilder) {}
}
