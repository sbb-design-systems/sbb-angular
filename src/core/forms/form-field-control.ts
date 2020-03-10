import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

export abstract class FormFieldControl<TValue> {
  /** The value of the control. */
  value: TValue | null;
  /**
   * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
   * needs to run change detection.
   */
  readonly stateChanges: Observable<void>;
  /** The id of the form field. */
  readonly id: string;
  /**
   * The id of the inner input field. Can be the same as the id property.
   * @deprecated This will be replaced by an internal getter, based on the id property.
   */
  readonly inputId: string;
  /** The attached NgControl, if any exists. */
  readonly ngControl: NgControl | undefined;
  /** Whether the control is focused. */
  readonly focused: boolean;
  /** Whether the control is empty. */
  readonly empty: boolean;
  /** Whether the control is required. */
  readonly required: boolean;
  /** Whether the control is disabled. */
  readonly disabled: boolean;
  /** Whether the control is in an error state. */
  readonly errorState: boolean;
  /**
   * Whether the input is currently in an autofilled state. If property is not present on the
   * control it is assumed to be false.
   */
  readonly autofilled?: boolean;
  /** Sets the list of element IDs that currently describe this control. */
  abstract setDescribedByIds(ids: string[]): void;

  /** callback is called when a click event occurs on the label. */
  abstract onContainerClick?(event: Event): void;
}
