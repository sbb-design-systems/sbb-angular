import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SbbShowOnDirtyErrorStateMatcher } from '@sbb-esta/angular/core';

/**
 * @title Form Field Dirty Error State Matcher
 * @order 80
 */
@Component({
  selector: 'sbb-form-field-dirty-error-state-example',
  templateUrl: './form-field-dirty-error-state-example.html',
})
export class FormFieldDirtyErrorStateExample {
  name: FormControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  constructor(readonly errorStateMatcher: SbbShowOnDirtyErrorStateMatcher) {}
}
