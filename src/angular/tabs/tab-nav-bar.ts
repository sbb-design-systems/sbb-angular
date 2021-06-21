import { FocusableOption, FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty, NumberInput } from '@angular/cdk/coercion';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { CanDisable, HasTabIndex, mixinDisabled, mixinTabIndex } from '@sbb-esta/angular/core';
import { startWith, takeUntil } from 'rxjs/operators';

import { SbbPaginatedTabHeader, SbbPaginatedTabHeaderItem } from './paginated-tab-header';

/**
 * Base class with all of the `SbbTabNav` functionality.
 * @docs-private
 */
@Directive()
// tslint:disable-next-line:class-name naming-convention
export abstract class _SbbTabNavBase
  extends SbbPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, OnDestroy
{
  /** Query list of all tab links of the tab navigation. */
  abstract _items: QueryList<SbbPaginatedTabHeaderItem & { active: boolean }>;

  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(elementRef, changeDetectorRef, viewportRuler, ngZone, animationMode);
  }

  protected _itemSelected() {
    // noop
  }

  ngAfterContentInit() {
    // We need this to run before the `changes` subscription in parent to ensure that the
    // selectedIndex is up-to-date by the time the super class starts looking for it.
    this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      this.updateActiveLink();
    });

    super.ngAfterContentInit();
  }

  /** Notifies the component that the active link has been changed. */
  updateActiveLink() {
    if (!this._items) {
      return;
    }

    const items = this._items.toArray();

    for (let i = 0; i < items.length; i++) {
      if (items[i].active) {
        this.selectedIndex = i;
        this._changeDetectorRef.markForCheck();
        return;
      }
    }

    this.selectedIndex = -1;
  }
}

/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
@Component({
  selector: '[sbb-tab-nav-bar]',
  exportAs: 'sbbTabNavBar, sbbTabNav',
  templateUrl: 'tab-nav-bar.html',
  styleUrls: ['tab-nav-bar.css'],
  host: {
    class: 'sbb-tab-nav-bar sbb-tab-header',
  },
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SbbTabNav extends _SbbTabNavBase {
  @ContentChildren(forwardRef(() => SbbTabLink), { descendants: true })
  _items: QueryList<SbbTabLink>;
  @ViewChild('tabListContainer', { static: true }) _tabListContainer: ElementRef;
  @ViewChild('tabList', { static: true }) _tabList: ElementRef;

  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string
  ) {
    super(elementRef, ngZone, changeDetectorRef, viewportRuler, animationMode);
  }
}

// Boilerplate for applying mixins to SbbTabLink.
// tslint:disable-next-line:naming-convention
const _SbbTabLinkMixinBase = mixinTabIndex(mixinDisabled(class {}));

/** Base class with all of the `SbbTabLink` functionality. */
@Directive()
// tslint:disable-next-line:class-name naming-convention
export class _SbbTabLinkBase
  extends _SbbTabLinkMixinBase
  implements AfterViewInit, OnDestroy, CanDisable, HasTabIndex, FocusableOption
{
  /** Whether the tab link is active or not. */
  protected _isActive: boolean = false;

  /** Whether the link is active. */
  @Input()
  get active(): boolean {
    return this._isActive;
  }
  set active(value: boolean) {
    const newValue = coerceBooleanProperty(value);

    if (newValue !== this._isActive) {
      this._isActive = value;
      this._tabNavBar.updateActiveLink();
    }
  }

  constructor(
    private _tabNavBar: _SbbTabNavBase,
    /** @docs-private */ public elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
    private _focusMonitor: FocusMonitor
  ) {
    super();

    this.tabIndex = parseInt(tabIndex, 10) || 0;
  }

  /** Focuses the tab link. */
  focus() {
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewInit() {
    this._focusMonitor.monitor(this.elementRef);
  }

  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this.elementRef);
  }

  static ngAcceptInputType_active: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_tabIndex: NumberInput;
}

/**
 * Link inside of a `sbb-tab-nav-bar`.
 */
@Directive({
  selector: '[sbb-tab-link], [sbbTabLink]',
  exportAs: 'sbbTabLink',
  inputs: ['disabled', 'tabIndex'],
  host: {
    class: 'sbb-tab-link sbb-focus-indicator',
    '[attr.aria-current]': 'active ? "page" : null',
    '[attr.aria-disabled]': 'disabled',
    '[attr.tabIndex]': 'tabIndex',
    '[class.sbb-tab-disabled]': 'disabled',
    '[class.sbb-tab-label-active]': 'active',
  },
})
export class SbbTabLink extends _SbbTabLinkBase {
  constructor(
    tabNavBar: SbbTabNav,
    elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
    focusMonitor: FocusMonitor
  ) {
    super(tabNavBar, elementRef, tabIndex, focusMonitor);
  }
}
