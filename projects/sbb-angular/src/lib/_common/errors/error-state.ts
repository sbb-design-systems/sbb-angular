import { FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { Constructor } from '../constructor';

import { ErrorStateMatcher } from './error-services';

/** @docs-private */
export interface CanUpdateErrorState {
  readonly stateChanges: Subject<void>;
  errorState: boolean;
  errorStateMatcher: ErrorStateMatcher;
  updateErrorState();
}

/** @docs-private */
export type CanUpdateErrorStateCtor = Constructor<CanUpdateErrorState>;

/** @docs-private */
export interface HasErrorState {
  _parentFormGroup: FormGroupDirective;
  _parentForm: NgForm;
  _defaultErrorStateMatcher: ErrorStateMatcher;
  ngControl: NgControl;
}

/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export function mixinErrorState<T extends Constructor<HasErrorState>>(base: T)
  : Constructor<CanUpdateErrorState> & T {
  return class extends base {
    /** Whether the component is in an error state. */
    errorState = false;

    /**
     * Stream that emits whenever the state of the input changes such that the wrapping
     * `SbbField` needs to run change detection.
     */
    readonly stateChanges = new Subject<void>();

    errorStateMatcher: ErrorStateMatcher;

    updateErrorState() {
      const oldState = this.errorState;
      const parent = this._parentFormGroup || this._parentForm;
      const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      const control = this.ngControl ? this.ngControl.control as FormControl : null;
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
