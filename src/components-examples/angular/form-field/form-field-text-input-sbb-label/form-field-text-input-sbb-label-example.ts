import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbCheckboxChange } from '@sbb-esta/angular/checkbox';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Form Field Text Input Sbb Label
 * @order 20
 */
@Component({
  selector: 'sbb-form-field-text-input-sbb-label-example',
  templateUrl: 'form-field-text-input-sbb-label-example.html',
  imports: [
    SbbFormFieldModule,
    SbbInputModule,
    FormsModule,
    ReactiveFormsModule,
    SbbCheckboxModule,
  ],
})
export class FormFieldTextInputSbbLabelExample {
  name: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  toggleDisabled(sbbCheckboxChange: SbbCheckboxChange) {
    sbbCheckboxChange.checked ? this.name.disable() : this.name.enable();
  }
}
