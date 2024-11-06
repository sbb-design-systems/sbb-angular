import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SbbShowOnDirtyErrorStateMatcher } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/**
 * @title Form Field Dirty Error State Matcher
 * @order 80
 */
@Component({
  selector: 'sbb-form-field-dirty-error-state-example',
  templateUrl: 'form-field-dirty-error-state-example.html',
  providers: [SbbShowOnDirtyErrorStateMatcher],
  imports: [SbbFormFieldModule, SbbInputModule, FormsModule, ReactiveFormsModule],
})
export class FormFieldDirtyErrorStateExample {
  readonly errorStateMatcher = inject(SbbShowOnDirtyErrorStateMatcher);

  name: FormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);
}
