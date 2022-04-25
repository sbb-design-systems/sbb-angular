import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

/**
 * @title Form Field Group
 * @order 90
 */
@Component({
  selector: 'sbb-form-field-group-example',
  templateUrl: 'form-field-group-example.html',
})
export class FormFieldGroupExample {
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
