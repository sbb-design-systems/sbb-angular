import { ActiveDescendantKeyManager } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { SelectionModel } from '@angular/cdk/collections';
import {
  A,
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW
} from '@angular/cdk/keycodes';
import {
  CdkConnectedOverlay,
  ConnectedPosition,
  Overlay,
  RepositionScrollStrategy,
  ScrollStrategy
} from '@angular/cdk/overlay';
import {
  AfterContentInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  DoCheck,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  isDevMode,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import {
  CanUpdateErrorState,
  CanUpdateErrorStateCtor,
  mixinErrorState
} from '@sbb-esta/angular-core/common-behaviors';
import { ErrorStateMatcher } from '@sbb-esta/angular-core/error';
import { FormFieldControl } from '@sbb-esta/angular-core/forms';
import {
  countGroupLabelsBeforeOption,
  getOptionScrollPosition,
  HasOptions,
  OptionComponent,
  OptionGroupComponent,
  SBB_OPTION_PARENT_COMPONENT,
  SBBOptionSelectionChange
} from '@sbb-esta/angular-public/option';
import { defer, merge, Observable, Subject } from 'rxjs';
import { filter, first, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

let nextUniqueId = 0;

/**
 * The following style constants are necessary to save here in order
 * to properly calculate the alignment of the selected option over
 * the trigger element.
 */

/** The max height of the select's overlay panel */
export const SELECT_PANEL_MAX_HEIGHT = 480;

export const SELECT_BASE_TRIGGER_HEIGHT = 48;

/** The panel's padding on the x-axis */
export const SELECT_PANEL_PADDING_X = 0;

/** The height of the select items in `em` units. */
export const SELECT_ITEM_HEIGHT_EM = 3;

/**
 * Distance between the panel edge and the option text in
 * multi-selection mode.
 *
 * (SELECT_PANEL_PADDING_X * 1.5) + 20 = 44
 * The padding is multiplied by 1.5 because the checkbox's margin is half the padding.
 * The checkbox width is 20px.
 */
export const SELECT_MULTIPLE_PANEL_PADDING_X = SELECT_PANEL_PADDING_X * 1.5 + 0;

/**
 * The select panel will only "fit" inside the viewport if it is positioned at
 * this value or more away from the viewport boundary.
 */
export const SELECT_PANEL_VIEWPORT_PADDING = 8;

/** Injection token that determines the scroll handling while a select is open. */
export const SBB_SELECT_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-select-scroll-strategy'
);

/** @docs-private */
export function SBB_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay
): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_SELECT_SCROLL_STRATEGY_PROVIDER = {
  provide: SBB_SELECT_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY
};

/** Change event object that is emitted when the select value has changed. */
export class SbbSelectChange {
  constructor(
    /** Reference to the select that emitted the change event. */
    public source: SelectComponent,
    /** Current value of the select that emitted the event. */
    public value: any
  ) {}
}

// Boilerplate for applying mixins to SelectComponent.
/** @docs-private */
export class SbbSelectBase {
  constructor(
    public _elementRef: ElementRef,
    public _defaultErrorStateMatcher: ErrorStateMatcher,
    public _parentForm: NgForm,
    public _parentFormGroup: FormGroupDirective,
    public ngControl: NgControl
  ) {}
}

export const SbbSelectMixinBase: CanUpdateErrorStateCtor & typeof SbbSelectBase = mixinErrorState(
  SbbSelectBase
);

@Component({
  selector: 'sbb-select',
  exportAs: 'sbbSelect',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: FormFieldControl, useExisting: SelectComponent },
    { provide: SBB_OPTION_PARENT_COMPONENT, useExisting: SelectComponent }
  ]
})
export class SelectComponent extends SbbSelectMixinBase
  implements
    FormFieldControl<any>,
    AfterContentInit,
    OnChanges,
    OnDestroy,
    OnInit,
    DoCheck,
    ControlValueAccessor,
    CanUpdateErrorState,
    HasOptions {
  /** All of the defined select options. */
  @ContentChildren(OptionComponent, { descendants: true }) options: QueryList<OptionComponent>;

  /** All of the defined groups of options. */
  @ContentChildren(OptionGroupComponent) optionGroups: QueryList<OptionGroupComponent>;
  /**
   * Role of select field
   */
  @HostBinding('attr.role') role = 'listbox';

  @HostBinding('attr.tabindex')
  @Input()
  get tabIndex(): number {
    return this.disabled ? -1 : this._tabIndex;
  }
  set tabIndex(value: number) {
    // If the specified tabIndex value is null or undefined, fall back to the default value.
    this._tabIndex = value != null ? value : 0;
  }
  private _tabIndex = 0;

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  /** Whether filling out the select is required in the form. */
  private _required = false;

  /** The placeholder displayed in the trigger of the select. */
  private _placeholder: string;

  /** Whether the component is in multiple selection mode. */
  private _multiple = false;

  /** Unique id for this input. */
  private _uid = `sbb-select-${nextUniqueId++}`;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** The last measured value for the trigger's client bounding rect. */
  triggerRect: ClientRect;

  /** The aria-describedby attribute on the select for improved a11y. */
  private _ariaDescribedby: string;

  /** The cached font-size of the trigger element. */
  triggerFontSize = 0;

  /** Deals with the selection logic. */
  selectionModel: SelectionModel<OptionComponent>;

  /** Manages keyboard events for options in the panel. */
  keyManager: ActiveDescendantKeyManager<OptionComponent>;

  private _focused = false;

  /** Emits when the state of the option changes and any parents have to be notified. */
  readonly stateChanges = new Subject<void>();

  /**
   * Css class of select component.
   */
  @HostBinding('class.sbb-select') cssClass = true;

  /** Trigger that opens the select. */
  @ViewChild('trigger', { static: true }) trigger: ElementRef<HTMLElement>;

  /** Panel containing the select options. */
  @ViewChild('panel') panel: ElementRef<HTMLElement>;

  /** Overlay pane containing the options. */
  @ViewChild(CdkConnectedOverlay, { static: true }) overlayDir: CdkConnectedOverlay;

  /** Classes to be passed to the select panel. Supports the same syntax as `ngClass`. */
  @Input() panelClass: string | string[] | Set<string> | { [key: string]: any };
  /**
   * Disables a select field
   */
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(value: any) {
    this._disabled = coerceBooleanProperty(value);
    this._changeDetectorRef.markForCheck();
  }
  private _disabled = false;

  /**
   * Returns the aria-label of the select component.
   */
  @Input('attr.aria-label')
  @HostBinding('attr.aria-label')
  get ariaLabel(): string | null {
    // If an ariaLabelledby value has been set by the consumer, the select should not overwrite the
    // `aria-labelledby` value by setting the ariaLabel to the placeholder.
    return this._ariaLabelledby ? null : this._ariaLabel || this.placeholder;
  }
  set ariaLabel(value: string) {
    this._ariaLabel = value;
  }
  private _ariaLabel: string;

  /** Returns the aria-labelledby of the select component. */
  @Input('attr.aria-labelledby')
  @HostBinding('attr.aria-labelledby')
  get ariaLabelledby(): string | null {
    if (this._ariaLabelledby) {
      return this._ariaLabelledby;
    }

    // Note: we use `_getAriaLabel` here, because we want to check whether there's a
    // computed label. `this.ariaLabel` is only the user-specified label.
    if (this.ariaLabel) {
      return null;
    }

    return null;
  }
  set ariaLabelledby(value: string) {
    this._ariaLabelledby = value;
  }
  private _ariaLabelledby: string;

  /** Value of the select control. */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(newValue: any) {
    if (newValue !== this._value) {
      this.writeValue(newValue);
      this._value = newValue;
    }
  }
  private _value: any;

  /** Unique id of the element. */
  @Input()
  @HostBinding('attr.id')
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  private _id: string;

  /**
   * Implemented as part of FormFieldControl.
   * @deprecated This will be replaced by an internal getter, based on the id property.
   * @docs-private
   */
  get inputId() {
    return this.id;
  }

  /** Combined stream of all of the child options' change events. */
  readonly optionSelectionChanges: Observable<SBBOptionSelectionChange> = defer(() => {
    if (this.options) {
      return merge(...this.options.map(option => option.onSelectionChange));
    }

    return this._ngZone.onStable.asObservable().pipe(
      first(),
      switchMap(() => this.optionSelectionChanges)
    );
  }) as Observable<SBBOptionSelectionChange>;

  /** Event emitted when the select panel has been toggled. */
  @Output() readonly openedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  /** Event emitted when the select has been opened. */
  @Output() readonly opened: Observable<void> = this.openedChange.pipe(
    filter(o => o),
    map(() => {})
  );

  /** Event emitted when the select has been closed. */
  @Output() readonly closed: Observable<void> = this.openedChange.pipe(
    filter(o => !o),
    map(() => {})
  );

  /** Event emitted when the selected value has been changed by the user. */
  @Output() readonly selectionChange: EventEmitter<SbbSelectChange> = new EventEmitter<
    SbbSelectChange
  >();

  /**
   * Event that emits whenever the raw value of the select changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange: EventEmitter<any> = new EventEmitter<any>();

  /** The IDs of child options to be passed to the aria-owns attribute. */
  optionIds = '';

  /** The value of the select panel's transform-origin property. */
  transformOrigin = 'top';

  /** Strategy that will be used to handle scrolling while the select panel is open. */
  scrollStrategy = this._scrollStrategyFactory();

  /**
   * The y-offset of the overlay panel in relation to the trigger's top start corner.
   * This must be adjusted to align the selected option text over the trigger text.
   * when the panel opens. Will change based on the y-position of the selected option.
   */
  offsetY = 0;

  /**
   * This position config ensures that the top "start" corner of the overlay
   * is aligned with with the top "start" of the origin by default (overlapping
   * the trigger completely). If the panel cannot fit below the trigger, it
   * will fall back to a position above the trigger.
   */
  positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top'
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom'
    }
  ];

  /** Flag used to rotate the icon on the select trigger  */
  rotateIcon = false;

  /** Whether the component is disabling centering of the active option over the trigger. */
  private _disableOptionCentering = true;

  /** Comparison function to specify which option is displayed. Defaults to object equality. */
  private _compareWith = (o1: any, o2: any) => o1 === o2;

  /** `View -> model callback called when value changes` */
  onChange: (value: any) => void = () => {};

  /** `View -> model callback called when select has been touched` */
  onTouched = () => {};

  /** Whether the select is focused. */
  get focused(): boolean {
    return this._focused || this._panelOpen;
  }

  /** Placeholder to be shown if no value has been selected. */
  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }

  /** Whether the component is required. */
  @HostBinding('class.sbb-select-required')
  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }

  /** Whether the user should be allowed to select multiple options. */
  @HostBinding('attr.aria-multiselectable')
  @Input()
  get multiple(): boolean {
    return this._multiple;
  }
  set multiple(value: boolean) {
    if (this.selectionModel) {
      throw Error('Cannot change `multiple` mode of select after initialization.');
    }

    this._multiple = coerceBooleanProperty(value);
  }

  /** Whether to center the active option over the trigger. */
  @Input()
  get disableOptionCentering(): boolean {
    return this._disableOptionCentering;
  }
  set disableOptionCentering(value: boolean) {
    this._disableOptionCentering = coerceBooleanProperty(value);
  }

  /**
   * A function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  @Input()
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn: (o1: any, o2: any) => boolean) {
    if (typeof fn !== 'function') {
      throw Error('`compareWith` must be a function.');
    }
    this._compareWith = fn;
    if (this.selectionModel) {
      // A different comparator means the selection could change.
      this._initializeSelection();
    }
  }
  /**
   * Determines if the attribute aria-required is required
   */
  @HostBinding('attr.aria-required')
  get isAriaRequired() {
    return this.required.toString();
  }
  /**
   * Determines if the attribute aria-disabled is disabled
   */
  @HostBinding('attr.aria-disabled')
  get isAriaDisabled() {
    return this.disabled.toString();
  }
  /**
   * Controls if a select is disabled
   */
  @HostBinding('class.sbb-select-disabled')
  get isDisabled(): boolean {
    return this.disabled;
  }

  /**
   * Controls if a select value is invalid
   */
  @HostBinding('attr.aria-invalid')
  @HostBinding('class.sbb-select-invalid')
  get isInvalid() {
    return this.errorState;
  }
  /**
   * Determines the aria-owns to be set on the host.
   */
  @HostBinding('attr.aria-owns')
  get getAriaOwns() {
    return this.panelOpen ? this.optionIds : null;
  }

  /**
   * Determines the aria-describedby to be set on the host.
   */
  @HostBinding('attr.aria-describedby')
  get getAriaDescribedBy(): string | null {
    return this._ariaDescribedby || null;
  }

  /** Determines the `aria-activedescendant` to be set on the host. */
  @HostBinding('attr.aria-activedescendant')
  get getAriaActiveDescendant(): string | null {
    return this.panelOpen && this.keyManager && this.keyManager.activeItem
      ? this.keyManager.activeItem.id
      : null;
  }

  constructor(
    @Self() @Optional() public ngControl: NgControl,
    public _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef,
    private _ngZone: NgZone,
    @Inject(SBB_SELECT_SCROLL_STRATEGY) private _scrollStrategyFactory,
    defaultErrorStateMatcher: ErrorStateMatcher,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    @Attribute('tabindex') tabIndex: string
  ) {
    super(_elementRef, defaultErrorStateMatcher, parentForm, parentFormGroup, ngControl);

    if (this.ngControl) {
      // Note: we provide the value accessor through here, instead of
      // the `providers` to avoid running into a circular import.
      this.ngControl.valueAccessor = this;
    }

    // tslint:disable-next-line:radix
    this.tabIndex = parseInt(tabIndex) || 0;

    // Force setter to be called in case id was not specified.
    this.id = this.id;
  }

  ngOnInit() {
    this.selectionModel = new SelectionModel<OptionComponent>(this.multiple);
    this.stateChanges.next();

    if (this.panelOpen) {
      this.openedChange.emit(true);
    } else {
      this.openedChange.emit(false);

      this.overlayDir.offsetX = 0;
      this._changeDetectorRef.markForCheck();
    }
  }

  ngAfterContentInit() {
    this._initKeyManager();

    // tslint:disable-next-line:no-non-null-assertion
    this.selectionModel.changed!.pipe(takeUntil(this._destroy)).subscribe(event => {
      event.added.forEach(option => option.select());
      event.removed.forEach(option => option.deselect());
    });

    this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
      this._resetOptions();
      this._initializeSelection();
    });
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Updating the disabled state is handled by `mixinDisabled`, but we need to additionally let
    // the parent form field know to run change detection when the disabled state changes.
    if (changes.disabled) {
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
  }

  /** Toggles the overlay panel open or closed. */
  toggle(): void {
    this.panelOpen ? this.close() : this.openSelect();
  }

  /**
   * Opens the overlay panel
   * @deprecated use openSelect() instead
   */
  open(): void {
    this.openSelect();
  }

  /** Opens the overlay panel. */
  openSelect(): void {
    if (this.disabled || !this.options || !this.options.length || this._panelOpen) {
      return;
    }

    this.triggerRect = this.trigger.nativeElement.getBoundingClientRect();
    // Note: The computed font-size will be a string pixel value (e.g. "16px").
    // `parseInt` ignores the trailing 'px' and converts this to a number.
    // tslint:disable-next-line:radix
    this.triggerFontSize = parseInt(getComputedStyle(this.trigger.nativeElement)['font-size']);
    this.rotateIcon = true;
    this._panelOpen = true;
    this.keyManager.withHorizontalOrientation(null);
    this._highlightCorrectOption();
    this._changeDetectorRef.markForCheck();

    // Set the font size on the panel element once it exists.
    this._ngZone.onStable
      .asObservable()
      .pipe(first())
      .subscribe(() => {
        if (
          this.triggerFontSize &&
          this.overlayDir.overlayRef &&
          this.overlayDir.overlayRef.overlayElement
        ) {
          this.overlayDir.overlayRef.overlayElement.style.fontSize = `${this.triggerFontSize}px`;
        }
      });
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this.rotateIcon = false;
      this._changeDetectorRef.markForCheck();
      this.onTouched();
    }
  }

  /**
   * Sets the select's value. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param value New value to be written to the model.
   */
  writeValue(value: any): void {
    if (this.options) {
      this._setSelectionByValue(value);
    }
  }

  /**
   * Saves a callback function to be invoked when the select's value
   * changes from user input. Part of the ControlValueAccessor interface
   * required to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the value changes.
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Saves a callback function to be invoked when the select is blurred
   * by the user. Part of the ControlValueAccessor interface required
   * to integrate with Angular's core forms API.
   *
   * @param fn Callback to be triggered when the component has been touched.
   */
  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
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
  get selected(): OptionComponent | OptionComponent[] {
    return this.multiple ? this.selectionModel.selected : this.selectionModel.selected[0];
  }

  /** The value displayed in the trigger. */
  get triggerValue(): string {
    if (this.empty) {
      return '';
    }

    if (this._multiple) {
      const selectedOptions = this.selectionModel.selected.map(option => option.viewValue);

      return selectedOptions.join(', ');
    }

    return this.selectionModel.selected[0].viewValue;
  }

  /** Handles all keydown events on the select. */
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
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

    // Open the select on ALT + arrow key to match the native <select>
    if (isOpenKey || ((this.multiple || event.altKey) && isArrowKey)) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.openSelect();
    } else if (!this.multiple) {
      this.keyManager.onKeydown(event);
    }
  }

  /** Handles keyboard events when the selected is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const manager = this.keyManager;

    if (keyCode === HOME || keyCode === END) {
      event.preventDefault();
      keyCode === HOME ? manager.setFirstItemActive() : manager.setLastItemActive();
    } else if (isArrowKey && event.altKey) {
      // Close the select on ALT + arrow key to match the native <select>
      event.preventDefault();
      this.close();
    } else if ((keyCode === ENTER || keyCode === SPACE) && manager.activeItem) {
      event.preventDefault();
      manager.activeItem.selectViaInteraction();
    } else if (this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      const hasDeselectedOptions = this.options.some(opt => !opt.disabled && !opt.selected);

      this.options.forEach(option => {
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
        manager.activeItem.selectViaInteraction();
      }
    }
  }

  @HostListener('focus')
  onFocus() {
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
  onBlur() {
    this._focused = false;

    if (!this.disabled && !this.panelOpen) {
      this.onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }

  /**
   * Callback that is invoked when the overlay panel has been attached.
   */
  onAttached(): void {
    this.overlayDir.positionChange.pipe(first()).subscribe(positions => {
      if (positions.connectionPair.originY === 'top') {
        this.panel.nativeElement.classList.add('sbb-select-panel-above');
        this.trigger.nativeElement.classList.add('sbb-select-input-above');
      } else {
        this.panel.nativeElement.classList.remove('sbb-select-panel-above');
        this.trigger.nativeElement.classList.remove('sbb-select-input-above');
      }
      this._changeDetectorRef.detectChanges();

      this._scrollActiveOptionIntoView();
    });
  }

  /** Whether the select has a value. */
  get empty(): boolean {
    return !this.selectionModel || this.selectionModel.isEmpty();
  }

  /**
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids: string[]) {
    this._ariaDescribedby = ids.join(' ');
  }

  /**
   * Forward focus if a user clicks on an associated label.
   * Implemented as part of FormFieldControl.
   * @docs-private
   */
  onContainerClick(event: Event) {
    this.focus();
    this.openSelect();
  }

  /** Focuses the select element. */
  focus(): void {
    this._elementRef.nativeElement.focus();
  }

  private _initializeSelection(): void {
    // Defer setting the value in order to avoid the "Expression
    // has changed after it was checked" errors from Angular.
    Promise.resolve().then(() => {
      this._setSelectionByValue(this.ngControl ? this.ngControl.value : this._value);
      this.stateChanges.next();
    });
  }

  /**
   * Sets the selected option based on a value. If no option can be
   * found with the designated value, the select trigger is cleared.
   */
  private _setSelectionByValue(value: any | any[]): void {
    if (this.multiple && value) {
      if (!Array.isArray(value)) {
        throw Error('Value must be an array in multiple-selection mode.');
      }

      this.selectionModel.clear();
      value.forEach((currentValue: any) => this._selectValue(currentValue));
      this._sortValues();
    } else {
      this.selectionModel.clear();
      const correspondingOption = this._selectValue(value);

      // Shift focus to the active item. Note that we shouldn't do this in multiple
      // mode, because we don't know what option the user interacted with last.
      if (correspondingOption) {
        this.keyManager.setActiveItem(correspondingOption);
      } else if (!this.panelOpen) {
        // Otherwise reset the highlighted option. Note that we only want to do this while
        // closed, because doing it while open can shift the user's focus unnecessarily.
        this.keyManager.setActiveItem(-1);
      }
    }

    this._changeDetectorRef.markForCheck();
  }

  /**
   * Finds and selects and option based on its value.
   * @returns Option that has the corresponding value.
   */
  private _selectValue(value: any): OptionComponent | undefined {
    const correspondingOption = this.options.find((option: OptionComponent) => {
      try {
        // Treat null as a special reset value.
        return option.value != null && this._compareWith(option.value, value);
      } catch (error) {
        if (isDevMode()) {
          // Notify developers of errors in their comparator.
          console.warn(error);
        }
        return false;
      }
    });

    if (correspondingOption) {
      this.selectionModel.select(correspondingOption);
    }

    return correspondingOption;
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager() {
    this.keyManager = new ActiveDescendantKeyManager<OptionComponent>(this.options)
      .withTypeAhead()
      .withVerticalOrientation()
      .withAllowedModifierKeys(['shiftKey']);

    this.keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => {
      // Restore focus to the trigger before closing. Ensures that the focus
      // position won't be lost if the user got focus into the overlay.
      this.focus();
      this.close();
    });

    this.keyManager.change.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this._panelOpen && this.panel) {
        this._scrollActiveOptionIntoView();
      } else if (!this._panelOpen && !this.multiple && this.keyManager.activeItem) {
        this.keyManager.activeItem.selectViaInteraction();
      }
    });
  }

  /** Drops current option subscriptions and IDs and resets from scratch. */
  private _resetOptions(): void {
    const changedOrDestroyed = merge(this.options.changes, this._destroy);

    this.optionSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe(event => {
      this._onSelect(event.source, event.isUserInput);

      if (event.isUserInput && !this.multiple && this._panelOpen) {
        this.close();
        this.focus();
      }
    });

    // Listen to changes in the internal state of the options and react accordingly.
    // Handles cases like the labels of the selected options changing.
    merge(...this.options.map(option => option.stateChanges))
      .pipe(takeUntil(changedOrDestroyed))
      .subscribe(() => {
        this._changeDetectorRef.markForCheck();
        this.stateChanges.next();
      });

    this._setOptionIds();
  }

  /** Invoked when an option is clicked. */
  private _onSelect(option: OptionComponent, isUserInput: boolean): void {
    const wasSelected = this.selectionModel.isSelected(option);

    if (option.value == null && !this._multiple) {
      option.deselect();
      this.selectionModel.clear();
      this._propagateChanges(option.value);
    } else {
      option.selected ? this.selectionModel.select(option) : this.selectionModel.deselect(option);

      if (isUserInput) {
        this.keyManager.setActiveItem(option);
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

    if (wasSelected !== this.selectionModel.isSelected(option)) {
      this._propagateChanges();
    }

    this.stateChanges.next();
  }

  /** Sorts the selected values in the selected based on their order in the panel. */
  private _sortValues() {
    if (this.multiple) {
      const options = this.options.toArray();
      this.selectionModel.sort((a, b) => options.indexOf(a) - options.indexOf(b));
      this.stateChanges.next();
    }
  }

  /** Emits change event to set the model value. */
  private _propagateChanges(fallbackValue?: any): void {
    let valueToEmit: any = null;

    if (this.multiple) {
      valueToEmit = (this.selected as OptionComponent[]).map(option => option.value);
    } else {
      valueToEmit = this.selected ? (this.selected as OptionComponent).value : fallbackValue;
    }

    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this.onChange(valueToEmit);
    this.selectionChange.emit(new SbbSelectChange(this, valueToEmit));
    this._changeDetectorRef.markForCheck();
  }

  /** Records option IDs to pass to the aria-owns property. */
  private _setOptionIds() {
    this.optionIds = this.options.map(option => option.id).join(' ');
  }

  /**
   * Highlights the selected item. If no option is selected, it will highlight
   * the first item instead.
   */
  private _highlightCorrectOption(): void {
    if (this.keyManager) {
      if (this.empty) {
        this.keyManager.setFirstItemActive();
      } else {
        this.keyManager.setActiveItem(this.selectionModel.selected[0]);
      }
    }
  }

  /** Scrolls the active option into view. */
  private _scrollActiveOptionIntoView(): void {
    const activeOptionIndex = this.keyManager.activeItemIndex || 0;
    const labelCount = countGroupLabelsBeforeOption(
      activeOptionIndex,
      this.options,
      this.optionGroups
    );

    this.panel.nativeElement.scrollTop = getOptionScrollPosition(
      activeOptionIndex + labelCount,
      this._getItemHeight(),
      this.panel.nativeElement.scrollTop,
      SELECT_PANEL_MAX_HEIGHT
    );
  }

  /** Calculates the height of the select's options. */
  private _getItemHeight(): number {
    return this.triggerFontSize * SELECT_ITEM_HEIGHT_EM;
  }
}
