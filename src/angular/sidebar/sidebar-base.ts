import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkScrollable, ScrollDispatcher } from '@angular/cdk/scrolling';
import { DOCUMENT } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Output,
  QueryList,
} from '@angular/core';
import { Breakpoints } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';

/**
 * Throws an exception if more than one SbbSidebarBase is provided.
 * @docs-private
 */
export function throwSbbDuplicatedSidebarError(position: string) {
  throw Error(`A sidebar was already declared for 'position="${position}"'`);
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
    public _elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    ngZone: NgZone,
  ) {
    super(_elementRef, scrollDispatcher, ngZone);
  }
}

/** This component corresponds to a sidebar. */
@Directive({
  host: {
    '[class.sbb-sidebar-end]': 'position === "end"',
  },
  standalone: true,
})
export abstract class SbbSidebarBase implements AfterViewInit, OnDestroy {
  abstract _mobileChanged(mobile: boolean): void;

  /** Whether the view of the component has been attached. */
  private _isAttached: boolean;

  /** Anchor node used to restore the sidebar to its initial position. */
  private _anchor: Comment | null;

  /** The side that the sidebar is attached to. */
  @Input()
  set position(value: 'start' | 'end') {
    // Make sure we have a valid value.
    value = value === 'end' ? 'end' : 'start';
    if (value !== this._position) {
      // Static inputs in Ivy are set before the element is in the DOM.
      if (this._isAttached) {
        this._updatePositionInParent(value);
      }

      this._position = value;
      this.onPositionChanged.emit();
    }
  }
  get position() {
    return this._position;
  }
  _position: 'start' | 'end' = 'start';

  /** Event emitted when the sidebar's position changes. */
  @Output('positionChanged') readonly onPositionChanged = new EventEmitter<void>();

  protected constructor(
    public _container: SbbSidebarMobileCapableContainer,
    protected _elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) protected _doc: any,
  ) {}

  /*
   * Updates the position of the sidebar in the DOM. We need to move the element around ourselves
   * when it's in the `end` position so that it comes after the content and the visual order
   * matches the tab order. We also need to be able to move it back to `start` if the sidebar
   * started off as `end` and was changed to `start`.
   */
  protected _updatePositionInParent(newPosition: 'start' | 'end'): void {
    // Don't move the DOM node around on the server, because it can throw off hydration.
    const element = this._elementRef.nativeElement;
    const parent = element.parentNode!;

    if (newPosition === 'end') {
      if (!this._anchor) {
        this._anchor = this._doc.createComment('sbb-sidebar-anchor')!;
        parent.insertBefore(this._anchor!, element);
      }

      parent.appendChild(element);
    } else if (this._anchor) {
      this._anchor.parentNode!.insertBefore(element, this._anchor);
    }
  }

  ngAfterViewInit() {
    this._isAttached = true;

    // Only update the DOM position when the sidenav is positioned at
    // the end since we project the sidenav before the content by default.
    if (this._position === 'end') {
      this._updatePositionInParent('end');
    }
  }

  ngOnDestroy() {
    this._anchor?.remove();
    this._anchor = null;
  }
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

  /**
   * The sidebar child at the start or end position.
   * @deprecated Use `start` or `end` instead.
   * @breaking-change 19.0.0
   */
  get sidebar(): T | null {
    return this._start || this._end;
  }

  /** The sidebar child with the `start` position. */
  get start(): T | null {
    return this._start;
  }

  /** The sidebar child with the `end` position. */
  get end(): T | null {
    return this._end;
  }

  /** Reference to the CdkScrollable instance that wraps the scrollable content. */
  get scrollable(): CdkScrollable {
    return this._userContent || this._content;
  }

  protected constructor(
    protected _ngZone: NgZone,
    protected _changeDetectorRef: ChangeDetectorRef,
    protected _breakpointObserver: BreakpointObserver,
  ) {}

  /** All sidebars, also nested sidebars included **/
  _allSidebars: QueryList<T>;

  /** Sidebars that belong to this container. */
  _sidebars: QueryList<T> = new QueryList<T>();

  _content: SbbSidebarContentBase;
  _userContent: SbbSidebarContentBase;

  /** The sidebar at the start/end position. */
  protected _start: T | null;
  protected _end: T | null;

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
        takeUntil(this._destroyed),
      )
      .subscribe((newMobile) => this._updateMobileState(newMobile));
  }

  private _updateMobileState(newMobile: boolean) {
    const currentMobile = this._mobile;
    this._mobile = newMobile;

    if ((!this._start && !this._end) || currentMobile === newMobile) {
      return;
    }

    this._start?._mobileChanged(newMobile);
    this._end?._mobileChanged(newMobile);
    this._changeDetectorRef.markForCheck();
  }

  ngOnDestroy() {
    this._sidebars.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Validate the state of the sidebar children components. */
  protected _validateSidebars() {
    this._start = this._end = null;

    // Ensure that we have at most one start and one end sidebar.
    this._sidebars.forEach((sidebar) => {
      if (sidebar.position === 'end') {
        if (this._end != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
          throwSbbDuplicatedSidebarError('end');
        }
        this._end = sidebar;
      } else {
        if (this._start != null && (typeof ngDevMode === 'undefined' || ngDevMode)) {
          throwSbbDuplicatedSidebarError('start');
        }
        this._start = sidebar;
      }
    });
  }
}
