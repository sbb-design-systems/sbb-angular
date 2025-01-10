// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { AnimationEvent } from '@angular/animations';
import { _IdGenerator } from '@angular/cdk/a11y';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition,
  Overlay,
  RepositionScrollStrategy,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  inject,
  InjectionToken,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { Breakpoints, SCALING_FACTOR_4K, SCALING_FACTOR_5K, TypeRef } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { animationFrameScheduler, interval, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { SbbSearch } from './search';
import { sbbSearchAnimations } from './search-animation';

/** Injection token that determines the scroll handling while a select is open. */
export const SBB_SEARCH_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-select-scroll-strategy',
);

/** @docs-private */
export function SBB_SEARCH_SCROLL_STRATEGY_PROVIDER_FACTORY(
  overlay: Overlay,
): () => RepositionScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_SEARCH_SCROLL_STRATEGY_PROVIDER = {
  provide: SBB_SEARCH_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_SEARCH_SCROLL_STRATEGY_PROVIDER_FACTORY,
};

const searchOverlayPositions: ConnectedPosition[] = (
  ['start', 'center', 'end'] as Array<'start' | 'center' | 'end'>
).map((x) => ({
  originX: x,
  originY: 'top',
  overlayX: x,
  overlayY: 'top',
}));

/** For mobile, the overlay should be attached approximately at the center of the trigger. */
const searchOverlayMobilePosition: ConnectedPosition[] = [searchOverlayPositions[1]];

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
  imports: [SbbIcon, CdkConnectedOverlay, AsyncPipe],
})
export class SbbHeaderSearch {
  private _breakpointObserver = inject(BreakpointObserver);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  _labelSearch: string = $localize`:Button label for the header search@@sbbSearchHeaderButtonLabel:Search`;

  /** Identifier of search. */
  @Input() id: string = inject(_IdGenerator).getId('sbb-header-search-id-');

  /** The label to be shown next to the indicator icon. */
  @Input() label?: string;

  /** Type of the search button. Defaults to "button" if not specified. */
  @Input() type: string = 'button';

  /** The contained search instance. */
  @ContentChild(SbbSearch, { static: true }) _search: SbbSearch;

  /** The indicator icon from the contained sbb-search component. */
  get svgIcon(): string {
    return this._search?.svgIcon || 'magnifying-glass-small';
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

  _overlayOrigin: CdkOverlayOrigin;

  /** Factory function used to create a scroll strategy for this select. */
  private _scrollStrategyFactory = inject(SBB_SEARCH_SCROLL_STRATEGY);

  /** Whether or not the overlay panel is open. */
  private _panelOpen = false;

  private _animationSubscription: Subscription | undefined;

  constructor(...args: unknown[]);
  constructor() {
    const elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    this._scrollStrategy = this._scrollStrategyFactory();
    this._overlayOrigin = new CdkOverlayOrigin(elementRef);

    this._positions = this._breakpointObserver
      .observe(Breakpoints.Mobile)
      .pipe(map((m) => (m.matches ? searchOverlayMobilePosition : searchOverlayPositions)));
    // Compare overlay base width with the scss definition.
    const overlayBaseWidth = 376;
    this._overlayWidth = this._breakpointObserver
      .observe([Breakpoints.Mobile, Breakpoints.Desktop4k, Breakpoints.Desktop5k])
      .pipe(
        map((m) => {
          if (m.breakpoints[Breakpoints.Mobile]) {
            return 'calc(100vw - 20px)';
          } else if (m.breakpoints[Breakpoints.Desktop5k]) {
            return `${overlayBaseWidth * SCALING_FACTOR_5K}px`;
          } else if (m.breakpoints[Breakpoints.Desktop4k]) {
            return `${overlayBaseWidth * SCALING_FACTOR_4K}px`;
          } else {
            return `${overlayBaseWidth}px`;
          }
        }),
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
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Closes the overlay panel and focuses the host element. */
  close(): void {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._animationState = 'void';
      this._changeDetectorRef.markForCheck();
    }
  }

  /** Opens the overlay and prevents the click event from bubbling. */
  @HostListener('click', ['$event'])
  _handleClick(event: TypeRef<MouseEvent>) {
    // Stop bubbling, because this would cause the autocomplete to automatically close.
    event.stopImmediatePropagation();
    this.open();
  }

  /**
   * Called on overlay animation start.
   * If available and in a browser environment, opens the autocomplete with a delay
   * and updates the autocomplete size until the end of the overlay animation.
   */
  _onAnimationStart(event: AnimationEvent) {
    // We need to check for requestAnimationFrame, because the animationFrameScheduler
    // internally uses it, which ensures a smooth animation.
    if (!this._search._autocompleteTrigger || typeof requestAnimationFrame !== 'function') {
      this._search._input.focus();
      return;
    }

    const isOpening = event.toState === 'open';
    const trigger = this._search._autocompleteTrigger!;
    this._animationSubscription = interval(0, animationFrameScheduler).subscribe(() => {
      trigger._updateSize();
      // Wait until mininum width is reached before setting the focus in the input, which
      // opens the autocomplete, in order to avoid a zero width autocomplete.
      if (
        isOpening &&
        !trigger.panelOpen &&
        trigger.connectedTo.elementRef.nativeElement.getBoundingClientRect().width > 50
      ) {
        this._search._input.focus();
      }
    });
  }

  /**
   * Called at the end of the overlay animation.
   * Unsubscribes from the autocomplete animation subscription, if available.
   */
  _onAnimationDone(event: AnimationEvent) {
    this._animationSubscription?.unsubscribe();
    this._animationSubscription = undefined;

    // This call is required as the unsubscription might happen too early, in
    // which case the autocomplete is not the exact same width as the sbb-search.
    const trigger = this._search._autocompleteTrigger;
    if (trigger) {
      Promise.resolve().then(() => {
        if (trigger.panelOpen) {
          trigger._updateSize();
        } else if (event.toState === 'open') {
          this._search._input.focus();
        }
      });
    }
  }
}
