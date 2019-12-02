import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import { merge, Subscription } from 'rxjs';

import { SortDirection } from '../sort-direction';
import { getSortHeaderNotContainedWithinSortError } from '../sort-error-functions';
import { SbbSortable, SbbSortDirective } from '../sort.component';

import { sbbSortAnimations } from './sort-animations';
import { SbbSortHeaderIntl } from './sort-header-intl';

/**
 * Valid positions for the arrow to be in for its opacity and translation. If the state is a
 * sort direction, the position of the arrow will be above/below and opacity 0. If the state is
 * hint, the arrow will be in the center with a slight opacity. Active state means the arrow will
 * be fully opaque in the center.
 *
 * @docs-private
 */
export type ArrowViewState = SortDirection | 'hint' | 'active';

/**
 * States describing the arrow's anisbbed position (anisbbing fromState to toState).
 * If the fromState is not defined, there will be no anisbbed transition to the toState.
 * @docs-private
 */
export interface ArrowViewStateTransition {
  fromState?: ArrowViewState;
  toState: ArrowViewState;
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
  templateUrl: 'sort-header.component.html',
  styleUrls: ['sort-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  animations: [
    sbbSortAnimations.indicator,
    sbbSortAnimations.leftPointer,
    sbbSortAnimations.rightPointer,
    sbbSortAnimations.arrowOpacity,
    sbbSortAnimations.arrowPosition,
    sbbSortAnimations.allowChildren
  ]
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

  constructor(
    @Optional() public _sort: SbbSortDirective,
    @Inject('SBB_SORT_HEADER_COLUMN_DEF') @Optional() public _columnDef: SbbSortHeaderColumnDef,
    public _intl: SbbSortHeaderIntl,
    changeDetectorRef: ChangeDetectorRef
  ) {
    if (!_sort) {
      throw getSortHeaderNotContainedWithinSortError();
    }

    this._rerenderSubscription = merge(
      _sort.sbbSortChange,
      _sort._stateChanges,
      _intl.changes
    ).subscribe(() => {
      if (this._isSorted()) {
        this._updateArrowDirection();
      }

      // If this header was recently active and now no longer sorted, anisbbe away the arrow.
      if (!this._isSorted() && this._viewState && this._viewState.toState === 'active') {
        this._disableViewStateAnimation = false;
        this._setAnimationTransitionState({ fromState: 'active', toState: this._arrowDirection });
      }

      changeDetectorRef.markForCheck();
    });
  }

  private _rerenderSubscription: Subscription;

  /**
   * Flag set to true when the indicator should be displayed while the sort is not active. Used to
   * provide an affordance that the header is sortable by showing on focus and hover.
   */
  _showIndicatorHint = false;

  /**
   * The view transition state of the arrow (translation/ opacity) - indicates its `from` and `to`
   * position through the animation. If anisbbions are currently disabled, the fromState is removed
   * so that there is no animation displayed.
   */
  _viewState: ArrowViewStateTransition;

  /** The direction the arrow should be facing according to the current state. */
  _arrowDirection: SortDirection = '';

  /**
   * Whether the view state animation should show the transition between the `from` and `to` states.
   */
  _disableViewStateAnimation = false;

  /**
   * ID of this sort header. If used within the context of a CdkColumnDef, this will default to
   * the column's name.
   */
  // tslint:disable-next-line:no-input-rename
  @Input('sbbSortHeader') id: string;

  /** Sets the position of the arrow that displays when sorted. */
  @Input() arrowPosition: 'before' | 'after' = 'after';

  /** Overrides the sort start value of the containing SbbSort for this SbbSortable. */
  @Input() start: 'asc' | 'desc';
  private _disableClear: boolean;

  @HostBinding('attr.aria-sort') sort = this._getAriaSortAttribute();

  @HostListener('mouseenter') onMouseEnter() {
    this._setIndicatorHintVisible(true);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this._setIndicatorHintVisible(false);
  }

  ngOnInit() {
    if (!this.id && this._columnDef) {
      this.id = this._columnDef.name;
    }

    // Initialize the direction of the arrow and set the view state to be immediately that state.
    this._updateArrowDirection();
    this._setAnimationTransitionState({
      toState: this._isSorted() ? 'active' : this._arrowDirection
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
  _setAnimationTransitionState(viewState: ArrowViewStateTransition) {
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

    // Do not show the animation if the header was already shown in the right position.
    if (this._viewState.toState === 'hint' || this._viewState.toState === 'active') {
      this._disableViewStateAnimation = true;
    }

    // If the arrow is now sorted, anisbbe the arrow into place. Otherwise, anisbbe it away into
    // the direction it is facing.
    const viewState: ArrowViewStateTransition = this._isSorted()
      ? { fromState: this._arrowDirection, toState: 'active' }
      : { fromState: 'active', toState: this._arrowDirection };
    this._setAnimationTransitionState(viewState);

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
   * in cases such as the sort becoming deactivated but we want to anisbbe the arrow away while
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
}
