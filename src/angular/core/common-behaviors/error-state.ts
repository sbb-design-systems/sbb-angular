import { AbstractControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { SbbErrorStateMatcher } from '../error/error-options';

import { AbstractConstructor, Constructor } from './constructor';

/** @docs-private */
export interface CanUpdateErrorState {
  /** Updates the error state based on the provided error state matcher. */
  updateErrorState(): void;
  /** Whether the component is in an error state. */
  errorState: boolean;
  /** An object used to control the error state of the component. */
  errorStateMatcher: SbbErrorStateMatcher;
}

type CanUpdateErrorStateCtor = Constructor<CanUpdateErrorState> &
  AbstractConstructor<CanUpdateErrorState>;

/** @docs-private */
export interface HasErrorState {
  _parentFormGroup: FormGroupDirective;
  _parentForm: NgForm;
  _defaultErrorStateMatcher: SbbErrorStateMatcher;

  // These properties are defined as per the `SbbFormFieldControl` interface. Since
  // this mixin is commonly used with custom form-field controls, we respect the
  // properties (also with the public name they need according to `SbbFormFieldControl`).
  ngControl: NgControl;
  stateChanges: Subject<void>;
}

/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export function mixinErrorState<T extends AbstractConstructor<HasErrorState>>(
  base: T
): CanUpdateErrorStateCtor & T;
export function mixinErrorState<T extends Constructor<HasErrorState>>(
  base: T
): CanUpdateErrorStateCtor & T {
  return class extends base {
    /** Whether the component is in an error state. */
    errorState: boolean = false;

    /** An object used to control the error state of the component. */
    errorStateMatcher: SbbErrorStateMatcher;

    /** Updates the error state based on the provided error state matcher. */
    updateErrorState() {
      const oldState = this.errorState;
      const parent = this._parentFormGroup || this._parentForm;
      const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      const control = this.ngControl ? (this.ngControl.control as AbstractControl) : null;
      const newState = matcher.isErrorState(control, parent);

      if (newState !== oldState) {
        this.errorState = newState;
        this.stateChanges.next();
      }
    }

    constructor(...args: any[]) {
      super(...args);
    }
  };
}
