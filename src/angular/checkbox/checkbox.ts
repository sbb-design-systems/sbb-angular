import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CanDisable, HasTabIndex, mixinDisabled, mixinTabIndex } from '@sbb-esta/angular/core';

import {
  SbbCheckboxDefaultOptions,
  SBB_CHECKBOX_DEFAULT_OPTIONS,
  SBB_CHECKBOX_DEFAULT_OPTIONS_FACTORY,
} from './checkbox-config';

// Increasing integer for generating unique ids for checkbox components.
let nextUniqueId = 0;

// Default checkbox configuration.
const defaults = SBB_CHECKBOX_DEFAULT_OPTIONS_FACTORY();

/**
 * Provider Expression that allows sbb-checkbox to register as a ControlValueAccessor.
 * This allows it to support [(ngModel)].
 * @docs-private
 */
export const SBB_CHECKBOX_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SbbCheckbox),
  multi: true,
};

/** Change event object emitted by SbbCheckbox. */
export class SbbCheckboxChange {
  /** The source SbbCheckbox of the event. */
  source: SbbCheckbox;
  /** The new `checked` value of the checkbox. */
  checked: boolean;
}

// Boilerplate for applying mixins to SbbCheckbox.
// tslint:disable-next-line: naming-convention
const _SbbCheckboxMixinBase = mixinTabIndex(mixinDisabled(class {}));

/** Base class with all of the `SbbCheckbox` functionality. */
@Directive()
// tslint:disable-next-line: naming-convention class-name
export class _SbbCheckboxBase
  extends _SbbCheckboxMixinBase
  implements
    ControlValueAccessor,
    AfterViewInit,
    OnDestroy,
    CanDisable,
    HasTabIndex,
    FocusableOption
{
  /**
   * Attached to the aria-label attribute of the host element. In most cases, aria-labelledby will
   * take precedence so this may be omitted.
   */
  @Input('aria-label') ariaLabel: string = '';

  /**
   * Users can specify the `aria-labelledby` attribute which will be forwarded to the input element
   */
  @Input('aria-labelledby') ariaLabelledby: string | null = null;

  /** The 'aria-describedby' attribute is read after the element's label and field type. */
  @Input('aria-describedby') ariaDescribedby: string;

  private _uniqueId: string = `sbb-checkbox-${++nextUniqueId}`;

  /** A unique id for the checkbox input. If none is supplied, it will be auto-generated. */
  @Input() id: string = this._uniqueId;

  /** Returns the unique id for the visual hidden input. */
  get inputId(): string {
    return `${this.id || this._uniqueId}-input`;
  }

  /** Whether the checkbox is required. */
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  private _required: boolean;

  /** Whether the label should appear after or before the checkbox. Defaults to 'after' */
  @Input() labelPosition: 'before' | 'after' = 'after';

  /** Name value will be applied to the input element if present */
  @Input() name: string | null = null;

  /** Event emitted when the checkbox's `checked` value changes. */
  @Output()
  readonly change: EventEmitter<SbbCheckboxChange> = new EventEmitter<SbbCheckboxChange>();

  /** Event emitted when the checkbox's `indeterminate` value changes. */
  @Output() readonly indeterminateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** The value attribute of the native input element */
  @Input() value: string;

  /** The native `<input type="checkbox">` element */
  @ViewChild('input') _inputElement: ElementRef<HTMLInputElement>;

  /**
   * Called when the checkbox is blurred. Needed to properly implement ControlValueAccessor.
   * @docs-private
   */
  _onTouched: () => any = () => {};

  private _controlValueAccessorChangeFn: (value: any) => void = () => {};

  constructor(
    private _elementRef: ElementRef<HTMLElement>,
    protected _changeDetectorRef: ChangeDetectorRef,
    private _focusMonitor: FocusMonitor,
    @Attribute('tabindex') tabIndex: string,
    @Optional()
    @Inject(SBB_CHECKBOX_DEFAULT_OPTIONS)
    private _options?: SbbCheckboxDefaultOptions
  ) {
    super();
    this._options = this._options || defaults;
    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (!focusOrigin) {
        // When a focused element becomes disabled, the browser *immediately* fires a blur event.
        // Angular does not expect events to be raised during change detection, so any state change
        // (such as a form control's 'ng-touched') will cause a changed-after-checked error.
        // See https://github.com/angular/angular/issues/17793. To work around this, we defer
        // telling the form control it has been touched until the next tick.
        Promise.resolve().then(() => {
          this._onTouched();
          this._changeDetectorRef.markForCheck();
        });
      }
    });

    this._syncIndeterminate(this._indeterminate);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  /**
   * Whether the checkbox is checked.
   */
  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(value: BooleanInput) {
    const checked = coerceBooleanProperty(value);

    if (checked !== this.checked) {
      this._checked = checked;
      this._changeDetectorRef.markForCheck();
    }
  }
  private _checked: boolean = false;

  /**
   * Whether the checkbox is disabled. This fully overrides the implementation provided by
   * mixinDisabled, but the mixin is still required because mixinTabIndex requires it.
   */
  @Input()
  override get disabled(): boolean {
    return this._disabled;
  }
  override set disabled(value: BooleanInput) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this.disabled) {
      this._disabled = newValue;
      this._changeDetectorRef.markForCheck();
    }
  }
  private _disabled: boolean = false;

  /**
   * Whether the checkbox is indeterminate. This is also known as "mixed" mode and can be used to
   * represent a checkbox with three states, e.g. a checkbox that represents a nested list of
   * checkable items. Note that whenever checkbox is manually clicked, indeterminate is immediately
   * set to false.
   */
  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(value: BooleanInput) {
    const changed = value !== this._indeterminate;
    this._indeterminate = coerceBooleanProperty(value);

    if (changed) {
      this.indeterminateChange.emit(this._indeterminate);
    }

    this._syncIndeterminate(this._indeterminate);
  }
  private _indeterminate: boolean = false;

  /** Method being called whenever the label text changes. */
  _onLabelTextChange() {
    // Since the event of the `cdkObserveContent` directive runs outside of the zone, the checkbox
    // component will be only marked for check, but no actual change detection runs automatically.
    // Instead of going back into the zone in order to trigger a change detection which causes
    // *all* components to be checked (if explicitly marked or not using OnPush), we only trigger
    // an explicit change detection for the checkbox view and its children.
    this._changeDetectorRef.detectChanges();
  }

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any) {
    this.checked = !!value;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void) {
    this._controlValueAccessorChangeFn = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: any) {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  _getAriaChecked(): 'true' | 'false' | 'mixed' {
    if (this.checked) {
      return 'true';
    }

    return this.indeterminate ? 'mixed' : 'false';
  }

  protected _emitChangeEvent() {
    const event = new SbbCheckboxChange();
    event.source = this;
    event.checked = this.checked;

    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(event);
  }

  /** Toggles the `checked` state of the checkbox. */
  toggle(): void {
    this.checked = !this.checked;
    this._controlValueAccessorChangeFn(this.checked);
  }

  /**
   * Event handler for checkbox input element.
   * Toggles checked state if element is not disabled.
   * Do not toggle on (change) event since IE doesn't fire change event when
   *   indeterminate checkbox is clicked.
   */
  _onInputClick(event: Event) {
    const clickAction = this._options?.clickAction;

    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();

    // If resetIndeterminate is false, and the current state is indeterminate, do nothing on click
    if (!this.disabled && clickAction !== 'noop') {
      // When user manually click on the checkbox, `indeterminate` is set to false.
      if (this.indeterminate && clickAction !== 'check') {
        Promise.resolve().then(() => {
          this._indeterminate = false;
          this.indeterminateChange.emit(this._indeterminate);
        });
      }

      this._checked = !this._checked;

      // Emit our custom change event if the native input emitted one.
      // It is important to only emit it, if the native input triggered one, because
      // we don't want to trigger a change event, when the `checked` variable changes for example.
      this._emitChangeEvent();
    } else if (!this.disabled && clickAction === 'noop') {
      // Reset native input when clicked with noop. The native checkbox becomes checked after
      // click, reset it to be align with `checked` value of `sbb-checkbox`.
      this._inputElement.nativeElement.checked = this.checked;
      this._inputElement.nativeElement.indeterminate = this.indeterminate;
    }
  }

  /** Focuses the checkbox. */
  focus(origin?: FocusOrigin, options?: FocusOptions): void {
    if (origin) {
      this._focusMonitor.focusVia(this._inputElement, origin, options);
    } else {
      this._inputElement.nativeElement.focus(options);
    }
  }

  _onInteractionEvent(event: Event) {
    // We always have to stop propagation on the change event.
    // Otherwise the change event, from the input element, will bubble up and
    // emit its event object to the `change` output.
    event.stopPropagation();
  }

  /**
   * Syncs the indeterminate value with the checkbox DOM node.
   *
   * We sync `indeterminate` directly on the DOM node, because in Ivy the check for whether a
   * property is supported on an element boils down to `if (propName in element)`. Domino's
   * HTMLInputElement doesn't have an `indeterminate` property so Ivy will warn during
   * server-side rendering.
   */
  private _syncIndeterminate(value: boolean) {
    const nativeCheckbox = this._inputElement;

    if (nativeCheckbox) {
      nativeCheckbox.nativeElement.indeterminate = value;
    }
  }
}

/**
 * A SBB design checkbox component. Supports all of the functionality of an HTML5 checkbox,
 * and exposes a similar API. A SbbCheckbox can be either checked, unchecked, indeterminate, or
 * disabled. Note that all additional accessibility attributes are taken care of by the component,
 * so there is no need to provide them yourself. However, if you want to omit a label and still
 * have the checkbox be accessible, you may supply an [aria-label] input.
 */
@Component({
  selector: 'sbb-checkbox',
  templateUrl: './checkbox.html',
  exportAs: 'sbbCheckbox',
  host: {
    class: 'sbb-checkbox sbb-selection-item',
    '[id]': 'id',
    '[attr.tabindex]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[class.sbb-selection-indeterminate]': 'indeterminate',
    '[class.sbb-selection-checked]': 'checked',
    '[class.sbb-selection-disabled]': 'disabled',
  },
  providers: [SBB_CHECKBOX_CONTROL_VALUE_ACCESSOR],
  inputs: ['tabIndex'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbCheckbox extends _SbbCheckboxBase {}
