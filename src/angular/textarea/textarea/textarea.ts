// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  inject,
  Input,
  numberAttribute,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { SbbErrorStateMatcher, _ErrorStateTracker } from '@sbb-esta/angular/core';
import { SbbFormFieldControl } from '@sbb-esta/angular/form-field';
import { BehaviorSubject, Subject } from 'rxjs';

let nextId = 0;

@Component({
  selector: 'sbb-textarea',
  templateUrl: './textarea.html',
  styleUrls: ['./textarea.css'],
  providers: [{ provide: SbbFormFieldControl, useExisting: SbbTextarea }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-textarea sbb-input-element',
    /** Needs to be -1 so the `focus` event still fires. */
    tabindex: '-1',
    '[attr.id]': 'id',
    '[attr.aria-describedby]': '_ariaDescribedby || null',
    '[class.sbb-disabled]': 'disabled',
    '[class.sbb-focused]': 'focused',
    '[class.sbb-readonly]': 'readonly',
  },
  imports: [CdkTextareaAutosize],
})
export class SbbTextarea
  implements SbbFormFieldControl<string>, ControlValueAccessor, DoCheck, OnDestroy
{
  ngControl: NgControl = inject(NgControl, { self: true, optional: true })!;
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _elementRef = inject(ElementRef);

  get _labelCharactersRemaining(): string {
    return $localize`:Counter text for textarea@@sbbTextareaCounterText:${this._counter.value} characters remaining`;
  }

  /** Unique id of the element. */
  private _uniqueId = `sbb-textarea-${++nextId}`;

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
    this.stateChanges.next();
  }
  private _id = this._uniqueId;

  /** Id for the inner input field. */
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }

  /**
   * Disable the automatic labeling to avoid issues like #1918.
   * @docs-private
   */
  readonly disableAutomaticLabeling = true;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  private _destroyed = new Subject<void>();
  private _errorStateTracker: _ErrorStateTracker;

  /** The value of the textarea. */
  @Input()
  get value() {
    return this._textarea ? this._textarea.nativeElement.value : '';
  }
  set value(value: string) {
    if (this._textarea) {
      this._textarea.nativeElement.value = value;
      this._updateDigitsCounter(this.value);
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /** Class property that disables the textarea status. */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
  private _disabled = false;

  /** Class property that sets readonly the textarea content. */
  @Input({ transform: booleanAttribute })
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = value;
    this.stateChanges.next();
  }
  private _readonly = false;

  /** Whether the input is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

  /** Class property that sets the maxlength of the textarea content. */
  @Input({ transform: numberAttribute })
  get maxlength(): number {
    return this._maxlength;
  }
  set maxlength(value: number) {
    this._maxlength = value;
    this._updateDigitsCounter(this.value);
    this.stateChanges.next();
  }
  private _maxlength: number;

  /** Class property that sets the minlength of the textarea content. */
  @Input({ transform: numberAttribute })
  get minlength(): number {
    return this._minlength;
  }
  set minlength(value: number) {
    this._minlength = value;
    this.stateChanges.next();
  }
  private _minlength: number;

  /** Class property that sets required the textarea. */
  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = value;
    this.stateChanges.next();
  }
  private _required = false;

  /** Whether the autosizing is disabled or not. Autosizing is based on the CDK Autosize. */
  @Input({ transform: booleanAttribute }) autosizeDisabled: boolean = false;

  @Input()
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value: SbbErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

  /** Whether the textarea is focused. */
  get focused(): boolean {
    return this._focused;
  }
  private _focused: boolean = false;

  /** Whether the textarea has a value. */
  get empty(): boolean {
    return !this.value || this.value === '';
  }

  /** Determines the aria-describedby to be set on the host. */
  _ariaDescribedby: string;
  /** Class property that represents an observer on the number of digits in a textarea. */
  _counter: BehaviorSubject<number> = new BehaviorSubject<number>(this.maxlength);

  /** Placeholder value for the textarea. */
  @Input() placeholder: string = '';
  /** @docs-private */
  @ViewChild('textarea', { static: true }) _textarea: ElementRef<HTMLTextAreaElement>;
  /** Class property that automatically resize a textarea to fit its content. */
  @ViewChild(CdkTextareaAutosize, { static: true }) autosize: CdkTextareaAutosize;

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};
  /** `View -> model callback called when autocomplete has been touched` */
  _onTouched: () => void = () => {};

  constructor(...args: unknown[]);
  constructor() {
    const defaultErrorStateMatcher = inject(SbbErrorStateMatcher);
    const parentForm = inject(NgForm, { optional: true })!;
    const parentFormGroup = inject(FormGroupDirective, { optional: true })!;

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    this._errorStateTracker = new _ErrorStateTracker(
      defaultErrorStateMatcher,
      this.ngControl,
      parentFormGroup,
      parentForm,
      this.stateChanges,
    );
  }

  /**
   * Trigger resize on every check because it's possible that the textarea becomes visible after first rendering.
   * Without triggering resize, the textarea would not be correctly adjusted when it becomes visible only after first rendering.
   * This issue is due to the fact, that before being visible, autosize is deactivated.
   * @docs-private
   */
  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  /**
   * Forward focus if a user clicks on an associated label.
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  onContainerClick(_event: Event) {
    this.focus();
  }

  /**
   * Note: under normal conditions focus shouldn't land on this element, however it may be
   * programmatically set, for example inside of a focus trap, in this case we want to forward
   * the focus to the native element.
   * @docs-private
   */
  @HostListener('focus')
  focus(options?: FocusOptions) {
    this._textarea.nativeElement.focus(options);
  }

  /** Adds the focused CSS class to this element */
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * forward focus if user clicks anywhere on sbb-textarea
   * @docs-private
   */
  @HostListener('click', ['$event'])
  _focusTextarea(target: Event) {
    if (target.target === this._elementRef.nativeElement) {
      this.focus();
    }
  }

  /** Removes the focused CSS class from this element */
  _onBlur() {
    this._focused = false;

    if (!this.disabled) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /** Method that listens change in the textarea content */
  _onInput(event: any) {
    this._onChange(event.target.value);
    this._updateDigitsCounter(event.target.value);
    this.stateChanges.next();
  }

  /** Refreshes the error state of the input. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  writeValue(newValue: any) {
    this.value = newValue == null ? '' : newValue;
  }

  registerOnChange(fn: (_: any) => void) {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]): void {
    this._ariaDescribedby = ids.join(' ');
  }

  /** @docs-private */
  ngOnDestroy() {
    this.stateChanges.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Method that updates the max number of digits available in the textarea content */
  private _updateDigitsCounter(newValue: string) {
    if (!!this.maxlength) {
      this._counter.next(this.maxlength - newValue.length);
    }
  }
}
