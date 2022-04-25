import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

/**
 * @title Form Field Group
 * @order 90
 */
@Component({
  selector: 'sbb-form-field-group-example',
  templateUrl: 'form-field-group-example.html',
})
export class FormFieldGroupExample {
  formGroup: UntypedFormGroup;
  lastSubmission?: { name: string; date: Date };

  constructor(formBuilder: UntypedFormBuilder) {
    this.formGroup = formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      date: [new Date(), Validators.required],
    });
  }

  handleSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.lastSubmission = this.formGroup.value;
  }
}
