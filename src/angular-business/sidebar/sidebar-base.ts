import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import {
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
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

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

/** @docs-private */
export interface SbbSidebarMobileCapableContainer {
  _mobile: boolean;
}

@Directive()
export abstract class SbbSidebarContentBase extends CdkScrollable {
  protected constructor(
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone
  ) {
    super(elementRef, scrollDispatcher, ngZone);
  }
}

/** This component corresponds to a sidebar. */
@Directive()
export abstract class SbbSidebarBase {
  abstract _mobileChanged(mobile: boolean): void;

  protected constructor(public _container: SbbSidebarMobileCapableContainer) {}
}

/**
 * This is the parent component to one or two `<sbb-sidebar>`s that validates the state internally
 * and coordinates the backdrop and content styling.
 */
@Directive()
export abstract class SbbSidebarContainerBase<T extends SbbSidebarBase>
  implements AfterContentInit, OnDestroy, SbbSidebarMobileCapableContainer
{
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
    protected _breakpointObserver: BreakpointObserver
  ) {}

  /** All sidebars, also nested sidebars included **/
  _allSidebars: QueryList<T>;

  /** Sidebars that belong to this container. */
  _sidebars: QueryList<T> = new QueryList<T>();

  _content: SbbSidebarContentBase;
  _userContent: SbbSidebarContentBase;

  /** The sidebar */
  protected _sidebar: T | null;

  /** Emits when the component is destroyed. */
  protected readonly _destroyed: Subject<void> = new Subject<void>();

  ngAfterContentInit() {
    this._allSidebars.changes
      .pipe(startWith(this._allSidebars), takeUntil(this._destroyed))
      .subscribe((allSidebars: QueryList<T>) => {
        this._sidebars.reset(allSidebars.filter((sidebar) => sidebar._container === this));
        this._sidebars.notifyOnChanges();
      });
  }

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

  private _updateMobileState(newMobile: boolean) {
    const currentMobile = this._mobile;
    this._mobile = newMobile;

    if (!this.sidebar || currentMobile === newMobile) {
      return;
    }

    this.sidebar._mobileChanged(newMobile);
    this._changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
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
}
