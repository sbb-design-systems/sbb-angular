import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * @title Form Field Group Vertical
 * @order 100
 */
@Component({
  selector: 'sbb-form-field-group-vertical-example',
  templateUrl: 'form-field-group-vertical-example.html',
})
export class FormFieldGroupVerticalExample {
  formGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: [new Date(), Validators.required],
  });

  lastSubmission?: { name?: string | null; date?: Date | null };

  constructor(private _formBuilder: FormBuilder) {}

  handleSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.lastSubmission = this.formGroup.value;
  }
}
