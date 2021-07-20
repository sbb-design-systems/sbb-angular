import { FormControl, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { Subject } from 'rxjs';

import { SbbErrorStateMatcher } from '../error/error-options';

import { AbstractConstructor, Constructor } from './constructor';

/** @docs-private */
export interface CanUpdateErrorState {
  readonly stateChanges: Subject<void>;
  errorState: boolean;
  errorStateMatcher: SbbErrorStateMatcher;
  updateErrorState(): void;
}

/** @docs-private */
export interface HasErrorState {
  _parentFormGroup: FormGroupDirective;
  _parentForm: NgForm;
  _defaultErrorStateMatcher: SbbErrorStateMatcher;
  ngControl: NgControl;
}

/**
 * Mixin to augment a directive with updateErrorState method.
 * For component with `errorState` and need to update `errorState`.
 */
export function mixinErrorState<T extends AbstractConstructor<HasErrorState>>(
  base: T
): AbstractConstructor<CanUpdateErrorState> & T;
export function mixinErrorState<T extends Constructor<HasErrorState>>(
  base: T
): Constructor<CanUpdateErrorState> & T {
  return class extends base {
    /** Whether the component is in an error state. */
    errorState: boolean = false;

    /**
     * Stream that emits whenever the state of the input changes such that the wrapping
     * `SbbField` needs to run change detection.
     */
    readonly stateChanges = new Subject<void>();

    errorStateMatcher: SbbErrorStateMatcher;

    updateErrorState() {
      const oldState = this.errorState;
      const parent = this._parentFormGroup || this._parentForm;
      const matcher = this.errorStateMatcher || this._defaultErrorStateMatcher;
      const control = this.ngControl ? (this.ngControl.control as FormControl) : null;
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
