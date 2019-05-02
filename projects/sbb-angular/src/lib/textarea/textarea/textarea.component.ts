import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  HostBinding,
  Input,
  NgZone,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

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
   * Class property that disables the textarea status
   */
  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;
  /**
   * Class property that sets readonly the textarea content
   */
  @Input() readonly: boolean;
  /**
   * Class property that sets the maxlength of the textarea content
   */
  @Input() maxlength: number;
  /**
  * Class property that represents an observer on the number of digits in a textarea
  */
  counterObserver$: BehaviorSubject<number> = new BehaviorSubject<number>(this.maxlength);
  /**
   * Class property that sets the minlength of the textarea content
   */
  @Input() minlength: number;
  /**
   * Class property that sets required the textarea
   */
  @Input() required: boolean;
  /**
   * Placeholder value for the textarea.
   */
  @Input() placeholder: string;
  /**
   * Identifier of textarea
   */
  @Input() inputId: string;
  /**
   * Class property that automatically resize a textarea to fit its content
   */
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  /**
   * Class property that represents the focused class status
   */
  @HostBinding('class.focused') focusedClass: boolean;
  /**
   * Class property that represents a change caused by a new digit in a textarea
   */
  propagateChange: any = () => { };
  /**
   * The registered callback function called when a blur event occurs on the input element.
   */
  onTouched = () => { };

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _ngZone: NgZone,
  ) { }

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
    this.onTouched();
  }
  /**
   * Trigger the resize of the textarea to fit the content
   */
  triggerResize() {
    this._ngZone.onStable.pipe(first())
      .subscribe(() => this.autosize.resizeToFitContent(true));
  }

  writeValue(newValue: any) {
    this.textContent = newValue == null ? '' : newValue;
    this.updateDigitsCounter(this.textContent);
    this._changeDetector.markForCheck();
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  /**
   * Method that listens change in the textarea content
   */
  onChange(event: any) {
    this.propagateChange(event.target.value);
    this.updateDigitsCounter(event.target.value);
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
    this._changeDetector.markForCheck();
  }
  /**
   * Method that updates the max number of digits available in the textarea content
   */
  updateDigitsCounter(newValue: string) {
    if (!!this.maxlength) {
      this.counterObserver$.next(this.maxlength - newValue.length);
    }
  }
}
