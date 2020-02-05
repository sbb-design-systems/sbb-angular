import { RadioButton } from './radio-button';

export interface RadioGroup {
  name: string;
  value: any;
  selected: RadioButton;
  disabled: boolean;
  required: boolean;
  _controlValueAccessorChangeFn: (value: any) => void;

  _checkSelectedRadioButton(): void;

  /**
   * Mark this group as being "touched" (for ngModel). Meant to be called by the contained
   * radio buttons upon their blur.
   */
  _touch(): void;

  /** Dispatch change event with current selection and group value. */
  _emitChangeEvent(): void;

  _markRadiosForCheck(): void;
}
