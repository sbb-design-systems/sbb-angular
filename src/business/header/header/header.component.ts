import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import { FocusMonitor, FocusOrigin, FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ENTER, ESCAPE, hasModifierKey, SPACE } from '@angular/cdk/keycodes';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkPortal, CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Breakpoints } from '@sbb-esta/angular-core/breakpoints';
import { fromEvent, merge, NEVER, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';

import { AppChooserSectionComponent } from '../app-chooser-section/app-chooser-section.component';

import { SBB_HEADER } from './header';

/** Result of the toggle promise that indicates the state of the header menu. */
export type SbbHeaderMenuToggleResult = 'open' | 'close';

@Component({
  selector: 'sbb-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [
    trigger('menu', [
      state(
        'open',
        style({
          left: 0
        })
      ),
      state(
        'void',
        style({
          left: -305,
          visibility: 'hidden'
        })
      ),
      transition('open => void, void => open', [animate('0.3s ease-in-out')])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: SBB_HEADER, useExisting: HeaderComponent }]
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  /** @docs-private */
  @HostBinding('class.sbb-header') cssClass = true;

  /**
   * Main title shown in the header.
   */
  @Input()
  label: String;

  /**
   * Subtitle shown below the main title, if present.
   */
  @Input()
  subtitle?: String;

  /**
   * String representing the kind of environment the application is running in.
   * Will be shown in a ribbon, top-left corner of the header.
   */
  @Input()
  environment?: String;

  /**
   * Background color for the ribbon, if present.
   */
  @Input()
  environmentColor?: String;

  /**
   * Whether the header menu is open.
   */
  @HostBinding('attr.opened')
  get opened(): boolean {
    return this._opened;
  }
  set opened(value: boolean) {
    this.toggleMenu(coerceBooleanProperty(value));
  }
  private _opened = false;

  /** Emits whenever the header menu has started animating. */
  _animationStarted = new Subject<AnimationEvent>();

  /** Emits whenever the header menu is done animating. */
  _animationEnd = new Subject<AnimationEvent>();

  /** Current state of the menu animation. */
  _animationState: 'open' | 'void' = 'void';

  /** Event emitted when the header menu open state is changed. */
  @Output() readonly openedChange: EventEmitter<boolean> =
    // Note this has to be async in order to avoid some issues with two-bindings (see #8872).
    new EventEmitter<boolean>(/* isAsync */ true);

  /** Event emitted when the header menu has been opened. */
  @Output('opened')
  get _openedStream(): Observable<void> {
    return this.openedChange.pipe(
      filter(o => o),
      map(() => {})
    );
  }

  /** Event emitted when the header menu has started opening. */
  @Output()
  get openedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter(e => e.fromState !== e.toState && e.toState.indexOf('open') === 0),
      map(() => {})
    );
  }

  /** Event emitted when the header menu has been closed. */
  @Output('closed')
  get _closedStream(): Observable<void> {
    return this.openedChange.pipe(
      filter(o => !o),
      map(() => {})
    );
  }

  /** Event emitted when the header menu has started closing. */
  @Output()
  get closedStart(): Observable<void> {
    return this._animationStarted.pipe(
      filter(e => e.fromState !== e.toState && e.toState === 'void'),
      map(() => {})
    );
  }

  /** @docs-private */
  @ViewChild('menu', { static: true }) _menuElement: ElementRef<HTMLElement>;
  /** @docs-private */
  @ViewChild(CdkPortal) _navigationPortal;
  /** @docs-private */
  @ViewChild('mainMenuOutlet', { static: true }) _mainMenuOutlet: CdkPortalOutlet;
  /** @docs-private */
  @ViewChild('sideMenuOutlet', { static: true }) _sideMenuOutlet: CdkPortalOutlet;
  /** @docs-private */
  @ContentChildren(AppChooserSectionComponent) _appChooserSections: QueryList<
    AppChooserSectionComponent
  >;

  /** How the sidenav was opened (keypress, mouse click etc.) */
  private _openedVia: FocusOrigin | null;

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  private _focusTrap: FocusTrap;
  private _elementFocusedBeforeMenuWasOpened: HTMLElement | null = null;

  constructor(
    private _focusTrapFactory: FocusTrapFactory,
    private _focusMonitor: FocusMonitor,
    private _ngZone: NgZone,
    private _breakpointObserver: BreakpointObserver,
    private _changeDetectorRef: ChangeDetectorRef,
    @Optional() private _router: Router,
    @Optional() @Inject(DOCUMENT) private _doc: any
  ) {
    this.openedChange.subscribe((opened: boolean) => {
      if (opened) {
        if (this._doc) {
          this._elementFocusedBeforeMenuWasOpened = this._doc.activeElement as HTMLElement;
        }

        if (this.opened && this._focusTrap) {
          this._trapFocus();
        }
        if (this._doc && this.opened) {
          /**
           * Listen to `keydown` events outside the zone so that change detection is not run every
           * time a key is pressed. Instead we re-enter the zone only if the `ESC` key is pressed.
           */
          this._ngZone.runOutsideAngular(() => {
            merge(
              fromEvent<KeyboardEvent>(this._menuElement.nativeElement, 'keydown').pipe(
                filter(event => event.keyCode === ESCAPE && !hasModifierKey(event))
              ),
              this._router
                ? this._router.events.pipe(filter(e => e instanceof NavigationStart))
                : NEVER
            )
              .pipe(takeUntil(this.openedChange))
              .subscribe(() => this._ngZone.run(() => this.closeMenu()));
          });
        }
      } else {
        this._restoreFocus();
      }
    });

    // We need a Subject with distinctUntilChanged, because the `done` event
    // fires twice on some browsers. See https://github.com/angular/angular/issues/24084
    this._animationEnd
      .pipe(
        distinctUntilChanged((x, y) => {
          return x.fromState === y.fromState && x.toState === y.toState;
        })
      )
      .subscribe((event: AnimationEvent) => {
        const { fromState, toState } = event;

        if (
          (toState.indexOf('open') === 0 && fromState === 'void') ||
          (toState === 'void' && fromState.indexOf('open') === 0)
        ) {
          this.openedChange.emit(this._opened);
        }
      });
  }

  ngOnInit() {
    this._checkLabel();
  }

  ngAfterViewInit() {
    this._focusTrap = this._focusTrapFactory.create(this._menuElement.nativeElement);
    this._updateFocusTrapState();
    this._breakpointObserver
      .observe(Breakpoints.DesktopAndAbove)
      .pipe(
        takeUntil(this._destroyed),
        map(r => r.matches),
        distinctUntilChanged()
      )
      .subscribe(isDesktop => {
        if (isDesktop) {
          this._sideMenuOutlet.detach();
          this._mainMenuOutlet.attachTemplatePortal(this._navigationPortal);
        } else {
          this._mainMenuOutlet.detach();
          this._sideMenuOutlet.attachTemplatePortal(this._navigationPortal);
        }
      });
  }

  ngOnDestroy() {
    if (this._focusTrap) {
      this._focusTrap.destroy();
    }

    this._animationStarted.complete();
    this._animationEnd.complete();
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** @docs-private */
  _openOnKeydownTrigger(event: KeyboardEvent) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      this.openMenu('keyboard');
    }
  }

  /**
   * Open the header menu.
   * @param openedVia Whether the header menu was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  openMenu(openedVia?: FocusOrigin): Promise<SbbHeaderMenuToggleResult> {
    return this.toggleMenu(true, openedVia);
  }

  /** @docs-private */
  _closeOnKeydownTrigger(event: KeyboardEvent) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      this.closeMenu();
    }
  }

  /** @docs-private */
  _onBackdropClicked() {
    this.closeMenu();
  }

  /** Close the header menu. */
  closeMenu(): Promise<SbbHeaderMenuToggleResult> {
    return this.toggleMenu(false);
  }

  /**
   * Toggle the header menu.
   * @param isOpen Whether the header menu should be open.
   * @param openedVia Whether the header menu was opened by a key press, mouse click or programmatically.
   * Used for focus management after the sidenav is closed.
   */
  toggleMenu(
    isOpen: boolean = !this.opened,
    openedVia: FocusOrigin = 'program'
  ): Promise<SbbHeaderMenuToggleResult> {
    this._opened = isOpen;

    if (isOpen) {
      this._animationState = 'open';
      this._openedVia = openedVia;
    } else {
      this._animationState = 'void';
      this._changeDetectorRef.markForCheck();
      this._restoreFocus();
    }

    this._updateFocusTrapState();

    return new Promise<SbbHeaderMenuToggleResult>(resolve => {
      this.openedChange.pipe(take(1)).subscribe(open => resolve(open ? 'open' : 'close'));
    });
  }

  /** @docs-private */
  _animationStartListener(event: AnimationEvent) {
    this._animationStarted.next(event);
  }

  /** @docs-private */
  _animationDoneListener(event: AnimationEvent) {
    this._animationEnd.next(event);
  }

  /** Validates required inputs. */
  private _checkLabel() {
    if (!this.label) {
      throw new Error('You must set [label] for sbb-header.');
    }
  }

  /** Traps focus inside the header menu. */
  private _trapFocus() {
    this._focusTrap.focusInitialElementWhenReady().then(hasMovedFocus => {
      // If there were no focusable elements, focus the sidenav itself so the keyboard navigation
      // still works. We need to check that `focus` is a function due to Universal.
      if (!hasMovedFocus && typeof this._menuElement.nativeElement.focus === 'function') {
        this._menuElement.nativeElement.focus();
      }
    });
  }

  /**
   * If focus is currently inside the header menu, restores it to where it was before
   * the header menu opened.
   */
  private _restoreFocus() {
    const activeEl = this._doc && this._doc.activeElement;

    if (activeEl && this._menuElement.nativeElement.contains(activeEl)) {
      if (this._elementFocusedBeforeMenuWasOpened instanceof HTMLElement) {
        this._focusMonitor.focusVia(this._elementFocusedBeforeMenuWasOpened, this._openedVia);
      } else {
        this._menuElement.nativeElement.blur();
      }
    }

    this._elementFocusedBeforeMenuWasOpened = null;
    this._openedVia = null;
  }

  /** Updates the enabled state of the focus trap. */
  private _updateFocusTrapState() {
    if (this._focusTrap) {
      this._focusTrap.enabled = this.opened;
    }
  }
}
