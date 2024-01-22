import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { BACKSPACE, DELETE } from '@angular/cdk/keycodes';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { CanDisable, HasTabIndex, mixinTabIndex, TypeRef } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import type { SbbChipList } from './chip-list';
import { SBB_CHIP, SBB_CHIP_LIST } from './chip-tokens';

/** Represents an event fired on an individual `sbb-chip`. */
export interface SbbChipEvent {
  /** The chip the event was fired on. */
  chip: SbbChip;
}

/**
 * Injection token that can be used to reference instances of `SbbChipRemove`. It serves as
 * alternative token to the actual `SbbChipRemove` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_CHIP_REMOVE = new InjectionToken<SbbChipRemove>('SbbChipRemove');

/**
 * Injection token that can be used to reference instances of `SbbChipTrailingIcon`. It serves as
 * alternative token to the actual `SbbChipTrailingIcon` class which could cause unnecessary
 * retention of the class and its directive metadata.
 */
export const SBB_CHIP_TRAILING_ICON = new InjectionToken<SbbChipTrailingIcon>(
  'SbbChipTrailingIcon',
);

// Boilerplate for applying mixins to SbbChip.
/** @docs-private */
abstract class SbbChipBase {
  abstract disabled: boolean;
  constructor(public _elementRef: ElementRef) {}
}

// tslint:disable-next-line:naming-convention
const _SbbChipMixinBase = mixinTabIndex(SbbChipBase, -1);

/**
 * Dummy directive to add CSS class to chip trailing icon.
 * @docs-private
 */
@Directive({
  selector: 'sbb-chip-trailing-icon, [sbbChipTrailingIcon]',
  host: { class: 'sbb-chip-trailing-icon' },
  providers: [{ provide: SBB_CHIP_TRAILING_ICON, useExisting: SbbChipTrailingIcon }],
})
export class SbbChipTrailingIcon {}

/**
 * Design styled Chip component. Used inside the SbbChipList component.
 */
@Component({
  selector: `sbb-basic-chip, [sbb-basic-chip], sbb-chip, [sbb-chip]`,
  inputs: ['tabIndex'],
  exportAs: 'sbbChip',
  template: ` <ng-content></ng-content>
    @if (removable && !removeIcon) {
      <sbb-icon sbbChipRemove svgIcon="cross-small"> </sbb-icon>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-chip sbb-icon-scaled sbb-button-reset-frameless',
    '[attr.tabindex]': 'disabled ? null : tabIndex',
    '[attr.role]': 'role',
    '[class.sbb-chip-with-trailing-icon]': 'trailingIcon || removable',
    '[class.sbb-chip-disabled]': 'disabled',
    '[attr.disabled]': 'disabled || null',
    '[attr.aria-disabled]': 'disabled.toString()',
    '(click)': '_handleClick($event)',
    '(keydown)': '_handleKeydown($event)',
    '(focus)': 'focus()',
    '(blur)': '_blur()',
  },
  providers: [{ provide: SBB_CHIP, useExisting: SbbChip }],
})
export class SbbChip
  extends _SbbChipMixinBase
  implements FocusableOption, OnDestroy, HasTabIndex, CanDisable
{
  /** Whether the chip has focus. */
  _hasFocus: boolean = false;

  /** Whether animations for the chip are enabled. */
  _animationsDisabled: boolean;

  /** Whether the chip list as a whole is disabled. */
  _chipListDisabled: boolean = false;

  /** The chip's trailing icon. */
  @ContentChild(SBB_CHIP_TRAILING_ICON) trailingIcon: SbbChipTrailingIcon;

  /** The chip's remove toggler. */
  @ContentChild(SBB_CHIP_REMOVE) removeIcon: SbbChipRemove;

  /** ARIA role that should be applied to the chip. */
  @Input() role: string = 'option';

  /** The value of the chip. Defaults to the content inside `<sbb-chip>` tags. */
  @Input()
  get value(): any {
    return this._value !== undefined ? this._value : this._elementRef.nativeElement.textContent;
  }
  set value(value: any) {
    this._value = value;
  }
  protected _value: any;

  /** Whether the chip is disabled. */
  @Input()
  get disabled(): boolean {
    return this._chipListDisabled || this._disabled;
  }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  protected _disabled: boolean = false;

  /**
   * Determines whether the chip displays the remove styling and emits (removed) events.
   */
  @Input()
  get removable(): boolean {
    return this._removable;
  }
  set removable(value: BooleanInput) {
    this._removable = coerceBooleanProperty(value);
  }
  protected _removable: boolean = true;

  /** Emits when the chip is focused. */
  readonly _onFocus = new Subject<SbbChipEvent>();

  /** Emits when the chip is blurred. */
  readonly _onBlur = new Subject<SbbChipEvent>();

  /** Emitted when the chip is destroyed. */
  @Output() readonly destroyed: EventEmitter<SbbChipEvent> = new EventEmitter<SbbChipEvent>();

  /**
   * Emitted when a chip is to be removed.
   *
   * If a FormControl (Array or Set) on the sbb-chip-list is present and no subscriber
   * listens to (removed), the input value will automatically be removed from
   * the FormControl collection.
   */
  @Output() readonly removed: EventEmitter<SbbChipEvent> = new EventEmitter<SbbChipEvent>();

  constructor(
    public override _elementRef: ElementRef<HTMLElement>,
    private _ngZone: NgZone,
    @Optional()
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Host() @Inject(SBB_CHIP_LIST) private _chipList?: TypeRef<SbbChipList>,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string,
    @Attribute('tabindex') tabIndex?: string,
  ) {
    super(_elementRef);

    this._addHostClassName();

    this._animationsDisabled = animationMode === 'NoopAnimations';
    this.tabIndex = tabIndex != null ? parseInt(tabIndex, 10) || -1 : -1;
  }

  _addHostClassName() {
    const basicChipAttrName = 'sbb-basic-chip';
    const element = this._elementRef.nativeElement as HTMLElement;

    if (
      element.hasAttribute(basicChipAttrName) ||
      element.tagName.toLowerCase() === basicChipAttrName
    ) {
      element.classList.add(basicChipAttrName);
      return;
    } else {
      element.classList.add('sbb-standard-chip');
    }
  }

  ngOnDestroy() {
    this.destroyed.emit({ chip: this });
  }

  /** Allows for programmatic focusing of the chip. */
  focus(): void {
    if (!this._hasFocus) {
      this._elementRef.nativeElement.focus();
      this._onFocus.next({ chip: this });
    }
    this._hasFocus = true;
  }

  /**
   * Allows for programmatic removal of the chip. Called by the SbbChipList when the DELETE or
   * BACKSPACE keys are pressed.
   *
   * Informs any listeners of the removal request. Does not remove the chip from the DOM.
   */
  remove(): void {
    if (this.removable) {
      this._removeValueFromControl();
      this.removed.emit({ chip: this });
    }
  }

  private _removeValueFromControl() {
    const control = this._chipList?.ngControl?.control;
    if (!control || this.removed.observers.length) {
      return;
    }

    const currentCollection = control.value;
    const isArray = Array.isArray(currentCollection);
    const isSet = currentCollection instanceof Set;

    if (isArray) {
      if (!currentCollection.includes(this.value)) {
        return;
      }
      const indexInChipList = this._chipList?.chips.toArray().indexOf(this);
      if (indexInChipList! >= 0 && currentCollection[indexInChipList!] === this.value) {
        control.patchValue(currentCollection.filter((val, index) => indexInChipList !== index));
      } else {
        // Filter by value can delete more than one entry at once, so only use this as a fallback.
        control.patchValue(currentCollection.filter((val) => val !== this.value));
      }
    } else if (isSet) {
      const newCurrentCollection = new Set(currentCollection);
      newCurrentCollection.delete(this.value);
      control.patchValue(newCurrentCollection);
    }

    if (isArray || isSet) {
      control.markAsDirty();
    }
  }

  /** Handles click events on the chip. */
  _handleClick(event: Event) {
    if (this.disabled) {
      event.preventDefault();
    }
  }

  /** Handle custom key presses. */
  _handleKeydown(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }

    switch (event.keyCode) {
      case DELETE:
      case BACKSPACE:
        // If we are removable, remove the focused chip
        this.remove();
        // Always prevent so page navigation does not occur
        event.preventDefault();
        break;
    }
  }

  _blur(): void {
    // When animations are enabled, Angular may end up removing the chip from the DOM a little
    // earlier than usual, causing it to be blurred and throwing off the logic in the chip list
    // that moves focus not the next item. To work around the issue, we defer marking the chip
    // as not focused until the next time the zone stabilizes.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => {
      this._ngZone.run(() => {
        this._hasFocus = false;
        this._onBlur.next({ chip: this });
      });
    });
  }
}

/**
 * Applies proper (click) support and adds styling for use with the Sbb Design "cancel"
 *
 * You *may* use a custom icon, but you may need to override the `sbb-chip-remove` positioning
 * styles to properly center the icon within the chip.
 */
@Directive({
  selector: '[sbbChipRemove]',
  host: {
    class: 'sbb-chip-remove sbb-chip-trailing-icon',
    '(click)': '_handleClick($event)',
  },
  providers: [{ provide: SBB_CHIP_REMOVE, useExisting: SbbChipRemove }],
})
export class SbbChipRemove {
  constructor(
    protected _parentChip: SbbChip,
    elementRef: ElementRef<HTMLElement>,
  ) {
    if (elementRef.nativeElement.nodeName === 'BUTTON') {
      elementRef.nativeElement.setAttribute('type', 'button');
    }
  }

  /** Calls the parent chip's public `remove()` method if applicable. */
  _handleClick(event: Event): void {
    const parentChip = this._parentChip;

    if (parentChip.removable && !parentChip.disabled) {
      parentChip.remove();
    }

    // We need to stop event propagation because otherwise the event will bubble up to the
    // form field and cause the `onContainerClick` method to be invoked. This method would then
    // reset the focused chip that has been focused after chip removal. Usually the parent
    // the parent click listener of the `SbbChip` would prevent propagation, but it can happen
    // that the chip is being removed before the event bubbles up.
    event.stopPropagation();
    event.preventDefault();
  }
}
