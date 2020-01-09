import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostBinding,
  Input,
  NgZone,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

let nextId = 0;

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
  /** The value of the textarea. */
  @Input()
  get value() {
    return this._textarea ? this._textarea.nativeElement.value : '';
  }
  set value(value: string) {
    if (this._textarea) {
      this._textarea.nativeElement.value = value;
    }
  }

  /**
   * Text content in a textarea.
   * @deprecated Use value instead.
   */
  get textContent(): string {
    return this.value;
  }
  set textContent(value: string) {
    this.value = value;
  }
  /** Class property that represents the autosize textarea. */
  matTextareaAutosize = true;

  /** Class property that disables the textarea status. */
  @HostBinding('class.disabled')
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetector.markForCheck();
  }
  private _disabled = false;
  /** Class property that sets readonly the textarea content. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
  }
  private _readonly = false;
  /** Class property that sets the maxlength of the textarea content. */
  @Input()
  get maxlength(): number {
    return this._maxlength;
  }
  set maxlength(value: number) {
    this._maxlength = coerceNumberProperty(value);
    this.updateDigitsCounter(this.value);
  }
  private _maxlength: number;
  /** Class property that sets the minlength of the textarea content. */
  @Input()
  get minlength(): number {
    return this._minlength;
  }
  set minlength(value: number) {
    this._minlength = coerceNumberProperty(value);
  }
  private _minlength: number;
  /** Class property that sets required the textarea. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  private _required = false;
  /** Placeholder value for the textarea. */
  @Input() placeholder = '';
  /** Identifier of textarea. */
  @Input() inputId = `sbb-textarea-input-id-${++nextId}`;
  /** @docs-private */
  @ViewChild('textarea', { static: true }) _textarea: ElementRef<HTMLTextAreaElement>;
  /** Class property that automatically resize a textarea to fit its content. */
  @ViewChild('autosize', { static: true }) autosize: CdkTextareaAutosize;
  /** Class property that represents the focused class status. */
  @HostBinding('class.focused') focusedClass: boolean;
  /** Class property that represents an observer on the number of digits in a textarea. */
  counterObserver$: BehaviorSubject<number> = new BehaviorSubject<number>(this.maxlength);
  /** Class property that represents a change caused by a new digit in a textarea. */
  propagateChange: any = () => {};
  /** The registered callback function called when a blur event occurs on the input element. */
  onTouched = () => {};

  constructor(private _changeDetector: ChangeDetectorRef, private _ngZone: NgZone) {}

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
    this._ngZone.onStable.pipe(first()).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  writeValue(newValue: any) {
    this.value = newValue == null ? '' : newValue;
    this.updateDigitsCounter(this.value);
  }

  registerOnChange(fn: (_: any) => void) {
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
    this.autosize.reset();
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
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
