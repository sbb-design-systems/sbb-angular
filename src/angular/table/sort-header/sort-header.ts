// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { merge, Subscription } from 'rxjs';

import { SbbSortable, SbbSortDirective } from '../sort/sort';
import { SbbSortDirection } from '../sort/sort-direction';
import { getSortHeaderNotContainedWithinSortError } from '../sort/sort-error-functions';

import { sbbSortAnimations } from './sort-animations';

/**
 * Valid positions for the arrow to be in for its opacity and translation. If the state is a
 * sort direction, the position of the arrow will be above/below and opacity 0. If the state is
 * hint, the arrow will be in the center with a slight opacity. Active state means the arrow will
 * be fully opaque in the center.
 *
 * @docs-private
 */
export type SbbArrowViewState = SbbSortDirection | 'hint' | 'active';

/**
 * States describing the arrow's animated position (animating fromState to toState).
 * If the fromState is not defined, there will be no animated transition to the toState.
 * @docs-private
 */
export interface SbbArrowViewStateTransition {
  fromState?: SbbArrowViewState;
  toState: SbbArrowViewState;
}

/** Column definition associated with a `SbbSortHeader`. */
interface SbbSortHeaderColumnDef {
  name: string;
}

/**
 * Applies sorting behavior (click to change sort) and styles to an element, including an
 * arrow to display the current sort direction.
 *
 * Must be provided with an id and contained within a parent SbbSort directive.
 *
 * If used on header cells in a CdkTable, it will automatically default its id from its containing
 * column definition.
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: '[sbbSortHeader]',
  exportAs: 'sbbSortHeader',
  templateUrl: 'sort-header.html',
  styleUrls: ['sort-header.css'],
  host: {
    class: 'sbb-sort-header',
    '[attr.aria-sort]': '_getAriaSortAttribute()',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  animations: [
    sbbSortAnimations.indicator,
    sbbSortAnimations.leftPointer,
    sbbSortAnimations.rightPointer,
    sbbSortAnimations.arrowOpacity,
    sbbSortAnimations.arrowPosition,
    sbbSortAnimations.allowChildren,
  ],
})
export class SbbSortHeaderComponent implements SbbSortable, OnDestroy, OnInit {
  /** Overrides the disable clear value of the containing SbbSort for this SbbSortable. */
  @Input()
  get disableClear(): boolean {
    return this._disableClear;
  }
  set disableClear(v) {
    this._disableClear = coerceBooleanProperty(v);
  }

  get _ariaLabelChangeSorting() {
    return typeof $localize === 'function'
      ? $localize`:Button label to change the sorting of column@@sbbTableChangeSorting:Change sorting for ${this.id}`
      : `Change sorting for ${this.id}`;
  }

  private _rerenderSubscription: Subscription;

  constructor(
    @Optional() public _sort: SbbSortDirective,
    @Inject('SBB_SORT_HEADER_COLUMN_DEF') @Optional() public _columnDef: SbbSortHeaderColumnDef,
    changeDetectorRef: ChangeDetectorRef
  ) {
    if (!_sort) {
      throw getSortHeaderNotContainedWithinSortError();
    }

    this._rerenderSubscription = merge(_sort.sbbSortChange, _sort._stateChanges).subscribe(() => {
      if (this._isSorted()) {
        this._updateArrowDirection();
      }

      // The following block is moved from _handleClick() as suggested by https://github.com/angular/components/issues/10242#issuecomment-587925784
      // This is an open bug at angular material https://github.com/angular/components/issues/10242.
      if (this._sort.active === this.id) {
        // Do not show the animation if the header was already shown in the right position.
        if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
          this._disableViewStateAnimation = true;
        }

        // If the arrow is now sorted, animate the arrow into place. Otherwise, animate it away into
        // the direction it is facing.
        const viewState: SbbArrowViewStateTransition = this._isSorted()
          ? { fromState: this._arrowDirection, toState: 'active' }
          : { fromState: 'active', toState: this._arrowDirection };
        this._setAnimationTransitionState(viewState);
      }

      // If this header was recently active and now no longer sorted, animate away the arrow.
      if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
        this._disableViewStateAnimation = false;
        this._setAnimationTransitionState({ fromState: 'active', toState: this._arrowDirection });
      }

      changeDetectorRef.markForCheck();
    });
  }

  /**
   * Flag set to true when the indicator should be displayed while the sort is not active. Used to
   * provide an affordance that the header is sortable by showing on focus and hover.
   */
  _showIndicatorHint: boolean = false;

  /**
   * The view transition state of the arrow (translation/ opacity) - indicates its `from` and `to`
   * position through the animation. If animations are currently disabled, the fromState is removed
   * so that there is no animation displayed.
   */
  _viewState: SbbArrowViewStateTransition;

  /** The direction the arrow should be facing according to the current state. */
  _arrowDirection: SbbSortDirection = '';

  /** Whether the view state animation should show the transition between the `from` and `to` states. */
  _disableViewStateAnimation: boolean = false;

  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  @Input('sbbSortHeader') id: string;

  /** Sets the position of the arrow that displays when sorted. */
  @Input() arrowPosition: 'before' | 'after' = 'after';

  /** Overrides the sort start value of the containing SbbSort for this SbbSortable. */
  @Input() start: 'asc' | 'desc';
  private _disableClear: boolean;

  @HostListener('mouseenter') _onMouseEnter() {
    this._setIndicatorHintVisible(true);
  }

  @HostListener('mouseleave') _onMouseLeave() {
    this._setIndicatorHintVisible(false);
  }

  ngOnInit() {
    if (!this.id && this._columnDef) {
      this.id = this._columnDef.name;
    }

    // Initialize the direction of the arrow and set the view state to be immediately that state.
    this._updateArrowDirection();
    this._setAnimationTransitionState({
      toState: this._isSorted() ? 'active' : this._arrowDirection,
    });

    this._sort.register(this);
  }

  ngOnDestroy() {
    this._sort.deregister(this);
    this._rerenderSubscription.unsubscribe();
  }

  /**
   * Sets the "hint" state such that the arrow will be semi-transparently displayed as a hint to the
   * user showing what the active sort will become. If set to false, the arrow will fade away.
   */
  _setIndicatorHintVisible(visible: boolean) {
    this._showIndicatorHint = visible;

    if (!this._isSorted()) {
      this._updateArrowDirection();
      if (this._showIndicatorHint) {
        this._setAnimationTransitionState({ fromState: this._arrowDirection, toState: 'hint' });
      } else {
        this._setAnimationTransitionState({ fromState: 'hint', toState: this._arrowDirection });
      }
    }
  }

  /**
   * Sets the animation transition view state for the arrow's position and opacity. If the
   * `disableViewStateAnimation` flag is set to true, the `fromState` will be ignored so that
   * no animation appears.
   */
  _setAnimationTransitionState(viewState: SbbArrowViewStateTransition) {
    this._viewState = viewState;

    // If the animation for arrow position state (opacity/translation) should be disabled,
    // remove the fromState so that it jumps right to the toState.
    if (this._disableViewStateAnimation) {
      this._viewState = { toState: viewState.toState };
    }
  }

  /** Triggers the sort on this sort header and removes the indicator hint. */
  @HostListener('click')
  _handleClick() {
    this._sort.sort(this);

    this._showIndicatorHint = false;
  }

  /** Whether this SbbSortHeader is currently sorted in either ascending or descending order. */
  _isSorted() {
    return (
      this._sort.active === this.id &&
      (this._sort.direction === 'asc' || this._sort.direction === 'desc')
    );
  }

  /** Returns the animation state for the arrow direction (indicator and pointers). */
  _getArrowDirectionState() {
    return `${this._isSorted() ? 'active-' : ''}${this._arrowDirection}`;
  }

  /** Returns the arrow position state (opacity, translation). */
  _getArrowViewState() {
    const fromState = this._viewState.fromState;
    return (fromState ? `${fromState}-to-` : '') + this._viewState.toState;
  }

  /**
   * Updates the direction the arrow should be pointing. If it is not sorted, the arrow should be
   * facing the start direction. Otherwise if it is sorted, the arrow should point in the currently
   * active sorted direction. The reason this is updated through a function is because the direction
   * should only be changed at specific times - when deactivated but the hint is displayed and when
   * the sort is active and the direction changes. Otherwise the arrow's direction should linger
   * in cases such as the sort becoming deactivated but we want to animate the arrow away while
   * preserving its direction, even though the next sort direction is actually different and should
   * only be changed once the arrow displays again (hint or activation).
   */
  _updateArrowDirection() {
    this._arrowDirection = this._isSorted() ? this._sort.direction : this.start || this._sort.start;
  }

  /**
   * Gets the aria-sort attribute that should be applied to this sort header. If this header
   * is not sorted, returns null so that the attribute is removed from the host element. Aria spec
   * says that the aria-sort property should only be present on one header at a time, so removing
   * ensures this is true.
   */
  _getAriaSortAttribute() {
    if (!this._isSorted()) {
      return null;
    }

    return this._sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_disableClear: BooleanInput;
  // tslint:enable: member-ordering
}
