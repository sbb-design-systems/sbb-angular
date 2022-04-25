import { Component } from '@angular/core';
import { FormGroupDirective, NgForm, UntypedFormControl, Validators } from '@angular/forms';
import { SbbErrorStateMatcher } from '@sbb-esta/angular/core';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements SbbErrorStateMatcher {
  isErrorState(
    control: UntypedFormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/**
 * @title Input with a custom ErrorStateMatcher
 * @order 40
 */
@Component({
  selector: 'sbb-input-error-state-matcher-example',
  templateUrl: 'input-error-state-matcher-example.html',
  styleUrls: ['input-error-state-matcher-example.css'],
})
export class InputErrorStateMatcherExample {
  emailFormControl = new UntypedFormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();
}
