import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

/**
 * @title Select Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-select-reactive-forms-example',
  templateUrl: 'select-reactive-forms-example.html',
})
export class SelectReactiveFormsExample {
  form = this._formBuilder.group({
    value: '',
    optionDisabled: false,
    readonly: false,
  });

  constructor(private _formBuilder: FormBuilder) {}
}
