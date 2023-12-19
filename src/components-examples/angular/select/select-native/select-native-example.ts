import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';
import { SbbTooltipModule } from '@sbb-esta/angular/tooltip';

/**
 * @title Select Native
 * @order 30
 */
@Component({
  selector: 'sbb-select-native-example',
  templateUrl: 'select-native-example.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbCheckboxModule,
    SbbTooltipModule,
    JsonPipe,
  ],
})
export class SelectNativeExample {
  form = this._formBuilder.group({
    value: '',
    optionDisabled: false,
    readonly: false,
  });

  constructor(private _formBuilder: FormBuilder) {}
}
