import { FocusKeyManager } from '@angular/cdk/a11y';
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
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  Self,
  ViewEncapsulation,
} from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl, NgForm } from '@angular/forms';
import { SbbErrorStateMatcher, _ErrorStateTracker } from '@sbb-esta/angular/core';
import { SbbFormFieldControl } from '@sbb-esta/angular/form-field';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

import type { SbbChip, SbbChipEvent } from './chip';
import { SbbChipTextControl } from './chip-text-control';
import { SBB_CHIP, SBB_CHIP_LIST } from './chip-tokens';

// Increasing integer for generating unique ids for chip-list components.
let nextUniqueId = 0;

/**
 * A design chips component (named ChipList for its similarity to the List component).
 */
@Component({
  selector: 'sbb-chip-list',
  template: `<ng-content></ng-content>`,
  exportAs: 'sbbChipList',
  host: {
    class: 'sbb-chip-list',
    '[attr.tabindex]': 'disabled ? null : _tabIndex',
    '[attr.aria-required]': 'role ? required : null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '[attr.aria-invalid]': 'errorState',
    '[attr.role]': 'role',
    '[class.sbb-chip-list-disabled]': 'disabled',
    '[class.sbb-disabled]': 'disabled',
    '[class.sbb-chip-list-invalid]': 'errorState',
    '[class.sbb-chip-list-required]': 'required',
    '[class.sbb-expanded]': '_chipInput?.autocompleteTrigger?.autocomplete?.isOpen',
    '[class.sbb-focused]': 'focused',
    '[class.sbb-input-element]': '_chipInput',
    '[attr.aria-orientation]': 'ariaOrientation',
    '(focus)': 'focus()',
    '(blur)': '_blur()',
    '(keydown)': '_keydown($event)',
    '[id]': '_uid',
  },
  providers: [
    { provide: SbbFormFieldControl, useExisting: SbbChipList },
    { provide: SBB_CHIP_LIST, useExisting: SbbChipList },
  ],
  styleUrls: ['./chips.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SbbChipList
  implements
    SbbFormFieldControl<any>,
    ControlValueAccessor,
    AfterContentInit,
    DoCheck,
    OnInit,
    OnDestroy
{
  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  readonly controlType: string = 'sbb-chip-list';

  /**
   * When a chip is destroyed, we store the index of the destroyed chip until the chips
   * query list notifies about the update. This is necessary because we cannot determine an
   * appropriate chip that should receive focus until the array of chips updated completely.
   */
  private _lastDestroyedChipIndex: number | null = null;

  /** Subject that emits when the component has been destroyed. */
  private readonly _destroyed = new Subject<void>();

  /** Subscription to focus changes in the chips. */
  private _chipFocusSubscription: Subscription | null;

  /** Subscription to blur changes in the chips. */
  private _chipBlurSubscription: Subscription | null;

  /** Subscription to remove changes in chips. */
  private _chipRemoveSubscription: Subscription | null;

  private _errorStateTracker: _ErrorStateTracker;

  /** The chip input to add more chips */
  _chipInput: SbbChipTextControl;

  /** Uid of the chip list */
  _uid: string = `sbb-chip-list-${nextUniqueId++}`;

  /** Tab index for the chip list. */
  _tabIndex: number = 0;

  /**
   * User defined tab index.
   * When it is not null, use user defined tab index. Otherwise use _tabIndex
   */
  _userTabIndex: number | null = null;

  /** The FocusKeyManager which handles focus. */
  _keyManager: FocusKeyManager<SbbChip>;

  /** Function when touched */
  _onTouched: () => void = () => {};

  /** Function when changed */
  _onChange: (value: any) => void = () => {};

  /** The ARIA role applied to the chip list. */
  @Input()
  get role(): string | null {
    if (this._explicitRole) {
      return this._explicitRole;
    }

    return this.empty ? null : 'listbox';
  }
  set role(role: string | null) {
    this._explicitRole = role;
  }
  private _explicitRole?: string | null;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input('aria-describedby') userAriaDescribedBy: string;

  /** An object used to control when error messages are shown. */
  @Input()
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value: SbbErrorStateMatcher) {
    this._errorStateTracker.matcher = value;
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input()
  get value(): any {
    return this._value;
  }
  set value(value: any) {
    this.writeValue(value);
    this._value = value;
  }
  protected _value: any;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  get id(): string {
    return this._chipInput ? this._chipInput.id : this._uid;
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input({ transform: booleanAttribute }) required: boolean = false;

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input()
  get placeholder(): string {
    return this._chipInput ? this._chipInput.placeholder : this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  protected _placeholder: string;

  /** Whether any chips or the sbbChipInput inside of this chip-list has focus. */
  get focused(): boolean {
    return (this._chipInput && this._chipInput.focused) || this._hasFocusedChip();
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  get empty(): boolean {
    return (!this._chipInput || this._chipInput.empty) && (!this.chips || this.chips.length === 0);
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  @Input({ transform: booleanAttribute })
  get disabled(): boolean {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this._syncChipsState();
  }
  protected _disabled: boolean = false;

  /** Orientation of the chip list. */
  @Input('aria-orientation') ariaOrientation: 'horizontal' | 'vertical' = 'horizontal';

  @Input()
  set tabIndex(value: number) {
    this._userTabIndex = value;
    this._tabIndex = value;
  }

  /** Combined stream of all of the child chips' focus change events. */
  get chipFocusChanges(): Observable<SbbChipEvent> {
    return merge(...this.chips.map((chip) => chip._onFocus));
  }

  /** Combined stream of all of the child chips' blur change events. */
  get chipBlurChanges(): Observable<SbbChipEvent> {
    return merge(...this.chips.map((chip) => chip._onBlur));
  }

  /** Combined stream of all of the child chips' remove change events. */
  get chipRemoveChanges(): Observable<SbbChipEvent> {
    return merge(...this.chips.map((chip) => chip.destroyed));
  }

  /**
   * Event that emits whenever the raw value of the chip-list changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  @Output() readonly valueChange = new EventEmitter<any>();

  /** The chip components contained within this chip list. */
  @ContentChildren(SBB_CHIP, {
    // We need to use `descendants: true`, because Ivy will no longer match
    // indirect descendants if it's left as false.
    descendants: true,
  })
  chips: QueryList<SbbChip>;

  /**
   * Emits whenever the component state changes and should cause the parent
   * form-field to update. Implemented as part of `SbbFormFieldControl`.
   * @docs-private
   */
  readonly stateChanges = new Subject<void>();

  /** Whether the chip grid is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value: boolean) {
    this._errorStateTracker.errorState = value;
  }

  constructor(
    protected _elementRef: ElementRef<HTMLElement>,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() parentForm: NgForm,
    @Optional() parentFormGroup: FormGroupDirective,
    defaultErrorStateMatcher: SbbErrorStateMatcher,
    /** @docs-private */
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this._errorStateTracker = new _ErrorStateTracker(
      defaultErrorStateMatcher,
      ngControl,
      parentFormGroup,
      parentForm,
      this.stateChanges,
    );
  }

  ngAfterContentInit() {
    this._keyManager = new FocusKeyManager<SbbChip>(this.chips)
      .withWrap()
      .withVerticalOrientation()
      .withHomeAndEnd()
      .withHorizontalOrientation('ltr');

    this._keyManager.tabOut.subscribe(() => this._allowFocusEscape());

    // When the list changes, re-subscribe
    this.chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      if (this.disabled) {
        // Since this happens after the content has been
        // checked, we need to defer it to the next tick.
        Promise.resolve().then(() => {
          this._syncChipsState();
        });
      }

      this._resetChips();

      // Check to see if we need to update our tab index
      this._updateTabIndex();

      // Check to see if we have a destroyed chip and need to refocus
      this._updateFocusForDestroyedChips();

      // Reposition autocomplete if present and open because size of list can be changed
      if (this._chipInput?.autocompleteTrigger?.autocomplete.isOpen) {
        // We have to delay position update after DOM is rendered
        Promise.resolve().then(() => {
          this._chipInput?.autocompleteTrigger?.updatePosition();
        });
      }

      this.stateChanges.next();
    });
  }

  ngOnInit() {
    this.stateChanges.next();
  }

  ngDoCheck() {
    if (this.ngControl) {
      // We need to re-evaluate this on every change detection cycle, because there are some
      // error triggers that we can't subscribe to (e.g. parent form submissions). This means
      // that whatever logic is in here has to be super lean or we risk destroying the performance.
      this.updateErrorState();

      if (this.ngControl.disabled !== this._disabled) {
        this.disabled = !!this.ngControl.disabled;
      }
    }
  }

  ngOnDestroy() {
    this._keyManager?.destroy();
    this._destroyed.next();
    this._destroyed.complete();
    this.stateChanges.complete();
    this._dropSubscriptions();
  }

  /** Associates an HTML input element with this chip list. */
  registerInput(inputElement: SbbChipTextControl): void {
    this._chipInput = inputElement;

    // We use this attribute to match the chip list to its input in test harnesses.
    // Set the attribute directly here to avoid "changed after checked" errors.
    this._elementRef.nativeElement.setAttribute('data-sbb-chip-input', inputElement.id);
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

  // Implemented as part of ControlValueAccessor.
  writeValue(value: any): void {}

  // Implemented as part of ControlValueAccessor.
  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  // Implemented as part of ControlValueAccessor.
  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  // Implemented as part of ControlValueAccessor.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }

  /**
   * Implemented as part of SbbFormFieldControl.
   * @docs-private
   */
  onContainerClick(event: MouseEvent) {
    if (!this._originatesFromChip(event)) {
      this.focus();
    }
  }

  /**
   * Focuses the first non-disabled chip in this chip list, or the associated input when there
   * are no eligible chips.
   */
  focus(options?: FocusOptions): void {
    if (this.disabled) {
      return;
    }

    // Focus on first element if there's no chipInput inside chip-list
    if (this._chipInput && this._chipInput.focused) {
      // do nothing
    } else if (this.chips.length > 0) {
      this._keyManager.setFirstItemActive();
      this.stateChanges.next();
    } else {
      this._focusInput(options);
      this.stateChanges.next();
    }
  }

  /** Attempt to focus an input if we have one. */
  _focusInput(options?: FocusOptions) {
    if (this._chipInput) {
      this._chipInput.focus(options);
    }
  }

  /**
   * Pass events to the keyboard manager. Available here for tests.
   */
  _keydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;

    if (target && target.classList.contains('sbb-chip')) {
      this._keyManager.onKeydown(event);
      this.stateChanges.next();
    }
  }

  /**
   * Check the tab index as you should not be allowed to focus an empty list.
   */
  protected _updateTabIndex(): void {
    // If we have 0 chips, we should not allow keyboard focus
    this._tabIndex = this._userTabIndex || (this.chips.length === 0 ? -1 : 0);
  }

  /**
   * If the amount of chips changed, we need to update the
   * key manager state and focus the next closest chip.
   */
  protected _updateFocusForDestroyedChips() {
    // Move focus to the closest chip. If no other chips remain, focus the chip-list itself.
    if (this._lastDestroyedChipIndex != null) {
      if (this.chips.length) {
        const newChipIndex = Math.min(this._lastDestroyedChipIndex, this.chips.length - 1);
        this._keyManager.setActiveItem(newChipIndex);
      } else {
        this.focus();
      }
    }

    this._lastDestroyedChipIndex = null;
  }

  /**
   * Utility to ensure all indexes are valid.
   *
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of chips.
   */
  private _isValidIndex(index: number): boolean {
    return index >= 0 && index < this.chips.length;
  }

  /** Refreshes the error state of the chip grid. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }

  /** When blurred, mark the field as touched when focus moved outside the chip list. */
  _blur() {
    if (!this._hasFocusedChip()) {
      this._keyManager.setActiveItem(-1);
    }

    if (!this.disabled) {
      if (this._chipInput) {
        // If there's a chip input, we should check whether the focus moved to chip input.
        // If the focus is not moved to chip input, mark the field as touched. If the focus moved
        // to chip input, do nothing.
        // Timeout is needed to wait for the focus() event trigger on chip input.
        setTimeout(() => {
          if (!this.focused) {
            this._markAsTouched();
          }
        });
      } else {
        // If there's no chip input, then mark the field as touched.
        this._markAsTouched();
      }
    }
  }

  /** Mark the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }

  /**
   * Removes the `tabindex` from the chip list and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the list from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  _allowFocusEscape() {
    if (this._tabIndex !== -1) {
      this._tabIndex = -1;
      this._changeDetectorRef.markForCheck();

      setTimeout(() => {
        this._tabIndex = this._userTabIndex || 0;
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  private _resetChips() {
    this._dropSubscriptions();
    this._listenToChipsFocus();
    this._listenToChipsRemoved();
  }

  private _dropSubscriptions() {
    if (this._chipFocusSubscription) {
      this._chipFocusSubscription.unsubscribe();
      this._chipFocusSubscription = null;
    }

    if (this._chipBlurSubscription) {
      this._chipBlurSubscription.unsubscribe();
      this._chipBlurSubscription = null;
    }

    if (this._chipRemoveSubscription) {
      this._chipRemoveSubscription.unsubscribe();
      this._chipRemoveSubscription = null;
    }
  }

  /** Listens to user-generated selection events on each chip. */
  private _listenToChipsFocus(): void {
    this._chipFocusSubscription = this.chipFocusChanges.subscribe((event) => {
      const chipIndex: number = this.chips.toArray().indexOf(event.chip);

      if (this._isValidIndex(chipIndex)) {
        this._keyManager.updateActiveItem(chipIndex);
      }
      this.stateChanges.next();
    });

    this._chipBlurSubscription = this.chipBlurChanges.subscribe(() => {
      this._blur();
      this.stateChanges.next();
    });
  }

  private _listenToChipsRemoved(): void {
    this._chipRemoveSubscription = this.chipRemoveChanges.subscribe((event) => {
      const chip = event.chip;
      const chipIndex = this.chips.toArray().indexOf(event.chip);

      // In case the chip that will be removed is currently focused, we temporarily store
      // the index in order to be able to determine an appropriate sibling chip that will
      // receive focus.
      if (this._isValidIndex(chipIndex) && chip._hasFocus) {
        this._lastDestroyedChipIndex = chipIndex;
      }
    });
  }

  /** Checks whether an event comes from inside a chip element. */
  private _originatesFromChip(event: Event): boolean {
    let currentElement = event.target as HTMLElement | null;

    while (currentElement && currentElement !== this._elementRef.nativeElement) {
      if (currentElement.classList.contains('sbb-chip')) {
        return true;
      }

      currentElement = currentElement.parentElement;
    }

    return false;
  }

  /** Checks whether any of the chips is focused. */
  private _hasFocusedChip() {
    return this.chips && this.chips.some((chip) => chip._hasFocus);
  }

  /** Syncs the list's state with the individual chips. */
  private _syncChipsState() {
    if (this.chips) {
      this.chips.forEach((chip) => {
        chip._chipListDisabled = this._disabled;
      });
    }
  }
}
