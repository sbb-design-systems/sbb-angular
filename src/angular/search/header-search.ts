import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ConnectedPosition,
  Overlay,
  RepositionScrollStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Inject,
  InjectionToken,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Breakpoints, TypeRef } from '@sbb-esta/angular/core';
import { animationFrameScheduler, interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { SbbSearch } from './search';
import { sbbSearchAnimations } from './search-animation';

/** Injection token that determines the scroll handling while a select is open. */
export const SBB_SEARCH_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-select-scroll-strategy'
);

/** @docs-private */
export function SBB_SEARCH_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay
): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_SEARCH_SCROLL_STRATEGY_PROVIDER = {
  provide: SBB_SEARCH_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_SEARCH_SCROLL_STRATEGY_PROVIDER_FACTORY,
};

const searchOverlayPositions: ConnectedPosition[] = (['start', 'center', 'end'] as Array<
  'start' | 'center' | 'end'
>).map((x) => ({
  originX: x,
  originY: 'top',
  overlayX: x,
  overlayY: 'top',
}));

/** For mobile, the overlay should be attached approximately at the center of the trigger. */
const searchOverlayMobilePosition: ConnectedPosition[] = [searchOverlayPositions[1]];

let nextId = 1;

@Component({
  selector: 'button[sbbHeaderSearch]',
  templateUrl: './header-search.html',
  styleUrls: ['./header-search.css'],
  exportAs: 'sbbHeaderSearch',
  host: {
    class: 'sbb-header-search sbb-button-reset-frameless',
    '[attr.id]': 'this.id',
    'aria-haspopup': 'true',
    '[attr.aria-expanded]': 'panelOpen || null',
    '[attr.aria-controls]': 'panelOpen ? panelId : null',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [sbbSearchAnimations.growShrink],
})
export class SbbHeaderSearch {
  /** Identifier of search. */
  @Input() id: string = `sbb-header-search-id-${nextId++}`;

  /** The label to be shown next to the indicator icon. */
  @Input() label?: string;

  /** Type of the search button. Defaults to "button" if not specified. */
  @Input() type: string = 'button';

  /** The contained search instance. */
  @ContentChild(SbbSearch, { static: true }) _search: SbbSearch;

  /** The indicator icon from the contained sbb-search component. */
  get indicatorIcon(): string {
    return this._search?.indicatorIcon || 'kom:magnifying-glass-small';
  }

  /** Whether or not the overlay panel is open. */
  get panelOpen(): boolean {
    return this._panelOpen;
  }

  /** The id of the overlay panel. */
  readonly panelId = `panel-${this.id}`;

  _overlayPanelClass: string | string[] = ['sbb-overlay-panel', 'sbb-header-search-panel'];

  /**
   * This position config ensures that the top "start" corner of the overlay
   * is aligned with with the top "start" of the origin by default (overlapping
   * the trigger completely).
   */
  _positions: Observable<ConnectedPosition[]>;

  /** Strategy that will be used to handle scrolling while the select panel is open. */
  _scrollStrategy: ScrollStrategy;

  /** The animation state, which indicates whether the overlay is open or not. */
  _animationState: 'void' | 'open' = 'void';

  _overlayWidth: Observable<string>;

  /** Factory function used to create a scroll strategy for this select. */
  private _scrollStrategyFactory: () => ScrollStrategy;

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  private _animationSubscription: Subscription | undefined;

  constructor(
    readonly _elementRef: ElementRef<HTMLElement>,
    private _breakpointObserver: BreakpointObserver,
    @Inject(SBB_SEARCH_SCROLL_STRATEGY) scrollStrategyFactory: any
  ) {
    this._scrollStrategyFactory = scrollStrategyFactory;
    this._scrollStrategy = this._scrollStrategyFactory();

    const mobileObservable = this._breakpointObserver.observe(Breakpoints.Mobile);
    this._positions = mobileObservable.pipe(
      map((m) => (m.matches ? searchOverlayMobilePosition : searchOverlayPositions))
    );
    this._overlayWidth = mobileObservable.pipe(
      map((m) => (m.matches ? 'calc(100vw - 20px)' : '376px'))
    );
  }

  /** Toggles the overlay panel open or closed. */
  toggle(): void {
    this.panelOpen ? this.close() : this.open();
  }

  /** Opens the overlay panel. */
  open(): void {
    if (!this._panelOpen) {
      this._panelOpen = true;
      this._animationState = 'open';
    }
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._animationState = 'void';
    }
  }

  /** Opens the overlay and prevents the click event from bubbling. */
  @HostListener('click', ['$event'])
  _handleClick(event: TypeRef<MouseEvent>) {
    // Stop bubbling, because this would cause the autocomplete to automatically close.
    event.stopImmediatePropagation();
    this.open();
  }

  _handleAttach() {
    Promise.resolve().then(() => {
      this._search._input.focus();
      this._search._autocompleteTrigger?.openPanel();
    });
  }

  /**
   * Called on overlay animation start.
   * If available and in a browser environment, updates the autocomplete
   * size until the end of the overlay animation.
   */
  _onAnimationStart() {
    if (!this._search._autocompleteTrigger || typeof requestAnimationFrame !== 'function') {
      return;
    }

    // The animationFrameScheduler internally uses the requestAnimationFrame
    // function, which ensures a smooth animation.
    this._animationSubscription = interval(0, animationFrameScheduler).subscribe(() =>
      this._search._autocompleteTrigger!._updateSize()
    );
  }

  /**
   * Called at the end of the overlay animation.
   * Unsubscribes from the autocomplete animation subscription, if available.
   */
  _onAnimationDone() {
    this._animationSubscription?.unsubscribe();
    this._animationSubscription = undefined;

    // This call is required as the unsubscription might happen too early, in
    // which case the autocomplete is not the exact same width as the sbb-search.
    Promise.resolve().then(() => this._search._autocompleteTrigger?._updateSize());
  }
}
