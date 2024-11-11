import { Component } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SbbErrorStateMatcher } from '@sbb-esta/angular/core';
import { SbbFormFieldModule } from '@sbb-esta/angular/form-field';
import { SbbInputModule } from '@sbb-esta/angular/input';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements SbbErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
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
  imports: [FormsModule, SbbFormFieldModule, SbbInputModule, ReactiveFormsModule],
})
export class InputErrorStateMatcherExample {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();
}
