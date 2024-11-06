import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbOptionModule } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbSelectModule } from '@sbb-esta/angular/select';

/**
 * @title Select Reactive Forms
 * @order 10
 */
@Component({
  selector: 'sbb-select-reactive-forms-example',
  templateUrl: 'select-reactive-forms-example.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbSelectModule,
    SbbOptionModule,
    SbbCheckboxModule,
    JsonPipe,
  ],
})
export class SelectReactiveFormsExample {
  private _formBuilder = inject(FormBuilder);

  form = this._formBuilder.group({
    value: '',
    optionDisabled: false,
    readonly: false,
  });
}
