import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { Overlay, OverlayRef, ScrollStrategy } from '@angular/cdk/overlay';
import { normalizePassiveListenerOptions, Platform } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { SBB_TOOLTIP_SCROLL_STRATEGY } from '@sbb-esta/angular-core/base/tooltip';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { TooltipContainerComponent } from './tooltip-container.component';

/**
 * Options for how the tooltip trigger should handle touch gestures.
 * See `Tooltip._touchGestures` for more information.
 */
export type TooltipTouchGestures = 'auto' | 'on' | 'off';

/** CSS class that will be attached to the overlay panel. */
export const TOOLTIP_PANEL_CLASS = 'sbb-tooltip-panel';

/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });

/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 */
const LONGPRESS_DELAY = 500;

/** Default `sbbTooltip` options that can be overridden. */
export interface SbbTooltipDefaultOptions {
  showDelay: number;
  hideDelay: number;
  touchendHideDelay: number;
}

/** Injection token to be used to override the default options for `sbbTooltip`. */
export const SBB_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken<SbbTooltipDefaultOptions>(
  'sbb-tooltip-default-options',
  {
    providedIn: 'root',
    factory: SBB_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
  }
);

/** @docs-private */
// tslint:disable-next-line:naming-convention
export function SBB_TOOLTIP_DEFAULT_OPTIONS_FACTORY(): SbbTooltipDefaultOptions {
  return {
    showDelay: 0,
    hideDelay: 0,
    touchendHideDelay: 1500,
  };
}

/**
 * Directive that attaches a tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 */
@Directive({
  selector: '[sbbTooltip]',
  exportAs: 'sbbTooltip',
})
export class Tooltip implements OnDestroy, OnInit {
  /** Disables the display of the tooltip. */
  @Input('sbbTooltipDisabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);

    // If tooltip is disabled, hide immediately.
    if (this._disabled) {
      this.hide(0);
    }
  }

  /** The message to be displayed in the tooltip */
  @Input('sbbTooltip')
  get message() {
    return this._message;
  }
  set message(value: string) {
    this._ariaDescriber.removeDescription(this._elementRef.nativeElement, this._message);

    // If the message is not a string (e.g. number), convert it to a string and trim it.
    this._message = value != null ? `${value}`.trim() : '';

    if (!this._message && this._isTooltipVisible()) {
      this.hide(0);
    } else {
      this._updateTooltipMessage();
      this._ngZone.runOutsideAngular(() => {
        // The `AriaDescriber` has some functionality that avoids adding a description if it's the
        // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
        // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
        // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
        Promise.resolve().then(() => {
          this._ariaDescriber.describe(this._elementRef.nativeElement, this.message);
        });
      });
    }
  }

  /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
  @Input('sbbTooltipClass')
  get tooltipClass() {
    return this._tooltipClass;
  }
  set tooltipClass(value: string | string[] | Set<string> | { [key: string]: any }) {
    this._tooltipClass = value;
    if (this._tooltipInstance) {
      this._setTooltipClass(this._tooltipClass);
    }
  }

  constructor(
    private _overlay: Overlay,
    private _elementRef: ElementRef<HTMLElement>,
    private _scrollDispatcher: ScrollDispatcher,
    private _viewContainerRef: ViewContainerRef,
    private _ngZone: NgZone,
    private _platform: Platform,
    private _ariaDescriber: AriaDescriber,
    private _focusMonitor: FocusMonitor,
    @Optional() private _dir: Directionality,
    @Optional()
    @Inject(SBB_TOOLTIP_DEFAULT_OPTIONS)
    private _defaultOptions: SbbTooltipDefaultOptions,
    @Inject(SBB_TOOLTIP_SCROLL_STRATEGY) scrollStrategy: any
  ) {
    this._scrollStrategy = scrollStrategy;

    _focusMonitor
      .monitor(_elementRef)
      .pipe(takeUntil(this._destroyed))
      .subscribe((origin) => {
        // Note that the focus monitor runs outside the Angular zone.
        if (!origin) {
          _ngZone.run(() => this.hide(0));
        } else if (origin === 'keyboard') {
          _ngZone.run(() => this.show());
        }
      });

    _ngZone.runOutsideAngular(() => {
      _elementRef.nativeElement.addEventListener('keydown', this._handleKeydown);
    });
  }

  _overlayRef: OverlayRef | null;
  _tooltipInstance: TooltipContainerComponent | null;

  private _portal: ComponentPortal<TooltipContainerComponent>;
  private _disabled: boolean = false;
  private _tooltipClass: string | string[] | Set<string> | { [key: string]: any };
  private readonly _scrollStrategy: () => ScrollStrategy;

  /** The default delay in ms before showing the tooltip after show is called */
  @Input('sbbTooltipShowDelay') showDelay: number = this._defaultOptions.showDelay;

  /** The default delay in ms before hiding the tooltip after hide is called */
  @Input('sbbTooltipHideDelay') hideDelay: number = this._defaultOptions.hideDelay;

  /**
   * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
   * uses a long press gesture to show and hide, however it can conflict with the native browser
   * gestures. To work around the conflict, Sbb Angular disables native gestures on the
   * trigger, but that might not be desirable on particular elements (e.g. inputs and draggable
   * elements). The different values for this option configure the touch event handling as follows:
   * - `auto` - Enables touch gestures for all elements, but tries to avoid conflicts with native
   *   browser gestures on particular elements. In particular, it allows text selection on inputs
   *   and textareas, and preserves the native browser dragging on elements marked as `draggable`.
   * - `on` - Enables touch gestures for all elements and disables native
   *   browser gestures with no exceptions.
   * - `off` - Disables touch gestures. Note that this will prevent the tooltip from
   *   showing on touch devices.
   */
  private readonly _touchGestures: TooltipTouchGestures = 'auto';
  private _message = '';

  /** Manually-bound passive event listeners. */
  private _passiveListeners = new Map<string, EventListenerOrEventListenerObject>();

  /** Timer started at the last `touchstart` event. */
  private _touchstartTimeout: any;

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  /**
   * Setup styling-specific things
   */
  ngOnInit() {
    // This needs to happen in `ngOnInit` so the initial values for all inputs have been set.
    this._setupPointerEvents();
  }

  /**
   * Dispose the tooltip when destroyed.
   */
  ngOnDestroy() {
    const nativeElement = this._elementRef.nativeElement;

    clearTimeout(this._touchstartTimeout);

    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._tooltipInstance = null;
    }

    // Clean up the event listeners set in the constructor
    nativeElement.removeEventListener('keydown', this._handleKeydown);
    this._passiveListeners.forEach((listener, event) => {
      nativeElement.removeEventListener(event, listener, passiveListenerOptions);
    });
    this._passiveListeners.clear();

    this._destroyed.next();
    this._destroyed.complete();

    this._ariaDescriber.removeDescription(nativeElement, this.message);
    this._focusMonitor.stopMonitoring(nativeElement);
  }

  /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
  show(delay: number = this.showDelay): void {
    if (
      this.disabled ||
      !this.message ||
      (this._isTooltipVisible() &&
        !this._tooltipInstance!._showTimeoutId &&
        !this._tooltipInstance!._hideTimeoutId)
    ) {
      return;
    }

    const overlayRef = this._createOverlay();

    this._detach();
    this._portal =
      this._portal || new ComponentPortal(TooltipContainerComponent, this._viewContainerRef);
    this._tooltipInstance = overlayRef.attach(this._portal).instance;
    this._tooltipInstance
      .afterHidden()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._detach());
    this._setTooltipClass(this._tooltipClass);
    this._updateTooltipMessage();
    this._tooltipInstance!.show(delay);
  }

  /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
  hide(delay: number = this.hideDelay): void {
    if (this._tooltipInstance) {
      this._tooltipInstance.hide(delay);
    }
  }

  /** Shows/hides the tooltip */
  toggle(): void {
    this._isTooltipVisible() ? this.hide() : this.show();
  }

  /** Returns true if the tooltip is currently visible to the user */
  _isTooltipVisible(): boolean {
    return !!this._tooltipInstance && this._tooltipInstance.isVisible();
  }

  /**
   * Handles the keydown events on the host element.
   * Needs to be an arrow function so that we can use it in addEventListener.
   */
  private _handleKeydown = (event: KeyboardEvent) => {
    if (this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
      event.preventDefault();
      event.stopPropagation();
      this._ngZone.run(() => this.hide(0));
    }
  };

  /** Create the overlay config and position strategy */
  private _createOverlay(): OverlayRef {
    if (this._overlayRef) {
      return this._overlayRef;
    }

    const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(
      this._elementRef
    );

    // Create connected position strategy that listens for scroll events to reposition.
    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withTransformOriginOn('.sbb-tooltip')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withScrollableContainers(scrollableAncestors)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: 5,
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: -5,
        },
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX: 5,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: -5,
        },
      ]);

    strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe((change) => {
      if (this._tooltipInstance) {
        this._tooltipInstance._connectionPositionPair = change.connectionPair;
        this._tooltipInstance._markForCheck();
      }
      if (
        this._tooltipInstance &&
        change.scrollableViewProperties.isOverlayClipped &&
        this._tooltipInstance.isVisible()
      ) {
        // After position changes occur and the overlay is clipped by
        // a parent scrollable then close the tooltip.
        this._ngZone.run(() => this.hide(0));
      }
    });

    this._overlayRef = this._overlay.create({
      direction: this._dir,
      positionStrategy: strategy,
      panelClass: TOOLTIP_PANEL_CLASS,
      scrollStrategy: this._scrollStrategy(),
    });

    this._overlayRef
      .detachments()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._detach());

    return this._overlayRef;
  }

  /** Detaches the currently-attached tooltip. */
  private _detach() {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      this._overlayRef.detach();
    }

    this._tooltipInstance = null;
  }

  /** Updates the tooltip message and repositions the overlay according to the new message length */
  private _updateTooltipMessage() {
    // Must wait for the message to be painted to the tooltip so that the overlay can properly
    // calculate the correct positioning based on the size of the text.
    if (this._tooltipInstance) {
      this._tooltipInstance.message = this.message;
      this._tooltipInstance._markForCheck();

      this._ngZone.onMicrotaskEmpty
        .asObservable()
        .pipe(take(1), takeUntil(this._destroyed))
        .subscribe(() => {
          if (this._tooltipInstance) {
            this._overlayRef!.updatePosition();
          }
        });
    }
  }

  /** Updates the tooltip class */
  private _setTooltipClass(tooltipClass: string | string[] | Set<string> | { [key: string]: any }) {
    if (this._tooltipInstance) {
      this._tooltipInstance.tooltipClass = tooltipClass;
      this._tooltipInstance._markForCheck();
    }
  }

  /** Binds the pointer events to the tooltip trigger. */
  private _setupPointerEvents() {
    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (!this._platform.IOS && !this._platform.ANDROID) {
      this._passiveListeners
        .set('mouseenter', () => this.show())
        .set('mouseleave', () => this.hide());
    } else if (this._touchGestures !== 'off') {
      this._disableNativeGesturesIfNecessary();
      const touchendListener = () => {
        clearTimeout(this._touchstartTimeout);
        this.hide(this._defaultOptions.touchendHideDelay);
      };

      this._passiveListeners
        .set('touchend', touchendListener)
        .set('touchcancel', touchendListener)
        .set('touchstart', () => {
          // Note that it's important that we don't `preventDefault` here,
          // because it can prevent click events from firing on the element.
          clearTimeout(this._touchstartTimeout);
          this._touchstartTimeout = setTimeout(() => this.show(), LONGPRESS_DELAY);
        });
    }

    this._passiveListeners.forEach((listener, event) => {
      this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
    });
  }

  /** Disables the native browser gestures, based on how the tooltip has been configured. */
  private _disableNativeGesturesIfNecessary() {
    const element = this._elementRef.nativeElement;
    const style = element.style;
    const gestures = this._touchGestures;

    if (gestures !== 'off') {
      // If gestures are set to `auto`, we don't disable text selection on inputs and
      // textareas, because it prevents the user from typing into them on iOS Safari.
      if (gestures === 'on' || (element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA')) {
        style.userSelect = (style as any).msUserSelect = style.webkitUserSelect = (style as any).MozUserSelect =
          'none';
      }

      // If we have `auto` gestures and the element uses native HTML dragging,
      // we don't set `-webkit-user-drag` because it prevents the native behavior.
      if (gestures === 'on' || !element.draggable) {
        (style as any).webkitUserDrag = 'none';
      }

      style.touchAction = 'none';
      style.webkitTapHighlightColor = 'transparent';
    }
  }
}
