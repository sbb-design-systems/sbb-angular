import { JsonPipe, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

/**
 * @title Vertical Checkbox Group
 * @order 20
 */
@Component({
  selector: 'sbb-checkbox-group-reactive-forms-vertical-example',
  templateUrl: 'checkbox-group-reactive-forms-vertical-example.html',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, SbbCheckboxModule, JsonPipe, KeyValuePipe],
})
export class CheckboxGroupReactiveFormsVerticalExample {
  form = this._formBuilder.group({
    'Check 1': true,
    'Check 2': false,
    'Check 3': false,
  });

  constructor(private _formBuilder: FormBuilder) {}
}
