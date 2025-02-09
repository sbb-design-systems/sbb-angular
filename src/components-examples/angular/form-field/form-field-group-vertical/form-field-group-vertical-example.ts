import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbDatepickerModule } from '@sbb-esta/angular/datepicker';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Form Field Group Vertical
 * @order 100
 */
@Component({
  selector: 'sbb-form-field-group-vertical-example',
  templateUrl: 'form-field-group-vertical-example.html',
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
export class FormFieldGroupVerticalExample {
  private _formBuilder = inject(FormBuilder);

  formGroup = this._formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    date: [new Date(), Validators.required],
  });

  lastSubmission?: { name?: string | null; date?: Date | null };

  handleSubmit() {
    if (!this.formGroup.valid) {
      return;
    }
    this.lastSubmission = this.formGroup.value;
  }
}
