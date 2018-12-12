import { Component, forwardRef, ChangeDetectionStrategy, Input, ViewChild, NgZone, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { first } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'sbb-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent implements ControlValueAccessor {
  /**
   * Text content in a textarea
   */
  textContent: string;
  /**
   * Class property that represents the autosize textarea
   */
  matTextareaAutosize = true;
  /**
   * Class property that represents an observer on the number of digits in a textarea
   */
  counterObserver$: Subject<number> = new Subject<number>();
  /**
   * Class property that disables the textarea status
   */
  @Input()
  disabled: boolean;
  /**
   * Class property that sets readonly the textarea content
   */
  @Input()
  readonly: boolean;
  /**
   * Class property that sets the maxlength of the textarea content
   */
  @Input()
  maxlength: number;
  /**
   * Class property that sets the minlength of the textarea content
   */
  @Input()
  minlength: number;
  /**
   * Class property that sets required the textarea
   */
  @Input()
  required: boolean;
  /**
   * Identifier of textarea
   */
  @Input()
  inputId: string;
  /**
   * Class property that automatically resize a textarea to fit its content
   */
  @ViewChild('autosize')
  autosize: CdkTextareaAutosize;
  /**
   * Class property that represents the disabled class status
   */
  @HostBinding('class.disabled')
  disabledClass: boolean;
  /**
   * Class property that represents the focused class status
   */
  @HostBinding('class.focused')
  focusedClass: boolean;
  /**
   * Adds the focused CSS class to this element
   */
  onFocus() {
    this.focusedClass = true;
  }
  /**
   * Removes the focused CSS class from this element
   */
  onBlur() {
    this.focusedClass = false;
  }

  constructor(private ngZone: NgZone) { }
  /**
   * Trigger the resize of the textarea to fit the content
   */
  triggerResize() {
    this.ngZone.onStable.pipe(first())
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  /**
   * Class property that represents a change caused by a new digit in a textarea
   */
  propagateChange: any = () => { };

  writeValue(newValue: any) {
    if (newValue !== undefined) {
      this.textContent = newValue;
      this.propagateChange(newValue);
      this.updateDigitsCounter(newValue);
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void { }
  /**
   * Method that listens change in the textarea content
   */
  onChange(event) {
    this.propagateChange(event.target.value);
    this.updateDigitsCounter(event.target.value);
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this.disabledClass = disabled;
  }
  /**
   * Method that updates the max number of digits available in the textarea content
   */
  updateDigitsCounter(newValue) {
    if (!!this.maxlength) {
      this.counterObserver$.next(this.maxlength - newValue.length);

    }
  }
}
