import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';

/** An interface which allows a control to work inside of a `SbbField`. */
export abstract class SbbFormFieldControl<TValue> {
  /** The value of the control. */
  value: TValue | null;
  /**
   * Stream that emits whenever the state of the control changes such that the parent `SbbField`
   * needs to run change detection.
   */
  readonly stateChanges: Observable<void>;
  /** The id of the form field. */
  readonly id: string;
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
   * An optional name for the control type that can be used to distinguish `sbb-form-field` elements
   * based on their control type. The form field will add a class,
   * `sbb-form-field-type-{{controlType}}` to its root element.
   */
  readonly controlType?: string;
  /**
   * Whether the input is currently in an autofilled state. If property is not present on the
   * control it is assumed to be false.
   */
  readonly autofilled?: boolean;
  /**
   * Value of `aria-describedby` that should be merged with the described-by ids
   * which are set by the form-field.
   */
  readonly userAriaDescribedBy?: string;

  /** Sets the list of element IDs that currently describe this control. */
  abstract setDescribedByIds(ids: string[]): void;

  /** callback is called when a click event occurs on the label. */
  abstract onContainerClick(event: Event): void;
}
