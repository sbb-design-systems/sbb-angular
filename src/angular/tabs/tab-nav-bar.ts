import { FocusableOption, FocusMonitor } from '@angular/cdk/a11y';
import { ENTER, SPACE } from '@angular/cdk/keycodes';
import { CdkObserveContent } from '@angular/cdk/observers';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  ANIMATION_MODULE_TYPE,
  Attribute,
  booleanAttribute,
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
  numberAttribute,
  OnDestroy,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { startWith, takeUntil } from 'rxjs/operators';

import { SbbPaginatedTabHeader } from './paginated-tab-header';

// Increasing integer for generating unique ids for tab nav components.
let nextUniqueId = 0;

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
    '[attr.role]': '_getRole()',
    class: 'sbb-tab-nav-bar sbb-tab-header',
    '[class.sbb-tab-header-pagination-controls-enabled]': `_showPaginationControls && this.variantSnapshot === 'lean'`,
  },
  encapsulation: ViewEncapsulation.None,
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [SbbIcon, CdkObserveContent],
})
export class SbbTabNav
  extends SbbPaginatedTabHeader
  implements AfterContentChecked, AfterContentInit, OnDestroy
{
  /** Query list of all tab links of the tab navigation. */
  @ContentChildren(forwardRef(() => SbbTabLink), { descendants: true })
  _items: QueryList<SbbTabLink>;

  /**
   * Associated tab panel controlled by the nav bar. If not provided, then the nav bar
   * follows the ARIA link / navigation landmark pattern. If provided, it follows the
   * ARIA tabs design pattern.
   */
  @Input() tabPanel?: SbbTabNavPanel;

  @ViewChild('tabListContainer', { static: true }) _tabListContainer: ElementRef;
  @ViewChild('tabList', { static: true }) _tabList: ElementRef;
  @ViewChild('tabListInner', { static: true }) _tabListInner: ElementRef;
  @ViewChild('nextPaginator') _nextPaginator: ElementRef<HTMLElement>;
  @ViewChild('previousPaginator') _previousPaginator: ElementRef<HTMLElement>;

  constructor(
    elementRef: ElementRef,
    ngZone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    viewportRuler: ViewportRuler,
    platform: Platform,
    @Optional() @Inject(ANIMATION_MODULE_TYPE) animationMode?: string,
  ) {
    super(elementRef, changeDetectorRef, viewportRuler, ngZone, platform, animationMode);
  }

  protected _itemSelected() {
    // noop
  }

  override ngAfterContentInit() {
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

        if (this.tabPanel) {
          this.tabPanel._activeTabId = items[i].id;
        }

        return;
      }
    }

    this.selectedIndex = -1;
  }

  _getRole(): string | null {
    return this.tabPanel ? 'tablist' : this._elementRef.nativeElement.getAttribute('role');
  }
}

/**
 * Link inside of a `sbb-tab-nav-bar`.
 */
@Directive({
  selector: '[sbb-tab-link], [sbbTabLink]',
  exportAs: 'sbbTabLink',
  host: {
    class: 'sbb-tab-link sbb-link-reset',
    '[attr.aria-controls]': '_getAriaControls()',
    '[attr.aria-current]': '_getAriaCurrent()',
    '[attr.aria-disabled]': 'disabled',
    '[attr.aria-selected]': '_getAriaSelected()',
    '[attr.id]': 'id',
    '[attr.tabIndex]': '_getTabIndex()',
    '[attr.role]': '_getRole()',
    '[class.sbb-tab-disabled]': 'disabled',
    '[class.sbb-tab-label-active]': 'active',
    '(focus)': '_handleFocus()',
    '(keydown)': '_handleKeydown($event)',
  },
  standalone: true,
})
export class SbbTabLink implements AfterViewInit, OnDestroy, FocusableOption {
  /** Whether the tab link is disabled. */
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  /** Tab index for the tab link. */
  @Input({ transform: (value: unknown) => (value == null ? 0 : numberAttribute(value)) })
  tabIndex: number = 0;

  /** Whether the link is active. */
  @Input({ transform: booleanAttribute })
  get active(): boolean {
    return this._isActive;
  }
  set active(value: boolean) {
    if (value !== this._isActive) {
      this._isActive = value;
      this._tabNavBar.updateActiveLink();
    }
  }
  protected _isActive: boolean = false;

  /** Unique id for the tab. */
  @Input() id: string = `sbb-tab-link-${nextUniqueId++}`;

  constructor(
    private _tabNavBar: SbbTabNav,
    /** @docs-private */ public elementRef: ElementRef,
    @Attribute('tabindex') tabIndex: string,
    private _focusMonitor: FocusMonitor,
  ) {
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

  _handleFocus() {
    // Since we allow navigation through tabbing in the nav bar, we
    // have to update the focused index whenever the link receives focus.
    this._tabNavBar.focusIndex = this._tabNavBar._items.toArray().indexOf(this);
  }

  _handleKeydown(event: KeyboardEvent) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      if (this.disabled) {
        event.preventDefault();
      } else if (this._tabNavBar.tabPanel) {
        // Only prevent the default action on space since it can scroll the page.
        // Don't prevent enter since it can break link navigation.
        if (event.keyCode === SPACE) {
          event.preventDefault();
        }
        this.elementRef.nativeElement.click();
      }
    }
  }

  _getAriaControls(): string | null {
    return this._tabNavBar.tabPanel
      ? this._tabNavBar.tabPanel?.id
      : this.elementRef.nativeElement.getAttribute('aria-controls');
  }

  _getAriaSelected(): string | null {
    if (this._tabNavBar.tabPanel) {
      return this.active ? 'true' : 'false';
    } else {
      return this.elementRef.nativeElement.getAttribute('aria-selected');
    }
  }

  _getAriaCurrent(): string | null {
    return this.active && !this._tabNavBar.tabPanel ? 'page' : null;
  }

  _getRole(): string | null {
    return this._tabNavBar.tabPanel ? 'tab' : this.elementRef.nativeElement.getAttribute('role');
  }

  _getTabIndex(): number {
    if (this._tabNavBar.tabPanel) {
      return this._isActive ? 0 : -1;
    } else {
      return this.disabled ? -1 : this.tabIndex;
    }
  }
}

/**
 * Link inside of a `sbb-tab-nav-bar`.
 */
/**
 * Tab panel component associated with SbbTabNav.
 */
@Component({
  selector: 'sbb-tab-nav-panel',
  exportAs: 'sbbTabNavPanel',
  template: '<ng-content></ng-content>',
  host: {
    '[attr.aria-labelledby]': '_activeTabId',
    '[attr.id]': 'id',
    class: 'sbb-tab-nav-panel',
    role: 'tabpanel',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SbbTabNavPanel {
  /** Unique id for the tab panel. */
  @Input() id: string = `sbb-tab-nav-panel-${nextUniqueId++}`;

  /** Id of the active tab in the nav bar. */
  _activeTabId?: string;
}
