import { AnimationEvent } from '@angular/animations';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { DOWN_ARROW, ENTER, ESCAPE, hasModifierKey, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ConnectedPosition,
  Overlay,
  RepositionScrollStrategy,
  ScrollStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Breakpoints } from '@sbb-esta/angular-core/breakpoints';
import { TypeRef } from '@sbb-esta/angular-core/common-behaviors';
import { SbbIconDirective } from '@sbb-esta/angular-core/icon-directive';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { sbbUsermenuAnimations } from '../usermenu-animations';
import { SbbUsermenuItem } from '../usermenu-item/usermenu-item';

/** Injection token that determines the scroll handling while a usermenu is open. */
export const SBB_USERMENU_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-usermenu-scroll-strategy'
);

/** @docs-private */
export function SBB_USERMENU_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay
): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_USERMENU_SCROLL_STRATEGY_PROVIDER = {
  provide: SBB_USERMENU_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_USERMENU_SCROLL_STRATEGY_PROVIDER_FACTORY,
};

let counter = 0;

const OVERLAY_MEDIA_SIZE_CONFIG = {
  '4K': {
    width: 432,
    padding: 12,
  },
  '5K': {
    width: 576,
    padding: 16,
  },
  default: {
    width: 288,
    padding: 8,
  },
};

@Component({
  selector: 'sbb-usermenu',
  templateUrl: './usermenu.component.html',
  styleUrls: ['./usermenu.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-usermenu',
    role: 'menu',
    '[attr.id]': 'id',
    '[class.sbb-usermenu-opened]': 'panelOpen',
    '[class.sbb-usermenu-user-info-has-display-name]': '!!displayName',
  },
  animations: [sbbUsermenuAnimations.transformPanel],
})
export class SbbUserMenu implements OnInit, OnDestroy, AfterContentInit {
  /** Identifier of the usermenu. */
  id: string = `sbb-usermenu-${counter++}`;

  /**
   * This position config ensures that the top "start" corner of the overlay
   * is aligned with with the top "start" of the origin by default (overlapping
   * the trigger completely). If the panel cannot fit below the trigger, it
   * will fall back to a position above the trigger.
   */
  _positions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'top',
    },
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'top',
    },
  ];

  /** The last measured value for the trigger's client bounding rect. */
  _triggerRect: ClientRect;

  /** Desired width of the overlay */
  _overlayWidth: number = OVERLAY_MEDIA_SIZE_CONFIG.default.width;

  /** padding of overlay */
  _overlayMinWidthPadding: number = OVERLAY_MEDIA_SIZE_CONFIG.default.padding;

  /** Min width of overlay when starting animation */
  get overlayMinWidth(): number {
    return this._triggerRect.width + this._overlayMinWidthPadding;
  }

  /** Optional name and surname of an user. */
  @Input() displayName?: string;

  /** Username of a user. */
  @Input() userName: string;

  /** Event emitted on log in of a user. */
  @Output() loginRequest: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('loginButton') private _loginButton: ElementRef<HTMLElement>;
  @ViewChild('triggerOpenButton') private _triggerOpenButton!: ElementRef<HTMLElement>;
  @ViewChild('triggerCloseButton') private _triggerCloseButton: ElementRef<HTMLElement>;

  /** Reference to user provided icon */
  @ContentChild(SbbIconDirective, { read: TemplateRef })
  _icon?: TemplateRef<any>;

  /** All of the defined usermenu items. */
  @ContentChildren(SbbUsermenuItem, { descendants: true }) private _usermenuItems: QueryList<
    SbbUsermenuItem
  >;

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }
  private _panelOpen = false;

  /** Whether the user is logged in or not. */
  get _loggedIn(): boolean {
    return !!this.userName || !!this.displayName;
  }

  /** Initial letters of user's displayName (or userName if no displayName is provided). */
  get _initialLetters(): string {
    const name = this.displayName ? this.displayName : this.userName;
    const names: string[] = name.split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toLocaleUpperCase();
    }

    return names
      .reduce((current, next) => {
        return current[0] + next[0];
      })
      .toLocaleUpperCase();
  }

  /** Strategy that will be used to handle scrolling while the usermenu panel is open. */
  _scrollStrategy: ScrollStrategy;

  /** Factory function used to create a scroll strategy for this usermenu. */
  private readonly _scrollStrategyFactory: () => ScrollStrategy;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

  /** Manages keyboard events for options in the panel. */
  private _keyManager: FocusKeyManager<SbbUsermenuItem>;

  constructor(
    private _viewportRuler: ViewportRuler,
    private _breakpointObserver: BreakpointObserver,
    private _changeDetectorRef: ChangeDetectorRef,
    public _elementRef: ElementRef,
    @Inject(SBB_USERMENU_SCROLL_STRATEGY) scrollStrategyFactory: any
  ) {
    this._scrollStrategyFactory = scrollStrategyFactory;
    this._scrollStrategy = this._scrollStrategyFactory();
  }

  ngOnInit() {
    this._viewportRuler
      .change()
      .pipe(takeUntil(this._destroy))
      .subscribe(() => {
        if (this._panelOpen) {
          this._triggerRect = this._elementRef.nativeElement.getBoundingClientRect();
          this._changeDetectorRef.markForCheck();
        }
      });

    this._breakpointObserver
      .observe([Breakpoints.Desktop4k, Breakpoints.Desktop5k])
      .pipe(
        map((r: BreakpointState) => {
          if (r.breakpoints[Breakpoints.Desktop4k]) {
            return '4K';
          }
          if (r.breakpoints[Breakpoints.Desktop5k]) {
            return '5K';
          }
          return null;
        }),
        distinctUntilChanged(),
        takeUntil(this._destroy)
      )
      .subscribe((resolution: '4K' | '5K' | null) => {
        if (resolution === '4K') {
          this._overlayWidth = OVERLAY_MEDIA_SIZE_CONFIG['4K'].width;
          this._overlayMinWidthPadding = OVERLAY_MEDIA_SIZE_CONFIG['4K'].padding;
        } else if (resolution === '5K') {
          this._overlayWidth = OVERLAY_MEDIA_SIZE_CONFIG['5K'].width;
          this._overlayMinWidthPadding = OVERLAY_MEDIA_SIZE_CONFIG['5K'].padding;
        } else {
          this._overlayWidth = OVERLAY_MEDIA_SIZE_CONFIG.default.width;
          this._overlayMinWidthPadding = OVERLAY_MEDIA_SIZE_CONFIG.default.padding;
        }
      });
  }

  ngAfterContentInit() {
    this._initKeyManager();
  }

  /** Sets up a key manager to listen to keyboard events on the overlay panel. */
  private _initKeyManager() {
    this._keyManager = new FocusKeyManager<SbbUsermenuItem>(this._usermenuItems)
      .withWrap()
      .withTypeAhead()
      .withHomeAndEnd();

    this._keyManager.tabOut.pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this.panelOpen) {
        // Restore focus to the trigger before closing. Ensures that the focus
        // position won't be lost if the user got focus into the overlay.
        this.close();
        this.focus();
      }
    });
  }

  ngOnDestroy() {
    this._destroy.next();
    this._destroy.complete();
  }

  _emitLogin() {
    this.loginRequest.emit();
  }

  /** Opens the overlay panel */
  open(): void {
    if (!this._panelOpen && this._loggedIn) {
      this._panelOpen = true;
      this._triggerRect = this._elementRef.nativeElement.getBoundingClientRect();
      this._resetActiveItem();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the overlay panel */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Toggles the overlay panel visibility */
  toggle(): void {
    if (this._panelOpen) {
      this.close();
      return;
    }
    this.open();
  }

  /** Forwards focus to the currently matching element. */
  focus(): void {
    if (!this._loggedIn) {
      this._loginButton.nativeElement.focus();
    } else if (this.panelOpen) {
      this._triggerCloseButton.nativeElement.focus();
    } else {
      this._triggerOpenButton.nativeElement.focus();
    }
  }

  /** Closes the overlay panel and focuses the host element */
  _closeAndFocus(): void {
    if (this._panelOpen) {
      this.close();
      this.focus();
    }
  }

  /** Set focus to close button upon opening the panel */
  _handlePanelOpen(event: AnimationEvent) {
    if (event.toState === 'showing') {
      this.focus();
    }
  }

  /**
   * Resets the active item in the menu. This is used when the menu is opened, allowing
   * the user to start from the first option when pressing the down arrow.
   */
  private _resetActiveItem() {
    this._keyManager.setActiveItem(-1);
  }

  /** Handles all keydown events on the select. */
  @HostListener('keydown', ['$event'])
  _handleKeydown(event: TypeRef<KeyboardEvent>): void {
    this.panelOpen ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
  }

  /** Handles keyboard events while the panel is closed. */
  private _handleClosedKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    if (!this._keyManager.isTyping() && isOpenKey && !hasModifierKey(event) && this._loggedIn) {
      event.preventDefault(); // prevents the page from scrolling down when pressing space
      this.open();
    }
  }

  /** Handles keyboard events when the panel is open. */
  private _handleOpenKeydown(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if (keyCode === ESCAPE && !hasModifierKey(event)) {
      event.preventDefault();
      this.close();
      this.focus();
    } else {
      if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        this._keyManager.setFocusOrigin('keyboard');
      }
      this._keyManager.onKeydown(event);
    }
  }
}
