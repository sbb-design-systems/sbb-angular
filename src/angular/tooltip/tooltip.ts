import {
  AriaDescriber,
  ConfigurableFocusTrapFactory,
  FocusMonitor,
  FocusOrigin,
  FocusTrap,
} from '@angular/cdk/a11y';
import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  coerceStringArray,
  NumberInput,
} from '@angular/cdk/coercion';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ConnectedPosition,
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import {
  normalizePassiveListenerOptions,
  Platform,
  _getFocusedElementPierceShadowDom,
} from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { AsyncPipe, DOCUMENT, NgClass, NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  AfterViewInit,
  ANIMATION_MODULE_TYPE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  InjectionToken,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Breakpoints } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

/** Possible positions for a tooltip. */
export type TooltipPosition = 'left' | 'right' | 'above' | 'below';

/**
 * Options for how the tooltip trigger should handle touch gestures.
 * See `SbbTooltip.touchGestures` for more information.
 */
export type TooltipTouchGestures = 'auto' | 'on' | 'off';

/** Possible visibility states of a tooltip. */
export type TooltipVisibility = 'initial' | 'visible' | 'hidden';

/** Time in ms to throttle repositioning after scroll events. */
export const SCROLL_THROTTLE_MS = 20;

const PANEL_CLASS = 'tooltip-panel';

/** Options used to bind passive event listeners. */
const passiveListenerOptions = normalizePassiveListenerOptions({ passive: true });

/**
 * Time between the user putting the pointer on a tooltip
 * trigger and the long press event being fired.
 */
const LONGPRESS_DELAY = 500;

/**
 * Creates an error to be thrown if the user supplied an invalid tooltip position.
 * @docs-private
 */
export function getSbbTooltipInvalidPositionError(position: string) {
  return Error(`Tooltip position "${position}" is invalid.`);
}

/** Injection token that determines the scroll handling while a tooltip is visible. */
export const SBB_TOOLTIP_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-tooltip-scroll-strategy',
);

/** @docs-private */
export function SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition({ scrollThrottle: SCROLL_THROTTLE_MS });
}

/** @docs-private */
export const SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_TOOLTIP_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY,
};

/** Default `sbbTooltip` options that can be overridden. */
export interface SbbTooltipDefaultOptions {
  /** Default delay when the tooltip is shown. */
  showDelay: number;

  /** Default delay when the tooltip is hidden. */
  hideDelay: number;

  /** Default delay when hiding the tooltip on a touch device. */
  touchendHideDelay: number;

  /** Default touch gesture handling for tooltips. */
  touchGestures?: TooltipTouchGestures;

  /** Whether the tooltip should focus the first focusable element on open. */
  autoFocus?: boolean;

  /**
   * Whether the tooltip should restore focus to the
   * previously-focused element, after it's closed.
   */
  restoreFocus?: boolean;

  /** Default position for tooltips. */
  position?: TooltipPosition;

  /** Disables the ability for the user to interact with the tooltip element. */
  disableTooltipInteractivity?: boolean;
}

/** Injection token to be used to override the default options for `sbbTooltip`. */
export const SBB_TOOLTIP_DEFAULT_OPTIONS = new InjectionToken<SbbTooltipDefaultOptions>(
  'sbb-tooltip-default-options',
  {
    providedIn: 'root',
    factory: SBB_TOOLTIP_DEFAULT_OPTIONS_FACTORY,
  },
);

/** @docs-private */
export function SBB_TOOLTIP_DEFAULT_OPTIONS_FACTORY(): SbbTooltipDefaultOptions {
  return {
    showDelay: 0,
    hideDelay: 0,
    touchendHideDelay: 1500,
    autoFocus: true,
    restoreFocus: true,
  };
}

/** Tooltip event, which is emitted for certain events. */
export class SbbTooltipChangeEvent {
  constructor(
    /** Instance of tooltip component. */
    public instance: SbbTooltip,
  ) {}
}

/**
 * Directive that attaches a sbb design tooltip to the host element. Animates the showing and
 * hiding of a tooltip provided position (defaults to below the element).
 */
@Directive({
  selector: '[sbbTooltip]',
  exportAs: 'sbbTooltip',
  host: {
    '[class.sbb-tooltip-trigger]': 'trigger === "click"',
    '[attr.aria-expanded]': 'trigger === "click" ? _isTooltipVisible() : null',
  },
})
export class SbbTooltip implements OnDestroy, AfterViewInit {
  private _overlay = inject(Overlay);
  private _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private _scrollDispatcher = inject(ScrollDispatcher);
  private _injector = inject(Injector);
  private _viewContainerRef = inject(ViewContainerRef);
  private _ngZone = inject(NgZone);
  private _platform = inject(Platform);
  private _ariaDescriber = inject(AriaDescriber);
  private _focusMonitor = inject(FocusMonitor);
  private _defaultOptions = inject<SbbTooltipDefaultOptions>(SBB_TOOLTIP_DEFAULT_OPTIONS, {
    optional: true,
  })!;

  _overlayRef: OverlayRef | null;
  _tooltipInstance: TooltipComponent | null;

  private _portal: ComponentPortal<TooltipComponent>;
  private _position: TooltipPosition = 'below';
  private _disabled: boolean = false;
  private _tooltipClass: string | string[] | Set<string> | { [key: string]: any };
  private _scrollStrategy = inject(SBB_TOOLTIP_SCROLL_STRATEGY);
  private _viewInitialized = false;
  private _pointerExitEventsInitialized = false;
  private readonly _tooltipComponent = TooltipComponent;
  private _viewportMargin = 8;
  private _currentPosition: TooltipPosition;
  private readonly _cssClassPrefix: string = 'sbb';
  private _ariaDescriptionPending: boolean;

  /** Allows the user to define the position of the tooltip relative to the parent element */
  @Input('sbbTooltipPosition')
  get position(): TooltipPosition {
    return this._position;
  }

  set position(value: TooltipPosition) {
    if (value !== this._position) {
      this._position = value;

      if (this._overlayRef) {
        this._updatePosition(this._overlayRef);
        this._tooltipInstance?.show(0);
        this._overlayRef.updatePosition();
      }
    }
  }

  /**
   * The trigger event, on which the tooltip opens.
   * This is primarily used for sbb-tooltip and should be used with care.
   */
  @Input('sbbTooltipTrigger') trigger: 'click' | 'hover' = 'hover';

  /** Disables the display of the tooltip. */
  @Input('sbbTooltipDisabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: BooleanInput) {
    const isDisabled = coerceBooleanProperty(value);

    if (this._disabled !== isDisabled) {
      this._disabled = isDisabled;

      // If tooltip is disabled, hide immediately.
      if (isDisabled) {
        this.hide(0);
      } else {
        this._setupPointerEnterEventsIfNeeded();
      }

      if (typeof this.message === 'string') {
        this._syncAriaDescription(this.message);
      }
    }
  }

  /** The default delay in ms before showing the tooltip after show is called */
  @Input('sbbTooltipShowDelay')
  get showDelay(): number {
    return this._showDelay;
  }
  set showDelay(value: NumberInput) {
    this._showDelay = coerceNumberProperty(value);
  }
  private _showDelay: number;

  /** The default delay in ms before hiding the tooltip after hide is called */
  @Input('sbbTooltipHideDelay')
  get hideDelay(): number {
    return this._hideDelay;
  }
  set hideDelay(value: NumberInput) {
    this._hideDelay = coerceNumberProperty(value);

    if (this._tooltipInstance) {
      this._tooltipInstance._mouseLeaveHideDelay = this._hideDelay;
    }
  }
  private _hideDelay: number;

  /**
   * How touch gestures should be handled by the tooltip. On touch devices the tooltip directive
   * uses a long press gesture to show and hide, however it can conflict with the native browser
   * gestures. To work around the conflict, sbb-angular disables native gestures on the
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
  @Input('sbbTooltipTouchGestures') touchGestures: TooltipTouchGestures = 'auto';

  /** The message to be displayed in the tooltip */
  @Input('sbbTooltip')
  get message() {
    return this._message;
  }
  set message(value: string | TemplateRef<any>) {
    const oldMessage = this.message;

    // If the message is not a string (e.g. number), convert it to a string and trim it.
    // Must convert with `String(value)`, not `${value}`, otherwise Closure Compiler optimises
    // away the string-conversion: https://github.com/angular/components/issues/20684
    this._message =
      value instanceof TemplateRef ? value : value != null ? String(value).trim() : '';

    if (!this._message && this._isTooltipVisible()) {
      this.hide(0);
    } else {
      this._setupPointerEnterEventsIfNeeded();
      this._updateTooltipMessage();
    }

    if (typeof oldMessage === 'string') {
      this._syncAriaDescription(oldMessage);
    }
  }
  private _message: string | TemplateRef<any> = '';

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

  /** Classes to be passed to the tooltip panel. Supports the same syntax as `ngClass`. */
  @Input('sbbTooltipPanelClass')
  tooltipPanelClass: string | string[] | Set<string> | { [key: string]: any } = '';

  /** Manually-bound passive event listeners. */
  private readonly _passiveListeners: (readonly [string, EventListenerOrEventListenerObject])[] =
    [];

  /** Reference to the current document. */
  private _document = inject(DOCUMENT);

  /** Timer started at the last `touchstart` event. */
  private _touchstartTimeout: null | ReturnType<typeof setTimeout> = null;

  /** Emits when the component is destroyed. */
  private readonly _destroyed = new Subject<void>();

  /** Whether ngOnDestroyed has been called. */
  private _isDestroyed = false;

  /** Predefined tooltip positions. */
  private readonly _tooltipPositions: Record<TooltipPosition, ConnectedPosition[]> = {
    above: [
      {
        originX: 'center',
        originY: 'top',
        overlayX: 'center',
        overlayY: 'bottom',
        offsetY: -2,
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetX: 5,
        offsetY: -2,
        panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}-start`,
      },
      {
        originX: 'start',
        originY: 'top',
        overlayX: 'start',
        overlayY: 'bottom',
        offsetX: -5,
        offsetY: -2,
        panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}-end`,
      },
    ],
    below: [
      {
        originX: 'center',
        originY: 'bottom',
        overlayX: 'center',
        overlayY: 'top',
        offsetY: 2,
      },
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetX: 5,
        offsetY: 2,
        panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}-start`,
      },
      {
        originX: 'start',
        originY: 'bottom',
        overlayX: 'start',
        overlayY: 'top',
        offsetX: -5,
        offsetY: 2,
        panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}-end`,
      },
    ],
    left: [
      {
        originX: 'start',
        originY: 'center',
        overlayX: 'end',
        overlayY: 'center',
        offsetX: 2,
        panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}-left`,
      },
    ],
    right: [
      {
        originX: 'end',
        originY: 'center',
        overlayX: 'start',
        overlayY: 'center',
        offsetX: -2,
        panelClass: `${this._cssClassPrefix}-${PANEL_CLASS}-right`,
      },
    ],
  };

  /** Event emitted when the tooltip is opened. */
  @Output() readonly opened: EventEmitter<SbbTooltipChangeEvent> =
    new EventEmitter<SbbTooltipChangeEvent>();

  /** Event emitted when the tooltip is closed. */
  @Output() readonly dismissed: EventEmitter<SbbTooltipChangeEvent> =
    new EventEmitter<SbbTooltipChangeEvent>();

  constructor(...args: unknown[]);
  constructor() {
    const _defaultOptions = this._defaultOptions;

    if (_defaultOptions) {
      this._showDelay = _defaultOptions.showDelay;
      this._hideDelay = _defaultOptions.hideDelay;

      if (_defaultOptions?.position) {
        this.position = _defaultOptions.position;
      }
      if (_defaultOptions?.touchGestures) {
        this.touchGestures = _defaultOptions.touchGestures;
      }
    }
  }

  @HostListener('click', ['$event'])
  _preventClickBubbling(event: Event) {
    if (!this.disabled && this.trigger === 'click') {
      // Only prevent event bubbling on click trigger and when enabled.
      // For hover the click event should allow bubbling, which allows
      // consumers to react to it.
      event.stopPropagation();
    }
  }

  ngAfterViewInit() {
    // This needs to happen after view init so the initial values for all inputs have been set.
    this._viewInitialized = true;
    this._setupPointerEnterEventsIfNeeded();

    this._focusMonitor
      .monitor(this._elementRef)
      .pipe(
        filter(() => this.trigger === 'hover'),
        takeUntil(this._destroyed),
      )
      .subscribe((origin) => {
        // Note that the focus monitor runs outside the Angular zone.
        if (!origin) {
          this._ngZone.run(() => this.hide(0));
        } else if (origin === 'keyboard') {
          this._ngZone.run(() => this.show());
        }
      });
  }

  /**
   * Dispose the tooltip when destroyed.
   */
  ngOnDestroy() {
    const nativeElement = this._elementRef.nativeElement;

    // Optimization: Do not call clearTimeout unless there is an active timer.
    if (this._touchstartTimeout) {
      clearTimeout(this._touchstartTimeout);
    }

    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._tooltipInstance = null;
    }

    // Clean up the event listeners set in the constructor
    this._passiveListeners.forEach(([event, listener]) => {
      nativeElement.removeEventListener(event, listener, passiveListenerOptions);
    });
    this._passiveListeners.length = 0;

    this._destroyed.next();
    this._destroyed.complete();

    this._isDestroyed = true;

    if (typeof this._message === 'string') {
      this._ariaDescriber.removeDescription(nativeElement, this._message, 'tooltip');
    }
    this._focusMonitor.stopMonitoring(nativeElement);
  }

  /** Shows the tooltip after the delay in ms, defaults to tooltip-delay-show or 0ms if no input */
  show(delay: number = this.showDelay): void {
    if (this.disabled || !this.message || this._isTooltipVisible()) {
      this._tooltipInstance?._cancelPendingAnimations();
      return;
    }

    const overlayRef = this._createOverlay();
    this._detach();
    this._portal =
      this._portal || new ComponentPortal(this._tooltipComponent, this._viewContainerRef);
    this._tooltipInstance = overlayRef.attach(this._portal).instance;
    this._tooltipInstance._triggerElement = this._elementRef.nativeElement;
    this._tooltipInstance._mouseLeaveHideDelay = this._hideDelay;

    if (this.message instanceof TemplateRef) {
      this._ariaDescriber.describe(
        this._elementRef.nativeElement,
        this._tooltipInstance._elementRef.nativeElement,
      );
    }
    this._tooltipInstance
      .afterShown()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this.opened.emit(new SbbTooltipChangeEvent(this)));
    this._tooltipInstance
      .afterHidden()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => {
        this.dismissed.emit(new SbbTooltipChangeEvent(this));
        this._detach();
      });
    this._setTooltipClass(this._tooltipClass);
    this._updateTooltipMessage();
    if (this.trigger === 'click') {
      // If the tooltip has a click trigger, it behaves similar to a dialog and should capture
      // the focus and trap it inside the tooltip
      this._tooltipInstance._config = {
        autoFocus: this._defaultOptions.autoFocus ?? true,
        restoreFocus: this._defaultOptions.restoreFocus ?? true,
      };
      this._tooltipInstance._initializeWithAttachedContent();
      this._tooltipInstance._triggeredByClick = true;
    } else {
      this._tooltipInstance._config = undefined;
      this._tooltipInstance._triggeredByClick = false;
    }
    this._tooltipInstance!.show(delay);
  }

  /** Hides the tooltip after the delay in ms, defaults to tooltip-delay-hide or 0ms if no input */
  hide(delay: number = this.hideDelay): void {
    const instance = this._tooltipInstance;

    if (instance) {
      if (instance.isVisible()) {
        instance.hide(delay);
      } else {
        instance._cancelPendingAnimations();
        this._detach();
      }
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

  /** Create the overlay config and position strategy */
  private _createOverlay(): OverlayRef {
    if (this._overlayRef) {
      return this._overlayRef;
    }

    const scrollableAncestors = this._scrollDispatcher.getAncestorScrollContainers(
      this._elementRef,
    );

    // Create connected position strategy that listens for scroll events to reposition.
    const strategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withTransformOriginOn(`.${this._cssClassPrefix}-tooltip`)
      .withFlexibleDimensions(false)
      .withViewportMargin(this._viewportMargin)
      .withScrollableContainers(scrollableAncestors);

    strategy.positionChanges.pipe(takeUntil(this._destroyed)).subscribe((change) => {
      this._updateCurrentPositionClass(change.connectionPair);

      if (
        this._tooltipInstance &&
        change.scrollableViewProperties.isOriginOutsideView &&
        this._tooltipInstance.isVisible()
      ) {
        // After position changes occur and the origin is outside the view then close the tooltip.
        this._ngZone.run(() => this.hide(0));
      }
    });

    this._overlayRef = this._overlay.create({
      positionStrategy: strategy,
      panelClass: coerceStringArray(this.tooltipPanelClass).concat(
        `${this._cssClassPrefix}-${PANEL_CLASS}`,
      ),
      scrollStrategy: this._scrollStrategy(),
    });

    this._updatePosition(this._overlayRef);

    this._overlayRef
      .detachments()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._detach());

    this._overlayRef
      .keydownEvents()
      .pipe(takeUntil(this._destroyed))
      .subscribe((event) => {
        if (this._isTooltipVisible() && event.keyCode === ESCAPE && !hasModifierKey(event)) {
          event.preventDefault();
          event.stopPropagation();
          this._ngZone.run(() => this.hide(0));
        }
      });

    this._overlayRef
      .outsidePointerEvents()
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => this._tooltipInstance?._handleBodyInteraction());

    if (this._defaultOptions?.disableTooltipInteractivity) {
      this._overlayRef.addPanelClass(`${this._cssClassPrefix}-tooltip-panel-non-interactive`);
    }

    return this._overlayRef;
  }

  /** Detaches the currently-attached tooltip. */
  private _detach() {
    if (this._overlayRef && this._overlayRef.hasAttached()) {
      if (this.message instanceof TemplateRef && this._tooltipInstance) {
        this._ariaDescriber.removeDescription(
          this._elementRef.nativeElement,
          this._tooltipInstance._elementRef.nativeElement,
        );
      }
      this._overlayRef.detach();
    }

    this._tooltipInstance = null;
  }

  /** Updates the position of the current tooltip. */
  private _updatePosition(overlayRef: OverlayRef) {
    const position = overlayRef.getConfig().positionStrategy as FlexibleConnectedPositionStrategy;
    const overlayPositions = this._getOverlayPositions();
    position.withPositions([...overlayPositions]);
  }

  /** Returns the overlay position and all fallback positions based on the user's preference. */
  _getOverlayPositions(): ConnectedPosition[] {
    const position = this.position;
    let overlayPositions: ConnectedPosition[] = [];

    if (position === 'above') {
      overlayPositions = [...this._tooltipPositions.above, ...this._tooltipPositions.below];
    } else if (position === 'below') {
      overlayPositions = [...this._tooltipPositions.below, ...this._tooltipPositions.above];
    } else if (position === 'left') {
      overlayPositions = [...this._tooltipPositions.left, ...this._tooltipPositions.right];
    } else if (position === 'right') {
      overlayPositions = [...this._tooltipPositions.right, ...this._tooltipPositions.left];
    } else if (typeof ngDevMode === 'undefined' || ngDevMode) {
      throw getSbbTooltipInvalidPositionError(position);
    }

    return overlayPositions;
  }

  /** Updates the tooltip message and repositions the overlay according to the new message length */
  private _updateTooltipMessage() {
    // Must wait for the message to be painted to the tooltip so that the overlay can properly
    // calculate the correct positioning based on the size of the text.
    if (this._tooltipInstance) {
      this._tooltipInstance.message = this.message;
      this._tooltipInstance._markForCheck();

      afterNextRender(
        () => {
          if (this._tooltipInstance) {
            this._overlayRef!.updatePosition();
          }
        },
        {
          injector: this._injector,
        },
      );
    }
  }

  /** Updates the tooltip class */
  private _setTooltipClass(tooltipClass: string | string[] | Set<string> | { [key: string]: any }) {
    if (this._tooltipInstance) {
      this._tooltipInstance.tooltipClass = tooltipClass;
      this._tooltipInstance._markForCheck();
    }
  }

  /** Updates the class on the overlay panel based on the current position of the tooltip. */
  private _updateCurrentPositionClass(connectionPair: ConnectionPositionPair): void {
    const { overlayY, originX, originY } = connectionPair;
    let newPosition: TooltipPosition;

    // If the overlay is in the middle along the Y axis,
    // it means that it's either before or after.
    if (overlayY === 'center') {
      // Note that since this information is used for styling, we want to
      // resolve `start` and `end` to their real values, otherwise consumers
      // would have to remember to do it themselves on each consumption.
      newPosition = originX === 'start' ? 'left' : 'right';
    } else {
      newPosition = overlayY === 'bottom' && originY === 'top' ? 'above' : 'below';
    }

    if (newPosition !== this._currentPosition) {
      const overlayRef = this._overlayRef;

      if (overlayRef) {
        const classPrefix = `${this._cssClassPrefix}-${PANEL_CLASS}-`;
        overlayRef.removePanelClass(classPrefix + this._currentPosition);
        overlayRef.addPanelClass(classPrefix + newPosition);
      }

      this._currentPosition = newPosition;
    }
  }

  /** Binds the pointer events to the tooltip trigger. */
  private _setupPointerEnterEventsIfNeeded() {
    // Optimization: Defer hooking up events if there's no message or the tooltip is disabled.
    if (
      this._disabled ||
      !this.message ||
      !this._viewInitialized ||
      this._passiveListeners.length
    ) {
      return;
    }

    if (this.trigger === 'click') {
      this._passiveListeners.push(['click', () => this.show(0)]);
    }
    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    else if (this._platformSupportsMouseEvents()) {
      this._passiveListeners.push([
        'mouseenter',
        () => {
          this._setupPointerExitEventsIfNeeded();
          this.show();
        },
      ]);
    } else if (this.touchGestures !== 'off') {
      this._disableNativeGesturesIfNecessary();

      this._passiveListeners.push([
        'touchstart',
        () => {
          // Note that it's important that we don't `preventDefault` here,
          // because it can prevent click events from firing on the element.
          this._setupPointerExitEventsIfNeeded();
          if (this._touchstartTimeout) {
            clearTimeout(this._touchstartTimeout);
          }
          this._touchstartTimeout = setTimeout(() => {
            this._touchstartTimeout = null;
            this.show();
          }, LONGPRESS_DELAY);
        },
      ]);
    }

    this._addListeners(this._passiveListeners);
  }

  private _setupPointerExitEventsIfNeeded() {
    if (this._pointerExitEventsInitialized) {
      return;
    }
    this._pointerExitEventsInitialized = true;

    const exitListeners: (readonly [string, EventListenerOrEventListenerObject])[] = [];
    if (this._platformSupportsMouseEvents()) {
      exitListeners.push(
        [
          'mouseleave',
          (event) => {
            const newTarget = (event as MouseEvent).relatedTarget as Node | null;
            if (!newTarget || !this._overlayRef?.overlayElement.contains(newTarget)) {
              this.hide();
            }
          },
        ],
        ['wheel', (event) => this._wheelListener(event as WheelEvent)],
      );
    } else if (this.touchGestures !== 'off') {
      this._disableNativeGesturesIfNecessary();
      const touchendListener = () => {
        if (this._touchstartTimeout) {
          clearTimeout(this._touchstartTimeout);
        }
        this.hide(this._defaultOptions.touchendHideDelay);
      };

      exitListeners.push(['touchend', touchendListener], ['touchcancel', touchendListener]);
    }

    this._addListeners(exitListeners);
    this._passiveListeners.push(...exitListeners);
  }

  private _addListeners(listeners: (readonly [string, EventListenerOrEventListenerObject])[]) {
    listeners.forEach(([event, listener]) => {
      this._elementRef.nativeElement.addEventListener(event, listener, passiveListenerOptions);
    });
  }

  private _platformSupportsMouseEvents() {
    return !this._platform.IOS && !this._platform.ANDROID;
  }

  /** Listener for the `wheel` event on the element. */
  private _wheelListener(event: WheelEvent) {
    if (this._isTooltipVisible()) {
      const elementUnderPointer = this._document.elementFromPoint(event.clientX, event.clientY);
      const element = this._elementRef.nativeElement;

      // On non-touch devices we depend on the `mouseleave` event to close the tooltip, but it
      // won't fire if the user scrolls away using the wheel without moving their cursor. We
      // work around it by finding the element under the user's cursor and closing the tooltip
      // if it's not the trigger.
      if (elementUnderPointer !== element && !element.contains(elementUnderPointer)) {
        this.hide();
      }
    }
  }

  /** Disables the native browser gestures, based on how the tooltip has been configured. */
  private _disableNativeGesturesIfNecessary() {
    const gestures = this.touchGestures;

    if (gestures !== 'off') {
      const element = this._elementRef.nativeElement;
      const style = element.style;

      // If gestures are set to `auto`, we don't disable text selection on inputs and
      // textareas, because it prevents the user from typing into them on iOS Safari.
      if (gestures === 'on' || (element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA')) {
        style.userSelect =
          (style as any).msUserSelect =
          style.webkitUserSelect =
          (style as any).MozUserSelect =
            'none';
      }

      // If we have `auto` gestures and the element uses native HTML dragging,
      // we don't set `-webkit-user-drag` because it prevents the native behavior.
      if (gestures === 'on' || !element.draggable) {
        (style as any).webkitUserDrag = 'none';
      }

      style.touchAction = 'none';
      (style as any).webkitTapHighlightColor = 'transparent';
    }
  }

  /** Updates the tooltip's ARIA description based on it current state. */
  private _syncAriaDescription(oldMessage: string): void {
    if (this._ariaDescriptionPending) {
      return;
    }

    this._ariaDescriptionPending = true;
    this._ariaDescriber.removeDescription(this._elementRef.nativeElement, oldMessage, 'tooltip');

    // The `AriaDescriber` has some functionality that avoids adding a description if it's the
    // same as the `aria-label` of an element, however we can't know whether the tooltip trigger
    // has a data-bound `aria-label` or when it'll be set for the first time. We can avoid the
    // issue by deferring the description by a tick so Angular has time to set the `aria-label`.
    if (!this._isDestroyed) {
      afterNextRender(
        {
          write: () => {
            this._ariaDescriptionPending = false;

            if (this.message && !this.disabled) {
              this._ariaDescriber.describe(
                this._elementRef.nativeElement,
                this.message as string,
                'tooltip',
              );
            }
          },
        },
        { injector: this._injector },
      );
    }
  }
}

/**
 * Internal component that wraps the tooltip's content.
 * @docs-private
 */
@Component({
  selector: 'sbb-tooltip-component',
  templateUrl: 'tooltip.html',
  styleUrls: ['tooltip.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-tooltip-component',
    '(mouseleave)': '_handleMouseLeave($event)',
    'aria-hidden': 'true',
  },
  imports: [NgClass, NgTemplateOutlet, SbbIcon, AsyncPipe],
})
export class TooltipComponent implements OnDestroy {
  _elementRef: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);
  protected _focusTrapFactory: ConfigurableFocusTrapFactory = inject(ConfigurableFocusTrapFactory);
  private _changeDetectorRef = inject(ChangeDetectorRef);
  private _focusMonitor = inject(FocusMonitor);
  private _breakpointObserver = inject(BreakpointObserver);

  /** Stream that emits whether the user has a handset-sized display.  */
  _isHandset: Observable<BreakpointState>;

  /** Message to display in the tooltip */
  message: string | TemplateRef<any>;

  /** Classes to be added to the tooltip. Supports the same syntax as `ngClass`. */
  tooltipClass: string | string[] | Set<string> | { [key: string]: any };

  /** The timeout ID of any current timer set to show the tooltip */
  _showTimeoutId: any;

  /** The timeout ID of any current timer set to hide the tooltip */
  _hideTimeoutId: any;

  /** Element that caused the tooltip to open. */
  _triggerElement: HTMLElement;

  /** Amount of milliseconds to delay the closing sequence. */
  _mouseLeaveHideDelay: number;

  /** Reference to the internal tooltip element. */
  @ViewChild('tooltip', {
    // Use a static query here since we interact directly with
    // the DOM which can happen before `ngAfterViewInit`.
    static: true,
  })
  _tooltip: ElementRef<HTMLElement>;

  get _templateRef(): TemplateRef<any> | null {
    return this.message instanceof TemplateRef ? this.message : null;
  }

  /**
   * Type of interaction that led to the tooltip being closed. This is used to determine
   * whether the focus style will be applied when returning focus to its original location
   * after the dialog is closed.
   */
  _closeInteractionType: FocusOrigin | null = null;

  _config?: Pick<SbbTooltipDefaultOptions, 'autoFocus' | 'restoreFocus'> = {};

  protected _document: Document = inject(DOCUMENT);

  /** Whether animations are currently disabled. */
  private _animationsDisabled: boolean;

  /** Whether interactions on the page should close the tooltip */
  private _closeOnInteraction = false;

  /** The class that traps and manages focus within the tooltip. */
  private _focusTrap: FocusTrap;

  /** Element that was focused before the tooltip was opened. Save this to restore upon close. */
  private _elementFocusedBeforeDialogWasOpened: HTMLElement | null = null;

  /** Whether the tooltip is currently visible. */
  private _isVisible = false;

  /** Subject for notifying that the tooltip has been shown in the view */
  private readonly _onShow: Subject<void> = new Subject<void>();

  /** Subject for notifying that the tooltip has been hidden from the view */
  private readonly _onHide: Subject<void> = new Subject<void>();

  /** Whether the tooltip component was triggered by click */
  _triggeredByClick: boolean = false;

  /** Name of the show animation and the class that toggles it. */
  private readonly _showAnimation: string = 'sbb-tooltip-container-show';

  /** Name of the hide animation and the class that toggles it. */
  private readonly _hideAnimation: string = 'sbb-tooltip-container-hide';

  constructor(...args: unknown[]);

  constructor() {
    const animationMode = inject(ANIMATION_MODULE_TYPE, { optional: true });
    this._animationsDisabled = animationMode === 'NoopAnimations';
    this._isHandset = this._breakpointObserver.observe(Breakpoints.MobileDevice);
  }

  /**
   * Shows the tooltip with an animation originating from the provided origin
   * @param delay Amount of milliseconds to the delay showing the tooltip.
   */
  show(delay: number): void {
    // Cancel the delayed hide if it is scheduled
    clearTimeout(this._hideTimeoutId);

    // Body interactions should cancel the tooltip if there is a delay in showing.
    this._closeOnInteraction = true;
    this._showTimeoutId = setTimeout(() => {
      this._showTimeoutId = undefined;
      this._toggleVisibility(true);
    }, delay);
  }

  /**
   * Begins the animation to hide the tooltip after the provided delay in ms.
   * @param delay Amount of milliseconds to delay showing the tooltip.
   */
  hide(delay: number): void {
    // Cancel the delayed show if it is scheduled
    clearTimeout(this._showTimeoutId);

    this._hideTimeoutId = setTimeout(() => {
      this._toggleVisibility(false);
      this._hideTimeoutId = undefined;

      // Mark for check so if any parent component has set the
      // ChangeDetectionStrategy to OnPush it will be checked anyways
      this._markForCheck();
    }, delay);
  }

  /** Returns an observable that notifies when the tooltip has been shown in the view. */
  afterShown(): Observable<void> {
    return this._onShow;
  }

  /** Returns an observable that notifies when the tooltip has been hidden from view. */
  afterHidden(): Observable<void> {
    return this._onHide;
  }

  /** Whether the tooltip is being displayed. */
  isVisible(): boolean {
    return this._isVisible;
  }

  ngOnDestroy() {
    this._cancelPendingAnimations();
    this._onShow.complete();
    this._onHide.complete();
    this._triggerElement = null!;
  }

  /**
   * Interactions on the HTML body should close the tooltip immediately.
   */
  _handleBodyInteraction(): void {
    if (this._closeOnInteraction) {
      this.hide(0);
    }
  }

  /** Initializes the dialog container with the attached content. */
  _initializeWithAttachedContent() {
    this._setupFocusTrap();
    // Save the previously focused element. This element will be re-focused
    // when the dialog closes.
    this._capturePreviouslyFocusedElement();
    // Move focus onto the dialog immediately in order to prevent the user
    // from accidentally opening multiple dialogs at the same time.
    this._focusDialogContainer();
  }

  /**
   * Marks that the tooltip needs to be checked in the next change detection run.
   * Mainly used for rendering the initial text before positioning a tooltip, which
   * can be problematic in components with OnPush change detection.
   */
  _markForCheck(): void {
    this._changeDetectorRef.markForCheck();
  }

  _handleMouseLeave({ relatedTarget }: MouseEvent) {
    if (
      !this._triggeredByClick &&
      (!relatedTarget || !this._triggerElement.contains(relatedTarget as Node))
    ) {
      this.hide(this._mouseLeaveHideDelay);
    }
  }

  /** Event listener dispatched when an animation on the tooltip finishes. */
  _handleAnimationEnd({ animationName }: AnimationEvent) {
    if (animationName === this._showAnimation || animationName === this._hideAnimation) {
      this._finalizeAnimation(animationName === this._showAnimation);
    }
  }

  /** Cancels any pending hiding sequences. */
  _cancelPendingAnimations() {
    clearTimeout(this._showTimeoutId);
    clearTimeout(this._hideTimeoutId);
    this._showTimeoutId = this._hideTimeoutId = undefined;
  }

  /** Handles the cleanup after an animation has finished. */
  private _finalizeAnimation(toVisible: boolean) {
    if (toVisible) {
      this._closeOnInteraction = true;
    } else if (!this.isVisible()) {
      this._onHide.next();
    }

    if (toVisible && this.isVisible() && this._config) {
      this._trapFocus();
    }

    if (!toVisible && !this.isVisible()) {
      this._restoreFocus();
    }
  }

  /** Toggles the visibility of the tooltip element. */
  private _toggleVisibility(isVisible: boolean) {
    // We set the classes directly here ourselves so that toggling the tooltip state
    // isn't bound by change detection. This allows us to hide it even if the
    // view ref has been detached from the CD tree.
    const tooltip = this._tooltip.nativeElement;
    const showClass = this._showAnimation;
    const hideClass = this._hideAnimation;
    tooltip.classList.remove(isVisible ? hideClass : showClass);
    tooltip.classList.add(isVisible ? showClass : hideClass);
    if (this._isVisible !== isVisible) {
      this._isVisible = isVisible;
      this._changeDetectorRef.markForCheck();
    }

    // It's common for internal apps to disable animations using `* { animation: none !important }`
    // which can break the opening sequence. Try to detect such cases and work around them.
    if (isVisible && !this._animationsDisabled && typeof getComputedStyle === 'function') {
      const styles = getComputedStyle(tooltip);

      // Use `getPropertyValue` to avoid issues with property renaming.
      if (
        styles.getPropertyValue('animation-duration') === '0s' ||
        styles.getPropertyValue('animation-name') === 'none'
      ) {
        this._animationsDisabled = true;
      }
    }

    if (isVisible) {
      this._onShow.next();
    }

    if (this._animationsDisabled) {
      tooltip.classList.add('_sbb-animation-noopable');
      this._finalizeAnimation(isVisible);
    }
  }

  /** Moves the focus inside the focus trap. */
  protected _trapFocus() {
    // If we were to attempt to focus immediately, then the content of the dialog would not yet be
    // ready in instances where change detection has to run first. To deal with this, we simply
    // wait for the microtask queue to be empty.
    if (this._config?.autoFocus) {
      this._focusTrap.focusInitialElementWhenReady();
    } else if (!this._containsFocus()) {
      // Otherwise ensure that focus is on the dialog container. It's possible that a different
      // component tried to move focus while the open animation was running. See:
      // https://github.com/angular/components/issues/16215. Note that we only want to do this
      // if the focus isn't inside the dialog already, because it's possible that the consumer
      // turned off `autoFocus` in order to move focus themselves.
      this._elementRef.nativeElement.focus();
    }
  }

  /** Restores focus to the element that was focused before the dialog opened. */
  protected _restoreFocus() {
    const previousElement = this._elementFocusedBeforeDialogWasOpened;

    // We need the extra check, because IE can set the `activeElement` to null in some cases.
    if (
      this._config?.restoreFocus &&
      previousElement &&
      typeof previousElement.focus === 'function'
    ) {
      const activeElement = _getFocusedElementPierceShadowDom();
      const element = this._elementRef.nativeElement;

      // Make sure that focus is still inside the dialog or is on the body (usually because a
      // non-focusable element like the backdrop was clicked) before moving it. It's possible that
      // the consumer moved it themselves before the animation was done, in which case we shouldn't
      // do anything.
      if (
        !activeElement ||
        activeElement === this._document.body ||
        activeElement === element ||
        element.contains(activeElement)
      ) {
        this._focusMonitor.focusVia(previousElement, this._closeInteractionType);
        this._closeInteractionType = null;
      }
    }

    if (this._focusTrap) {
      this._focusTrap.destroy();
    }
  }

  /** Sets up the focus trap. */
  private _setupFocusTrap() {
    this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement);
  }

  /** Captures the element that was focused before the dialog was opened. */
  private _capturePreviouslyFocusedElement() {
    if (this._document) {
      this._elementFocusedBeforeDialogWasOpened = _getFocusedElementPierceShadowDom();
    }
  }

  /** Focuses the dialog container. */
  private _focusDialogContainer() {
    // Note that there is no focus method when rendering on the server.
    if (this._elementRef.nativeElement.focus) {
      this._elementRef.nativeElement.focus();
    }
  }

  /** Returns whether focus is inside the dialog. */
  private _containsFocus() {
    const element = this._elementRef.nativeElement;
    const activeElement = _getFocusedElementPierceShadowDom();
    return element === activeElement || element.contains(activeElement);
  }
}
