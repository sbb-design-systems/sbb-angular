import {
  Component,
  forwardRef,
  ChangeDetectionStrategy,
  Input,
  HostBinding,
  ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let counter = 0;

@Component({
  selector: 'sbb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxComponent),
    multi: true,
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent implements ControlValueAccessor {
  /**
   * Identifier of a checkbox field
   */
  @Input() inputId = `sbb-checkbox-${counter++}`;
  /**
   * Value contained in a checkbox field
   */
  @Input() value: any;
  /**
   * Establish if a checkbox value is required or not
   */
  @Input() required: boolean;
  /**
   * Sets checkbox field status to false
   */
  @HostBinding('class.sbb-checkbox-checked') _checked = false;
  /**
   * Sets checkbox field disabled
   */
  @HostBinding('class.sbb-checkbox-disabled') @Input() disabled: boolean;

  /**
   * Sets checkbox field with the value in input
   */
  @Input()
  set checked(value: any) {
    this._checked = value;

    this.changeDetector.markForCheck();
  }
  /**
   * Returns the checked status of a checkbox field
   */
  get checked(): any {
    return this._checked;
  }

  constructor(private changeDetector: ChangeDetectorRef) { }
  /**
   * Property that describes the status change of a checkbox field
   */
  onChange = (_: any) => { };
  /**
   * Property that describes if a checkbox is pressed or not
   */
  onTouched = () => { };

  /**
   * Sets the value in input in the checkbox field
   */
  writeValue(value: any): void {
    this.checked = value;
  }

  /**
   * Method that records the change on a checkbox field
   */
  registerOnChange(fn: (_: any) => {}): void { this.onChange = fn; }
  /**
   * Method that records the touch on a checkbox field
   */
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }
  /**
   * Method that set up a checkbox field to the click
   */
  click($event: Event) {
    const value = (<HTMLInputElement>$event.target).checked;
    this.onChange(value);
    this.onTouched();
    this.writeValue(value);
  }
  /**
   * Method that sets disabled a checkbox
   */
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

}
