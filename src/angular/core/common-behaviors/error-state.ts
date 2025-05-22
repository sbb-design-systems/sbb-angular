import { AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { SbbErrorStateMatcher } from '../error/error-options';

/**
 * Class that tracks the error state of a component.
 * @docs-private
 */
// tslint:disable-next-line:class-name
export class _ErrorStateTracker {
  /** Whether the tracker is currently in an error state. */
  errorState: boolean = false;

  /** User-defined matcher for the error state. */
  matcher: SbbErrorStateMatcher;

  constructor(
    private _defaultMatcher: SbbErrorStateMatcher | null,
    public ngControl: NgControl | null,
    private _parentFormGroup: FormGroupDirective | null,
    private _parentForm: NgForm | null,
    private _stateChanges: Subject<void>,
  ) {}

  /** Updates the error state based on the provided error state matcher. */
  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.matcher || this._defaultMatcher;
    const control = this.ngControl ? (this.ngControl.control as AbstractControl) : null;
    // Note: the null check here shouldn't be necessary, but there's an internal
    // test that appears to pass an object whose `isErrorState` isn't a function.
    const newState =
      typeof matcher?.isErrorState === 'function' ? matcher.isErrorState(control, parent) : false;

    if (newState !== oldState) {
      this.errorState = newState;
      this._stateChanges.next();
    }
  }
}
