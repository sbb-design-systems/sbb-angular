import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ConnectedPosition,
  Overlay,
  RepositionScrollStrategy,
  ScrollStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Breakpoints } from '@sbb-esta/angular-core/breakpoints';
import { SbbIconDirective } from '@sbb-esta/angular-core/icon-directive';
import { Subject } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { sbbUsermenuAnimations } from '../usermenu-animations';

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

const OVERLAY_WIDTH = 288;
const OVERLAY_WIDTH_4K = 432;
const OVERLAY_WIDTH_5K = 576;

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
    'aria-haspopup': 'true',
    '[attr.aria-owns]': 'panelOpen ? id + "-panel" : null',
    '[attr.aria-expanded]': 'panelOpen',
    '[class.sbb-usermenu-opened]': 'panelOpen',
  },
  animations: [sbbUsermenuAnimations.transformPanel],
})
export class SbbUserMenu implements OnInit, OnDestroy {
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
  _overlayWidth: number = OVERLAY_WIDTH;

  /** Optional name and surname of an user. */
  @Input() displayName?: string;

  /** Username of a user. */
  @Input() userName: string;

  /** Event emitted on log in of a user. */
  @Output() loginRequest: EventEmitter<void> = new EventEmitter<void>();

  /** Panel containing the usermenu options. */
  @ViewChild('panel') panel: ElementRef<HTMLElement>;

  /** Reference to user provided icon */
  @ContentChild(SbbIconDirective, { read: TemplateRef })
  _icon?: TemplateRef<any>;

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }
  private _panelOpen = false;

  /** Whether the user is logged in or not. */
  get _loggedIn(): boolean {
    return !!this.userName;
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
  private _scrollStrategyFactory: () => ScrollStrategy;

  /** Emits whenever the component is destroyed. */
  private readonly _destroy = new Subject<void>();

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
            return OVERLAY_WIDTH_4K;
          }
          if (r.breakpoints[Breakpoints.Desktop5k]) {
            return OVERLAY_WIDTH_5K;
          }
          return OVERLAY_WIDTH;
        }),
        distinctUntilChanged(),
        takeUntil(this._destroy)
      )
      .subscribe((width) => (this._overlayWidth = width));
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
    if (!this._panelOpen) {
      this._panelOpen = true;
      this._triggerRect = this._elementRef.nativeElement.getBoundingClientRect();
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._changeDetectorRef.markForCheck();
    }
  }

  toggle(): void {
    if (this._panelOpen) {
      this.close();
      return;
    }
    this.open();
  }
}
