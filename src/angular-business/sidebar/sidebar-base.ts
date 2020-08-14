import { BreakpointObserver } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { CdkScrollable, ScrollDispatcher, ViewportRuler } from '@angular/cdk/scrolling';
import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  InjectionToken,
  NgZone,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { Breakpoints } from '@sbb-esta/angular-core/breakpoints';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

/**
 * Throws an exception if more than one SbbSidebarBase is provided.
 * @docs-private
 */
export function throwSbbDuplicatedSidebarError() {
  throw Error(`Only one sidebar as direct descendant of sidebar container at once is allowed'`);
}

/**
 * Used to provide a sidebar container to a sidebar while avoiding circular references.
 * @docs-private
 */
export const SBB_SIDEBAR_CONTAINER = new InjectionToken('SBB_SIDEBAR_CONTAINER');

export interface ISbbSidebarContainer {
  _contentMarginChanges: Subject<any>;
  _mobile: boolean;
}

@Directive()
export abstract class SbbSidebarContentBase extends CdkScrollable implements AfterContentInit {
  protected constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    public _container: ISbbSidebarContainer,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(elementRef, scrollDispatcher, ngZone);
  }

  ngAfterContentInit() {
    this._container._contentMarginChanges.subscribe(() => {
      this._changeDetectorRef.markForCheck();
    });
  }
}

/**
 * This component corresponds to a sidebar.
 */
@Directive()
export abstract class SbbSidebarBase implements AfterContentChecked {
  /** Whether the sidebar is initialized. Used for disabling the initial animation. */
  protected _enableAnimations = false;

  /** @docs-private **/
  abstract _mobileChanged(mobile: boolean): void;

  protected constructor(protected _platform: Platform, public _container: ISbbSidebarContainer) {}

  ngAfterContentChecked() {
    // Enable the animations after the lifecycle hooks have run, in order to avoid animating
    // sidebars that are open by default. When we're on the server, we shouldn't enable the
    // animations, because we don't want the sidebar to animate the first time the user sees
    // the page.
    if (this._platform.isBrowser) {
      this._enableAnimations = true;
    }
  }
}

/**
 * This is the parent component to one or two `<sbb-sidebar>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
@Directive()
export abstract class SbbSidebarContainerBase<T extends SbbSidebarBase>
  implements AfterContentInit, OnDestroy, ISbbSidebarContainer {
  /** @docs.private **/
  _mobile: boolean;

  /** The sidebar child */
  get sidebar(): T | null {
    return this._sidebar;
  }

  /** Reference to the CdkScrollable instance that wraps the scrollable content. */
  get scrollable(): CdkScrollable {
    return this._userContent || this._content;
  }

  protected constructor(
    protected _ngZone: NgZone,
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _breakpointObserver: BreakpointObserver,
    viewportRuler: ViewportRuler
  ) {
    // Since the minimum width of the sidebar depends on the viewport width,
    // we need to recompute the margins if the viewport changes.
    viewportRuler
      .change()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.updateContentMargins());
  }

  /** All sidebars, also nested sidebars included **/
  _allSidebars: QueryList<T>;

  /** Sidebars that belong to this container. */
  _sidebars = new QueryList<T>();

  _content: SbbSidebarContentBase;
  _userContent: SbbSidebarContentBase;

  /** The sidebar */
  protected _sidebar: T | null;

  /** Emits when the component is destroyed. */
  protected readonly _destroyed = new Subject<void>();

  /** Emits on every ngDoCheck. Used for debouncing reflows. */
  protected readonly _doCheckSubject = new Subject<void>();

  abstract readonly _contentMarginChanges: Subject<any>;

  ngAfterContentInit() {
    this._allSidebars.changes
      .pipe(startWith(this._allSidebars), takeUntil(this._destroyed))
      .subscribe((allSidebars: QueryList<T>) => {
        this._sidebars.reset(allSidebars.filter((sidebar) => sidebar._container === this));
        this._sidebars.notifyOnChanges();
      });

    // Avoid hitting the NgZone through the debounce timeout.
    this._ngZone.runOutsideAngular(() => {
      this._doCheckSubject
        .pipe(
          debounceTime(10), // Arbitrary debounce time, less than a frame at 60fps
          takeUntil(this._destroyed)
        )
        .subscribe(() => this.updateContentMargins());
    });
  }

  /** @docs-private **/
  protected _watchBreakpointObserver() {
    this._breakpointObserver
      .observe(Breakpoints.Mobile)
      .pipe(
        map((r) => r.matches),
        distinctUntilChanged(),
        takeUntil(this._destroyed)
      )
      .subscribe((newMobile) => this._updateMobileState(newMobile));
  }

  /**
   * @docs-private
   */
  _updateMobileState(newMobile: boolean) {
    const currentMobile = this._mobile;
    this._mobile = newMobile;

    if (!this.sidebar || currentMobile === newMobile) {
      return;
    }

    this.sidebar._mobileChanged(newMobile);
    this._changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this._contentMarginChanges.complete();
    this._doCheckSubject.complete();
    this._sidebars.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Validate the state of the sidebar children components. */
  protected _validateSidebars() {
    this._sidebar = null;

    // Ensure that we have at most one sidebar.
    if (this._sidebars.length > 1) {
      throwSbbDuplicatedSidebarError();
    }
    this._sidebar = this._sidebars.first;
  }

  abstract updateContentMargins(): void;
}
