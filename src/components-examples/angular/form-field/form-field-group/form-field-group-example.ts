import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Form Field Group
 * @order 90
 */
@Component({
  selector: 'sbb-form-field-group-example',
  templateUrl: 'form-field-group-example.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SbbFormFieldModule,
    SbbInputModule,
    SbbDatepickerModule,
    SbbButtonModule,
    JsonPipe,
  ],
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
