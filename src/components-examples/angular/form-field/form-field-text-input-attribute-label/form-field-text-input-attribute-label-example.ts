import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular/checkbox';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Form Field Text Input Attribute Label
 * @order 10
 */
@Component({
  selector: 'sbb-form-field-text-input-attribute-label-example',
  templateUrl: 'form-field-text-input-attribute-label-example.html',
  imports: [
    SbbFormFieldModule,
    NgClass,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
  ],
})
export class FormFieldTextInputAttributeLabelExample {
  name: FormControl = new FormControl('', [Validators.required]);
  readonly: FormControl = new FormControl(false);

  inputSize: '' | 'short' | 'medium' | 'long' = '';

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
