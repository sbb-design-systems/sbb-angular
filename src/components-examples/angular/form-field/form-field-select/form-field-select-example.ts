import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Form Field Select
 * @order 30
 */
@Component({
  selector: 'sbb-form-field-select-example',
  templateUrl: 'form-field-select-example.html',
  standalone: true,
  imports: [SbbFormFieldModule, SbbInputModule, FormsModule, ReactiveFormsModule],
})
export class FormFieldSelectExample {
  select: FormControl = new FormControl('', [Validators.required]);
}
