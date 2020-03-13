import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular/cdk/coercion';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import {
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  ErrorStateMatcher,
  mixinErrorState
} from '@sbb-esta/angular-core';
import { FormFieldControl } from '@sbb-esta/angular-core/forms';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { auditTime, first, takeUntil } from 'rxjs/operators';

let nextId = 0;

// Boilerplate for applying mixins to TextareaComponent.
/** @docs-private */
export class SbbTextareaBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}

export const SbbTextareaMixinBase: CanUpdateErrorStateCtor &
  typeof SbbTextareaBase = mixinErrorState(SbbTextareaBase);

@Component({
  selector: 'sbb-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
  providers: [{ provide: FormFieldControl, useExisting: TextareaComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent extends SbbTextareaMixinBase
  implements
    FormFieldControl<string>,
    CanUpdateErrorState,
    ControlValueAccessor,
    DoCheck,
    AfterViewInit,
    OnDestroy {
  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  private _destroyed = new Subject<void>();

  /** The value of the textarea. */
  @Input()
  get value() {
    return this._textarea ? this._textarea.nativeElement.value : '';
  }
  set value(value: string) {
    if (this._textarea) {
      this._textarea.nativeElement.value = value;
      this.stateChanges.next();
    }
  }

  /** Class property that disables the textarea status. */
  @HostBinding('class.disabled')
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetector.markForCheck();
    this.stateChanges.next();
  }
  private _disabled = false;

  /** Class property that sets readonly the textarea content. */
  @Input()
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    this.stateChanges.next();
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
    this.stateChanges.next();
  }
  private _maxlength: number;

  /** Class property that sets the minlength of the textarea content. */
  @Input()
  get minlength(): number {
    return this._minlength;
  }
  set minlength(value: number) {
    this._minlength = coerceNumberProperty(value);
    this.stateChanges.next();
  }
  private _minlength: number;

  /** Class property that sets required the textarea. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  /** Unique id of the element. */
  @Input()
  @HostBinding('attr.id')
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
    this.stateChanges.next();
  }
  private _id = `sbb-textarea-id-${++nextId}`;

  /** Whether the textarea is focused. */
  get focused(): boolean {
    return this.focusedClass;
  }
  /** Whether the textarea has a value. */
  get empty(): boolean {
    return !this.value || this.value === '';
  }

  /**
   * Determines the aria-describedby to be set on the host.
   */
  @HostBinding('attr.aria-describedby')
  get getAriaDescribedBy(): string | null {
    return this._ariaDescribedby || null;
  }
  /** The aria-describedby attribute on the select for improved a11y. */
  private _ariaDescribedby: string;

  /**
   * Needs to be -1 so the `focus` event still fires.
   * @docs-private
   */
  @HostBinding('attr.tabindex') _tabIndexAttr = -1;

  /** Placeholder value for the textarea. */
  @Input() placeholder = '';
  /**
   * Identifier of textarea.
   * @deprecated This will be replaced by an internal getter, based on the id property.
   */
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

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    private _changeDetector: ChangeDetectorRef,
    private _ngZone: NgZone,
    private _focusMonitor: FocusMonitor,
    elementRef: ElementRef,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective
  ) {
    super(elementRef, defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * resize the textarea when the browser window size changes. It only works properly by calling reset() first.
   * @docs-private
   */
  ngAfterViewInit() {
    this._ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(auditTime(16), takeUntil(this._destroyed))
        .subscribe(() => {
          this.autosize.reset();
          this.autosize.resizeToFitContent(true);
        });
    });
  }

  /**
   * Trigger resize on every check because it's possible that the textarea becomes visible after first rendering.
   * Without triggering resize, the textarea would not be correctly adjusted when it becomes visible only after first rendering.
   * This issue is due to the fact, that before being visible, autosize is deactivated.
   * @docs-private
   */
  ngDoCheck() {
    this.triggerResize();
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  /**
   * Trigger the resize of the textarea to fit the content
   */
  triggerResize() {
    this._ngZone.onStable.pipe(first()).subscribe(() => this.autosize.resizeToFitContent());
  }

  /**
   * forward focus if user clicks anywhere on sbb-textarea
   * @docs-private
   */
  @HostListener('click', ['$event.target'])
  _focusTextarea(target: ElementRef) {
    if (target === this._elementRef.nativeElement) {
      this._forwardFocusToTextarea();
    }
  }

  /**
   * Forward focus if a user clicks on an associated label.
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  onContainerClick(event: Event) {
    this._forwardFocusToTextarea();
  }

  /**
   * Note: under normal conditions focus shouldn't land on this element, however it may be
   * programmatically set, for example inside of a focus trap, in this case we want to forward
   * the focus to the native element.
   * @docs-private
   */
  @HostListener('focus')
  _forwardFocusToTextarea() {
    this._textarea.nativeElement.focus();
  }

  /**
   * Adds the focused CSS class to this element
   */
  onFocus() {
    this.focusedClass = true;
    this.stateChanges.next();
  }
  /**
   * Removes the focused CSS class from this element
   */
  onBlur() {
    this.focusedClass = false;
    this.onTouched();
    this.stateChanges.next();
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
    this.stateChanges.next();
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

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * @docs-private
   */
  ngOnDestroy() {
    this.stateChanges.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }
}
