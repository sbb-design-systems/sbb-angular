import { ActiveDescendantKeyManager, LiveAnnouncer, _IdGenerator } from '@angular/cdk/a11y';
import { SelectionModel } from '@angular/cdk/collections';
import {
  A,
  DOWN_ARROW,
  ENTER,
  hasModifierKey,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
} from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  Overlay,
  RepositionScrollStrategy,
  ScrollStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { AsyncPipe, NgClass } from '@angular/common';
import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostAttributeToken,
  HostListener,
  inject,
  InjectionToken,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormGroupDirective,
  NgControl,
  NgForm,
  Validators,
} from '@angular/forms';
import {
  CanUpdateErrorState,
  getOptionScrollPosition,
  mixinVariant,
  SbbErrorStateMatcher,
  SbbOptgroup,
  SbbOption,
  SbbOptionSelectionChange,
  SBB_OPTION_PARENT_COMPONENT,
  TypeRef,
  _ErrorStateTracker,
} from '@sbb-esta/angular/core';
import { SbbFormField, SbbFormFieldControl, SBB_FORM_FIELD } from '@sbb-esta/angular/form-field';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { defer, merge, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';

import { sbbSelectAnimations } from './select-animations';
import {
  getSbbSelectDynamicMultipleError,
  getSbbSelectNonArrayValueError,
  getSbbSelectNonFunctionValueError,
} from './select-errors';

/**
 * The following style constants are necessary to save here in order
 * to properly calculate the alignment of the selected option over
 * the trigger element.
 */

/** Injection token that determines the scroll handling while a select is open. */
export const SBB_SELECT_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-select-scroll-strategy',
);

/** @docs-private */
export function SBB_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay,
): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** Object that can be used to configure the default options for the select module. */
export interface SbbSelectConfig {
  /** Time to wait in milliseconds after the last keystroke before moving focus to an item. */
  typeaheadDebounceInterval?: number;

  /** Class or list of classes to be applied to the menu's overlay panel. */
  overlayPanelClass?: string | string[];

  /**
   * Whether nullable options can be selected by default.
   * See `MatSelect.canSelectNullableOptions` for more information.
   */
  canSelectNullableOptions?: boolean;
}

/** Injection token that can be used to provide the default options the select module. */
export const SBB_SELECT_CONFIG = new InjectionToken<SbbSelectConfig>('SBB_SELECT_CONFIG');

/** @docs-private */
export const SBB_SELECT_SCROLL_STRATEGY_PROVIDER = {
  provide: SBB_SELECT_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY,
};

/** Change event object that is emitted when the select value has changed. */
export class SbbSelectChange<T = any> {
  constructor(
    /** Reference to the select that emitted the change event. */
    public source: SbbSelect,
    /** Current value of the select that emitted the event. */
    public value: T,
  ) {}
}

const _SbbSelectMixinBase = mixinVariant(
  class {
    constructor(public _elementRef: ElementRef) {}
  },
);

@Component({
  selector: 'sbb-select',
  exportAs: 'sbbSelect',
  templateUrl: './select.html',
  styleUrls: ['./select.css'],
  inputs: ['disabled', 'tabIndex'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'combobox',
    'aria-haspopup': 'listbox',
    class: 'sbb-select sbb-input-element',
    '[attr.id]': 'id',
    '[attr.tabindex]': 'readonly || disabled ? -1 : tabIndex',
    '[attr.aria-controls]': 'panelOpen ? id + "-panel" : null',
    '[attr.aria-expanded]': 'panelOpen',
    '[attr.aria-label]': 'ariaLabel || null',
    '[attr.aria-required]': 'required.toString()',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[attr.aria-activedescendant]': '_getAriaActiveDescendant()',
    '[class.sbb-disabled]': 'disabled',
    '[class.sbb-select-invalid]': 'errorState',
    '[class.sbb-select-required]': 'required',
    '[class.sbb-select-empty]': 'empty',
    '[class.sbb-select-multiple]': 'multiple',
    '[class.sbb-readonly]': 'readonly',
    '[class.sbb-focused]': 'focused',
    '[class.sbb-input-with-open-panel]': 'panelOpen',
  },
  animations: [sbbSelectAnimations.transformPanel],
  providers: [
    { provide: SbbFormFieldControl, useExisting: SbbSelect },
    { provide: SBB_OPTION_PARENT_COMPONENT, useExisting: SbbSelect },
  ],
  imports: [SbbIcon, CdkConnectedOverlay, NgClass, AsyncPipe],
})
export class SbbSelect
  extends _SbbSelectMixinBase
  implements
    AfterContentInit,
    OnChanges,
    OnDestroy,
    OnInit,
    DoCheck,
    ControlValueAccessor,
    SbbFormFieldControl<any>,
    CanUpdateErrorState
{
  private _viewportRuler = inject(ViewportRuler);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _parentFormField = inject<SbbFormField>(SBB_FORM_FIELD, { optional: true });
  ngControl: NgControl = inject(NgControl, { self: true, optional: true })!;
  private _liveAnnouncer = inject(LiveAnnouncer);
  private _defaultOptions = inject<SbbSelectConfig>(SBB_SELECT_CONFIG, { optional: true });
  private _initialized = new Subject<void>();

  /** The scroll position of the overlay panel, calculated to center the selected option. */
  private _scrollTop = 0;

  /** The last measured value for the trigger's client bounding rect. */
  private _triggerRect: DOMRect;

  /** The cached font-size of the trigger element. */
  _triggerFontSize: number = 0;

  /** The value of the select panel's transform-origin property. */
  _transformOrigin: string = 'top';

  /**
   * The y-offset of the overlay panel in relation to the trigger's top start corner.
   * This must be adjusted to align the selected option text over the trigger text.
   * when the panel opens. Will change based on the y-position of the selected option.
   */
  _offsetY: number = 0;

  /** All of the defined select options. */
  @ContentChildren(SbbOption, { descendants: true }) options: QueryList<SbbOption>;

  /** All of the defined groups of options. */
  @ContentChildren(SbbOptgroup, { descendants: true }) optionGroups: QueryList<SbbOptgroup>;

  /**
   * This position config ensures that the top "start" corner of the overlay
   * is aligned with with the top "start" of the origin by default (overlapping
   * the trigger completely). If the panel cannot fit below the trigger, it
   * will fall back to a position above the trigger.
   */
  _positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
    },
  ];

  _overlayOrigin: CdkOverlayOrigin;

  /** Factory function used to create a scroll strategy for this select. */
  private _scrollStrategyFactory = inject(SBB_SELECT_SCROLL_STRATEGY);

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** Comparison function to specify which option is displayed. Defaults to object equality. */
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  /** Unique id for this input. */
  private _uid = inject(_IdGenerator).getId('sbb-select-');

  /** Current `aria-labelledby` value for the select trigger. */
  private _triggerAriaLabelledBy: string | null = null;

  /**
   * Keeps track of the previous form control assigned to the select.
   * Used to detect if it has changed.
   */
  private _previousControl: AbstractControl | null | undefined;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** Tracks the error state of the select. */
  private _errorStateTracker: _ErrorStateTracker;

  /**
   * Emits whenever the component state changes and should cause the parent
   * form-field to update. Implemented as part of `SbbFormFieldControl`.
   * @docs-private
   */
  readonly stateChanges = new Subject<void>();

  /**
   * Disable the automatic labeling to avoid issues like #1918.
   * @docs-private
   */
  readonly disableAutomaticLabeling = true;

  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  @Input('aria-describedby') userAriaDescribedBy: string;

  /** Deals with the selection logic. */
  _selectionModel: SelectionModel<SbbOption>;

  /** Manages keyboard events for options in the panel. */
  _keyManager: ActiveDescendantKeyManager<SbbOption>;

  /** `View -> model callback called when value changes` */
  _onChange: (value: any) => void = () => {};

  /** `View -> model callback called when select has been touched` */
  _onTouched: () => void = () => {};

  /** ID for the DOM node containing the select's value. */
  _valueId: string = inject(_IdGenerator).getId('sbb-select-value-');

  /** Emits when the panel element is finished transforming in. */
  readonly _panelDoneAnimatingStream: Subject<string> = new Subject<string>();

  /** Strategy that will be used to handle scrolling while the select panel is open. */
  _scrollStrategy: ScrollStrategy;

  _overlayPanelClass: string | string[] =
    this._defaultOptions?.overlayPanelClass || 'sbb-overlay-panel';

  /** Whether the select is focused. */
  get focused(): boolean {
    return this._focused || this._panelOpen;
  }
  private _focused = false;

  /** A name for this control that can be used by `sbb-form-field`. */
  controlType: string = 'sbb-select';

  /** Panel containing the select options. */
  @ViewChild('panel') panel: ElementRef<HTMLElement>;

  /** Overlay pane containing the options. */
  @ViewChild(CdkConnectedOverlay) overlayDir: CdkConnectedOverlay;

  /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[] | Set<string> | { [key: string]: any };

  /** Whether the select is disabled. */
  @Input({ transform: booleanAttribute })
  disabled: boolean = false; /** Placeholder to be shown if no value has been selected. */

  /** Tab index of the select. */
  @Input({ transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)) })
  tabIndex: number = 0;

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  /** Whether the component is required. */
  @Input({ transform: booleanAttribute })
  get required(): boolean {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value: boolean) {
    this._required = value;
    this.stateChanges.next();
  }
  private _required: boolean | undefined;

  /** Whether the user should be allowed to select multiple options. */
  @Input({ transform: booleanAttribute })
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    if (this._selectionModel && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSbbSelectDynamicMultipleError();
    }

    this._multiple = value;
  }
  private _multiple: boolean = false;

  /** Whether the element is readonly. */
  @Input({ transform: booleanAttribute })
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean) {
    this._readonly = value;
    this.stateChanges.next();
  }
  private _readonly: boolean = false;

  /**
   * Function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input()
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw getSbbSelectNonFunctionValueError();
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }

  /** Value of the select control. */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    const hasAssigned = this._assignValue(newValue);
    if (hasAssigned) {
      this._onChange(newValue);
    }
  }
  private _value: any;

  /** Aria label of the select. If not specified, the placeholder will be used as label. */
  @Input('aria-label') ariaLabel: string = '';

  /** Input that can be used to specify the `aria-labelledby` attribute. */
  @Input('aria-labelledby') ariaLabelledby: string;

  /** Object used to control when error messages are shown. */
  @Input()
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value: SbbErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

  /** Time to wait in milliseconds after the last keystroke before moving focus to an item. */
  @Input({ transform: numberAttribute })
  typeaheadDebounceInterval: number;

  /**
   * Function used to sort the values in a select in multiple mode.
   * Follows the same logic as `Array.prototype.sort`.
   */
  @Input() sortComparator: (a: SbbOption, b: SbbOption, options: SbbOption[]) => number;

  /** Unique id of the element. */
  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  /** Whether the select is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

  /**
   * By default selecting an option with a `null` or `undefined` value will reset the select's
   * value. Enable this option if the reset behavior doesn't match your requirements and instead
   * the nullable options should become selected. The value of this input can be controlled app-wide
   * using the `MAT_SELECT_CONFIG` injection token.
   */
  @Input({ transform: booleanAttribute })
  canSelectNullableOptions: boolean = this._defaultOptions?.canSelectNullableOptions ?? false;

  /** Combined stream of all of the child options' change events. */
  readonly optionSelectionChanges: Observable<SbbOptionSelectionChange> = defer(() => {
    const options = this.options;

    if (options) {
      return options.changes.pipe(
        startWith(options),
        switchMap(() => merge(...options.map((option) => option.onSelectionChange))),
      );
    }

    return this._initialized.pipe(switchMap(() => this.optionSelectionChanges));
  });

  /** Event emitted when the select panel has been toggled. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted when the select has been opened. */
  @Output('opened') readonly _openedStream: Observable<void> = this.openedChange.pipe(
    filter((o) => o),
    map(() => {}),
  );

  /** Event emitted when the select has been closed. */
  @Output('closed') readonly _closedStream: Observable<void> = this.openedChange.pipe(
    filter((o) => !o),
    map(() => {}),
  );

  /** Event emitted when the selected value has been changed by the user. */
  @Output()
  readonly selectionChange: EventEmitter<SbbSelectChange> = new EventEmitter<SbbSelectChange>();

  /**
   * Event that emits whenever the raw value of the select changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(...args: unknown[]);
  constructor() {
    const defaultErrorStateMatcher = inject(SbbErrorStateMatcher);
    const elementRef = inject(ElementRef);
    const parentForm = inject(NgForm, { optional: true });
    const parentFormGroup = inject(FormGroupDirective, { optional: true });
    const tabIndex = inject(new HostAttributeToken('tabindex'), { optional: true });

    super(elementRef);
    const _defaultOptions = this._defaultOptions;

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // Note that we only want to set this when the defaults pass it in, otherwise it should
    // stay as `undefined` so that it falls back to the default in the key manager.
    if (_defaultOptions?.typeaheadDebounceInterval != null) {
      this.typeaheadDebounceInterval = _defaultOptions.typeaheadDebounceInterval;
    }

    this._errorStateTracker = new _ErrorStateTracker(
      defaultErrorStateMatcher,
      this.ngControl,
      parentFormGroup,
      parentForm,
      this.stateChanges,
    );

    this._scrollStrategy = this._scrollStrategyFactory();
    this.tabIndex = tabIndex == null ? 0 : parseInt(tabIndex, 10) || 0;

    // Force setter to be called in case id was not specified.
    this.id = this.id;

    this._overlayOrigin = new CdkOverlayOrigin(elementRef);
  }

  ngOnInit() {
    this._selectionModel = new SelectionModel<SbbOption>(this.multiple);
    this.stateChanges.next();

    // We need `distinctUntilChanged` here, because some browsers will
    // fire the animation end event twice for the same animation. See:
    // https://github.com/angular/angular/issues/24084
    this._panelDoneAnimatingStream
      .pipe(distinctUntilChanged(), takeUntil(this._destroy))
      .subscribe(() => this._panelDoneAnimating(this.panelOpen));

    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        if (this.panelOpen) {
          this._triggerRect = this._elementRef.nativeElement.getBoundingClientRect();
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  ngAfterContentInit() {
    this._initialized.next();
    this._initialized.complete();

    this._initKeyManager();

    this._selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe((event) => {
      event.added.forEach((option) => option.select());
      event.removed.forEach((option) => option.deselect());
    });

    this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
      this._resetOptions();
      this._initializeSelection();
    });
  }

  ngDoCheck() {
    const newAriaLabelledby = this._getTriggerAriaLabelledby();
    const ngControl = this.ngControl;

    // We have to manage setting the `aria-labelledby` ourselves, because part of its value
    // is computed as a result of a content query which can cause this binding to trigger a
    // "changed after checked" error.
    if (newAriaLabelledby !== this._triggerAriaLabelledBy) {
      const element: HTMLElement = this._elementRef.nativeElement;
      this._triggerAriaLabelledBy = newAriaLabelledby;
      if (newAriaLabelledby) {
        element.setAttribute('aria-labelledby', newAriaLabelledby);
      } else {
        element.removeAttribute('aria-labelledby');
      }
    }

    if (this.ngControl) {
      // The disabled state might go out of sync if the form group is swapped out. See #17860.
      if (this._previousControl !== ngControl.control) {
        if (
          this._previousControl !== undefined &&
          ngControl.disabled !== null &&
          ngControl.disabled !== this.disabled
        ) {
          this.disabled = ngControl.disabled;
        }

        this._previousControl = ngControl.control;
      }

      this.updateErrorState();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Updating the disabled state is handled by the input, but we need to additionally let
    // the parent form field know to run change detection when the disabled state changes.
    if (changes['disabled'] || changes['userAriaDescribedBy']) {
      this.stateChanges.next();
    }

    if (changes['typeaheadDebounceInterval'] && this._keyManager) {
      this._keyManager.withTypeAhead(this.typeaheadDebounceInterval);
    }
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
    this._keyManager?.destroy();
  }

  /** Toggles the overlay panel open or closed. */
  @HostListener('click')
  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  /** Opens the overlay panel. */
  open(): void {
    if (this._canOpen()) {
      this._panelOpen = true;
      this._keyManager.withHorizontalOrientation(null);
      this._highlightCorrectOption();
      this._changeDetectorRef.markForCheck();

      this._triggerRect = this._elementRef.nativeElement.getBoundingClientRect();
      // Note: The computed font-size will be a string pixel value (e.g. "16px").
      // `parseInt` ignores the trailing 'px' and converts this to a number.
      this._triggerFontSize = parseInt(
        getComputedStyle(this._elementRef.nativeElement).fontSize || '0',
        10,
      );

      // Set the font size on the panel element once it exists.
      this._initialized.subscribe(() => {
        if (
          this._triggerFontSize &&
          this.overlayDir.overlayRef &&
          this.overlayDir.overlayRef.overlayElement
        ) {
          this.overlayDir.overlayRef.overlayElement.style.fontSize = `${this._triggerFontSize}px`;
        }
        this._calculateOverlayPosition();
      });
    }
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._keyManager.withHorizontalOrientation('ltr');
      this._changeDetectorRef.markForCheck();
      this._onTouched();
    }
  }

  /**
   * Sets the select's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: any): void {
    this._assignValue(value);
  }

  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: () => {}): void {
    this._onTouched = fn;
  }

  /**
   * Disables the select. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param isDisabled Sets whether the component is disabled.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }

  /** The currently selected option. */
  get selected(): SbbOption | SbbOption[] {
    return this.multiple ? this._selectionModel?.selected || [] : this._selectionModel?.selected[0];
  }

  /** The value displayed in the trigger. */
  get triggerValue(): string {
    if (this.empty) {
      return '';
    }

    if (this._multiple) {
      const selectedOptions = this._selectionModel.selected.map((option) => option.viewValue);

      return selectedOptions.join(', ');
    }

    return this._selectionModel.selected[0].viewValue;
  }

  /** Refreshes the error state of the select. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  /** Handles all keydown events on the select. */
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: TypeRef<KeyboardEvent>): void {
    if (!this.disabled) {
      this.panelOpen ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
    }
  }

  /** Handles keyboard events while the select is closed. */
  private _handleClosedKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey =
      keyCode === DOWN_ARROW ||
      keyCode === UP_ARROW ||
      keyCode === LEFT_ARROW ||
      keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this._keyManager;

    // Open the select on ALT + arrow key to match the native <select>
    if (
      (!manager.isTyping() && isOpenKey && !hasModifierKey(event)) ||
      ((this.multiple || event.altKey) && isArrowKey)
    ) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.open();
    } else if (!this.multiple) {
      const previouslySelectedOption = this.selected;
      manager.onKeydown(event);
      const selectedOption = this.selected;

      // Since the value has changed, we need to announce it ourselves.
      if (selectedOption && previouslySelectedOption !== selectedOption) {
        // We set a duration on the live announcement, because we want the live element to be
        // cleared after a while so that users can't navigate to it using the arrow keys.
        this._liveAnnouncer.announce((selectedOption as SbbOption).viewValue, 10000);
      }
    }
  }

  /** Handles keyboard events when the selected is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const manager = this._keyManager;
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const isTyping = manager.isTyping();

    if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
      // Don't do anything in this case if the user is typing,
      // because the typing sequence can include the space key.
    } else if (
      !isTyping &&
      (keyCode === ENTER || keyCode === SPACE) &&
      manager.activeItem &&
      !hasModifierKey(event)
    ) {
      event.preventDefault();
      manager.activeItem._selectViaInteraction();
    } else if (!isTyping && this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      const hasDeselectedOptions = this.options.some((opt) => !opt.disabled && !opt.selected);

      this.options.forEach((option) => {
        if (!option.disabled) {
          hasDeselectedOptions ? option.select() : option.deselect();
        }
      });
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;

      manager.onKeydown(event);

      if (
        this._multiple &&
        isArrowKey &&
        event.shiftKey &&
        manager.activeItem &&
        manager.activeItemIndex !== previouslyFocusedIndex
      ) {
        manager.activeItem._selectViaInteraction();
      }
    }
  }

  @HostListener('focus')
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * Calls the touched callback only if the panel is closed. Otherwise, the trigger will
   * "blur" to the panel when it opens, causing a false positive.
   */
  @HostListener('blur')
  _onBlur() {
    this._focused = false;
    this._keyManager?.cancelTypeahead();

    if (!this.disabled && !this.panelOpen) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /** Callback that is invoked when the overlay panel has been attached. */
  _onAttached(): void {
    this.overlayDir.positionChange.pipe(take(1)).subscribe((positions) => {
      if (positions.connectionPair.originY === 'top') {
        this.panel.nativeElement.classList.add('sbb-panel-above');
        this._elementRef.nativeElement.classList.add('sbb-input-with-open-panel-above');
      } else {
        this.panel.nativeElement.classList.remove('sbb-panel-above');
        this._elementRef.nativeElement.classList.remove('sbb-input-with-open-panel-above');
      }
      this._changeDetectorRef.detectChanges();
      this._positioningSettled();
    });
  }

  /** Whether the select has a value. */
  get empty(): boolean {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      if (this.ngControl) {
        this._value = this.ngControl.value;
      }

      this._setSelectionByValue(this._value);
      this.stateChanges.next();
    });
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: any | any[]): void {
    this._selectionModel.selected.forEach((option) => option.setInactiveStyles());
    this._selectionModel.clear();

    if (this.multiple && value) {
      if (!Array.isArray(value) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
        throw getSbbSelectNonArrayValueError();
      }

      value.forEach((currentValue: any) => this._selectOptionByValue(currentValue));
      this._sortValues();
    } else {
      const correspondingOption = this._selectOptionByValue(value);

      // Shift focus to the active item. Note that we shouldn't do this in multiple
      // mode, because we don't know what option the user interacted with last.
      if (correspondingOption) {
        this._keyManager.updateActiveItem(correspondingOption);
      } else if (!this.panelOpen) {
        // Otherwise reset the highlighted option. Note that we only want to do this while
        // closed, because doing it while open can shift the user's focus unnecessarily.
        this._keyManager.updateActiveItem(-1);
      }
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private _selectOptionByValue(value: any): SbbOption | undefined {
    const correspondingOption = this.options.find((option: SbbOption) => {
      // Skip options that are already in the model. This allows us to handle cases
      // where the same primitive value is selected multiple times.
      if (this._selectionModel.isSelected(option)) {
        return false;
      }

      try {
        // Treat null as a special reset value.
        return (
          (option.value != null || this.canSelectNullableOptions) &&
          this._compareWith(option.value, value)
        );
      } catch (error) {
        if (typeof ngDevMode === 'undefined' || ngDevMode) {
          // Notify developers of errors in their comparator.
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }

  /** Assigns a specific value to the select. Returns whether the value has changed. */
  private _assignValue(newValue: any | any[]): boolean {
    // Always re-assign an array, because it might have been mutated.
    if (newValue !== this._value || (this._multiple && Array.isArray(newValue))) {
      if (this.options) {
        this._setSelectionByValue(newValue);
      }

      this._value = newValue;
      return true;
    }
    return false;
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager<SbbOption>(this.options)
      .withTypeAhead(this.typeaheadDebounceInterval)
      .withVerticalOrientation()
      .withHorizontalOrientation('ltr')
      .withHomeAndEnd()
      .withPageUpDown()
      .withAllowedModifierKeys(['shiftKey']);

    this._keyManager.tabOut.subscribe(() => {
      if (this.panelOpen) {
        // Select the active item when tabbing away. This is consistent with how the native
        // select behaves. Note that we only want to do this in single selection mode.
        if (!this.multiple && this._keyManager.activeItem) {
          this._keyManager.activeItem._selectViaInteraction();
        }

        // Restore focus to the trigger before closing. Ensures that the focus
        // position won't be lost if the user got focus into the overlay.
        this.focus();
        this.close();
      }
    });

    this._keyManager.change.subscribe(() => {
      if (this._panelOpen && this.panel) {
        this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
      } else if (!this._panelOpen && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }

  /** Drops current option subscriptions and IDs and resets from scratch. */
  private _resetOptions(): void {
    const changedOrDestroyed = merge(this.options.changes, this._destroy);

    this.optionSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe((event) => {
      this._onSelect(event.source, event.isUserInput);

      if (event.isUserInput && !this.multiple && this._panelOpen) {
        this.close();
        this.focus();
      }
    });

    // Listen to changes in the internal state of the options and react accordingly.
    // Handles cases like the labels of the selected options changing.
    merge(...this.options.map((option) => option._stateChanges))
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(() => {
        // `_stateChanges` can fire as a result of a change in the label's DOM value which may
        // be the result of an expression changing. We have to use `detectChanges` in order
        // to avoid "changed after checked" errors (see #14793).
        this._changeDetectorRef.detectChanges();
        this.stateChanges.next();
      });
  }

  /** Invoked when an option is clicked. */
  private _onSelect(option: SbbOption, isUserInput: boolean): void {
    const wasSelected = this._selectionModel.isSelected(option);

    if (!this.canSelectNullableOptions && option.value == null && !this._multiple) {
      option.deselect();
      this._selectionModel.clear();

      if (this.value != null) {
        this._propagateChanges(option.value);
      }
    } else {
      if (wasSelected !== option.selected) {
        option.selected
          ? this._selectionModel.select(option)
          : this._selectionModel.deselect(option);
      }

      if (isUserInput) {
        this._keyManager.setActiveItem(option);
      }

      if (this.multiple) {
        this._sortValues();

        if (isUserInput) {
          // In case the user selected the option with their mouse, we
          // want to restore focus back to the trigger, in order to
          // prevent the select keyboard controls from clashing with
          // the ones from `sbb-option`.
          this.focus();
        }
      }
    }

    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this.stateChanges.next();
  }

  /** Sorts the selected values in the selected based on their order in the panel. */
  private _sortValues() {
    if (this.multiple) {
      const options = this.options.toArray();

      this._selectionModel.sort((a, b) => {
        return this.sortComparator
          ? this.sortComparator(a, b, options)
          : options.indexOf(a) - options.indexOf(b);
      });
      this.stateChanges.next();
    }
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: any): void {
    let valueToEmit: any = null;

    if (this.multiple) {
      valueToEmit = (this.selected as SbbOption[]).map((option) => option.value);
    } else {
      valueToEmit = this.selected ? (this.selected as SbbOption).value : fallbackValue;
    }

    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this.selectionChange.emit(new SbbSelectChange(this, valueToEmit));
    this._changeDetectorRef.markForCheck();
  }

  /**
   * Highlights the selected item. If no option is selected, it will highlight
   * the first item instead.
   */
  private _highlightCorrectOption(): void {
    if (this._keyManager) {
      if (this.empty) {
        this._keyManager.setFirstItemActive();
      } else {
        this._keyManager.setActiveItem(this._selectionModel.selected[0]);
      }
    }
  }

  /** Whether the panel is allowed to open. */
  private _canOpen(): boolean {
    return !this._panelOpen && !this.disabled && this.options?.length > 0 && !this.readonly;
  }

  /** Focuses the select element. */
  focus(options?: FocusOptions): void {
    this._elementRef.nativeElement.focus(options);
  }

  /** Gets the aria-labelledby for the select panel. */
  _getPanelAriaLabelledby(): string | null {
    if (this.ariaLabel) {
      return null;
    }

    const labelId = this._parentFormField?.getLabelId() || null;
    const labelExpression = labelId ? labelId + ' ' : '';
    return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
  }

  /** Determines the `aria-activedescendant` to be set on the host. */
  _getAriaActiveDescendant(): string | null {
    if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
      return this._keyManager.activeItem.id;
    }

    return null;
  }

  /** Gets the aria-labelledby of the select component trigger. */
  private _getTriggerAriaLabelledby(): string | null {
    if (this.ariaLabel) {
      return null;
    }

    const labelId = this._parentFormField?.getLabelId();
    let value = (labelId ? labelId + ' ' : '') + this._valueId;

    if (this.ariaLabelledby) {
      value += ' ' + this.ariaLabelledby;
    }

    return value;
  }

  /** Called when the overlay panel is done animating. */
  _panelDoneAnimating(isOpen: boolean) {
    if (this.panelOpen) {
      this._scrollTop = 0;
    } else {
      this.overlayDir.offsetX = 0;
      this._changeDetectorRef.markForCheck();
    }

    if (!isOpen) {
      this._elementRef.nativeElement.classList.remove('sbb-input-with-open-panel-above');
    }

    this.openedChange.emit(isOpen);
  }

  protected _getOverlayMinWidth(): number {
    return this._triggerRect?.width;
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    if (ids.length) {
      this._elementRef.nativeElement.setAttribute('aria-describedby', ids.join(' '));
    } else {
      this._elementRef.nativeElement.removeAttribute('aria-describedby');
    }
  }

  /**
   * Forward focus if a user clicks on an associated label.
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  onContainerClick() {
    this.focus();
    this.open();
  }

  /**
   * Calculates the scroll position of the select's overlay panel.
   *
   * Attempts to center the selected option in the panel. If the option is
   * too high or too low in the panel to be scrolled to the center, it clamps the
   * scroll position to the min or max scroll positions respectively.
   */
  _calculateOverlayScroll(
    selectedOption: SbbOption,
    scrollBuffer: number,
    maxScroll: number,
  ): number {
    const itemHeight = selectedOption._getHostElement().offsetHeight;
    const optionOffsetFromScrollTop = selectedOption._getHostElement().offsetTop;
    const halfOptionHeight = itemHeight / 2;

    // Starts at the optionOffsetFromScrollTop, which scrolls the option to the top of the
    // scroll container, then subtracts the scroll buffer to scroll the option down to
    // the center of the overlay panel. Half the option height must be re-added to the
    // scrollTop so the option is centered based on its middle, not its top edge.
    const optimalScrollPosition = optionOffsetFromScrollTop - scrollBuffer + halfOptionHeight;
    return Math.min(Math.max(0, optimalScrollPosition), maxScroll);
  }

  /** Scrolls the active option into view. */
  private _scrollOptionIntoView(index: number): void {
    if (index === 0) {
      // Scroll to top if first index is selected. This would ensure that group labels are displayed.
      this.panel.nativeElement.scrollTop = 0;
    } else {
      const option = this.options.toArray()[index];
      if (option) {
        const element = option._getHostElement();
        this.panel.nativeElement.scrollTop = getOptionScrollPosition(
          element.offsetTop,
          element.offsetHeight,
          this.panel.nativeElement.scrollTop,
          this.panel.nativeElement.offsetHeight,
        );
      }
    }
  }

  private _positioningSettled() {
    this.panel.nativeElement.scrollTop = this._scrollTop;
  }

  /** Calculates the scroll position */
  private _calculateOverlayPosition(): void {
    if (!this.panel) {
      return;
    }
    const panelHeight = this.panel.nativeElement.clientHeight;
    const scrollContainerHeight = this.panel.nativeElement.scrollHeight;

    // The farthest the panel can be scrolled before it hits the bottom
    const maxScroll = scrollContainerHeight - panelHeight;

    const firstSelectedOption = this._selectionModel.selected[0];

    if (this.empty || this.options.toArray().indexOf(firstSelectedOption) === -1) {
      this._scrollTop = 0;
      return;
    }

    // We must maintain a scroll buffer so the selected option will be scrolled to the
    // center of the overlay panel rather than the top.
    const scrollBuffer = panelHeight / 2;
    this._scrollTop = this._calculateOverlayScroll(firstSelectedOption, scrollBuffer, maxScroll);
  }
}
