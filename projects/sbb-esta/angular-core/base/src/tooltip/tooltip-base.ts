import { ESCAPE } from '@angular/cdk/keycodes';
import {
  Overlay,
  OverlayConfig,
  OverlayRef,
  PositionStrategy,
  ScrollStrategy
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  InjectionToken,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { IconDirective } from '@sbb-esta/angular-core/icon-directive';
import { fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

import { TooltipRegistryService } from './tooltip-registry.service';

/** Injection token that determines the scroll handling while the calendar is open. */
export const SBB_TOOLTIP_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>(
  'sbb-tooltip-scroll-strategy'
);

/** @docs-private */
export function SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_TOOLTIP_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY
};

export class SbbTooltipChangeEvent<TTooltip extends TooltipBase = TooltipBase> {
  constructor(
    /** Instance of tooltip component. */
    public instance: TTooltip,
    /** States if the tooltip has been opened by a click. */
    public isUserInput = false
  ) {}
}

let tooltipCounter = 1;

@Directive()
export abstract class TooltipBase implements OnDestroy {
  /**
   * The icon to be used as click target.
   * By default uses question-mark, but the user can use his own icon using the IconDirective.
   */
  @Input()
  set icon(tooltipIcon: TemplateRef<any>) {
    this._icon = tooltipIcon;
  }
  get icon() {
    return this._contentIcon || this._icon || this.defaultIcon;
  }
  private _icon: TemplateRef<any>;

  /**
   * icon placed in template
   * @docs-private
   */
  @ContentChild(IconDirective, { read: TemplateRef })
  _contentIcon: TemplateRef<any>;

  /** Checks if a tooltip panel exists */
  @HostBinding('attr.aria-expanded')
  get overlayAttached() {
    return this.tooltipRef && this.tooltipRef.hasAttached();
  }

  /**
   * A stream of actions that should close the autocomplete panel, including
   * on blur events.
   */
  get panelClosingActions(): Observable<SbbTooltipChangeEvent | null> {
    return merge(
      this._closeKeyEventStream,
      this._getOutsideClickStream(),
      this._tooltipRegistry.tooltipActivation,
      this.tooltipRef
        ? this.tooltipRef.detachments().pipe(filter(() => this.overlayAttached))
        : of()
    ).pipe(
      // Normalize the output so we return a consistent type.
      map(event => (event instanceof SbbTooltipChangeEvent ? event : null))
    );
  }

  /**
   * Identifier of tooltip.
   */
  @HostBinding('attr.id') tooltipId = `sbb-tooltip-id-${tooltipCounter++}`;
  /**
   * Identifier of tooltip content.
   */
  contentId = `sbb-tooltip-content-id-${tooltipCounter++}`;
  /** @docs-private */
  @HostBinding('class.sbb-tooltip') cssClass = true;

  /**
   * Overlay containg the tooltip text and the close button.
   * It's built when the user clicks on the question mark.
   */
  tooltipRef: OverlayRef;
  /** @docs-private */
  @ViewChild('tooltipTemplate', { static: true }) tooltipContentPortal: TemplatePortal<any>;
  /** @docs-private */
  @ViewChild('triggerButton', { static: true }) tooltipTrigger: ElementRef<any>;
  /** @docs-private */
  @ViewChild('defaultIcon', { read: TemplateRef, static: true }) defaultIcon: TemplateRef<any>;

  /**
   * Sets whether the overlay can be pushed on-screen if it does not fit otherwise.
   */
  @Input()
  overlayWithPush = false;

  /**
   * Sets whether the overlay's position should be locked in after it is
   * positioned initially.
   * When an overlay is locked in, it won't attempt to reposition itself
   * when the position is re-applied (e.g. when the user scrolls away).
   */
  @Input()
  overlayWithLockedPosition = true;

  /**
   * Sets a minimum distance the overlay may be positioned to the edge of the viewport.
   */
  @Input()
  overlayViewportMargin = 8;

  /**
   * Open event to a click on tooltip element.
   */
  @Output() readonly opened = new EventEmitter<SbbTooltipChangeEvent>();
  /**
   * Close event to a click on tooltip element.
   */
  @Output() readonly closed = new EventEmitter<SbbTooltipChangeEvent>();

  private readonly _closeKeyEventStream = new Subject<void>();
  private readonly _scrollStrategy: () => ScrollStrategy;
  private _closingActionsSubscription: Subscription;

  constructor(
    protected _overlay: Overlay,
    protected _tooltipRegistry: TooltipRegistryService,
    protected _document: any,
    protected _zone: NgZone,
    protected _changeDetectorRef: ChangeDetectorRef,
    scrollStrategy: any
  ) {
    this._scrollStrategy = scrollStrategy;
  }

  ngOnDestroy(): void {
    if (this.tooltipRef) {
      this.tooltipRef.detach();
      this.tooltipRef.dispose();
      this._closingActionsSubscription.unsubscribe();
    }
  }

  onClick(event: Event) {
    event.stopPropagation();
    if (this.overlayAttached) {
      this.close(true);
    } else {
      this.openTooltip(true);
    }
  }

  /**
   * Opens the tooltip
   * @param isUserInput states if the tooltip has been opened by a click
   * @deprecated use openTooltip() instead
   */
  open(isUserInput = false) {
    return this.openTooltip(isUserInput);
  }

  /**
   * Opens the tooltip
   * @param isUserInput states if the tooltip has been opened by a click
   */
  openTooltip(isUserInput = false) {
    if (!this.overlayAttached) {
      this._tooltipRegistry.activate();
      this._createPopup();
      this.tooltipRef.attach(this.tooltipContentPortal);
      this._closingActionsSubscription = this._subscribeToClosingActions();
      this.opened.emit(new SbbTooltipChangeEvent(this, isUserInput));
    }
  }

  /**
   * Closes the tooltip
   * @param isUserInput states if the tooltip has been opened by a click
   */
  close(isUserInput = false) {
    if (this.overlayAttached) {
      this.tooltipRef.detach();
      this.tooltipRef.dispose();
      this._closingActionsSubscription.unsubscribe();
      this.closed.emit(new SbbTooltipChangeEvent(this, isUserInput));
      this._changeDetectorRef.detectChanges();
    }
  }

  /** Create the popup PositionStrategy. */
  private _createTooltipPositionStrategy(): PositionStrategy {
    return this._overlay
      .position()
      .flexibleConnectedTo(this.tooltipTrigger)
      .withTransformOriginOn('.sbb-tooltip-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPush(false)
      .withPositions([
        {
          originX: 'center',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          panelClass: 'sbb-tooltip-content-below'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
          offsetX: 5,
          panelClass: ['sbb-tooltip-content-below', 'sbb-tooltip-content-left']
        },
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetX: -5,
          panelClass: ['sbb-tooltip-content-below', 'sbb-tooltip-content-right']
        },
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          panelClass: 'sbb-tooltip-content-above'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom',
          offsetX: 5,
          panelClass: ['sbb-tooltip-content-above', 'sbb-tooltip-content-left']
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetX: -5,
          panelClass: ['sbb-tooltip-content-above', 'sbb-tooltip-content-right']
        }
      ]);
  }

  /** Stream of clicks outside of the tooltip panel. */
  private _getOutsideClickStream(): Observable<any> {
    if (!this._document) {
      return of(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend')
    ).pipe(
      filter(event => {
        const clickTarget = event.target as HTMLElement;

        return (
          this.overlayAttached &&
          clickTarget !== this.tooltipTrigger.nativeElement &&
          !this.tooltipTrigger.nativeElement.contains(clickTarget) &&
          !!this.tooltipRef &&
          !this.tooltipRef.overlayElement.contains(clickTarget)
        );
      })
    );
  }

  /**
   * This method listens to a stream of panel closing actions and resets the
   * stream every time the option list changes.
   */
  private _subscribeToClosingActions(): Subscription {
    const firstStable = this._zone.onStable.asObservable().pipe(first());

    // When the zone is stable initially, and when the option list changes...
    return (
      merge(firstStable)
        .pipe(
          // create a new stream of panelClosingActions, replacing any previous streams
          // that were created, and flatten it so our stream only emits closing events...
          switchMap(() => {
            return this.panelClosingActions;
          }),
          // when the first closing event occurs...
          first()
        )
        // set the value, close the panel, and complete.
        .subscribe(() => {
          this.close();
        })
    );
  }

  private _createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createTooltipPositionStrategy(),
      hasBackdrop: false,
      scrollStrategy: this._scrollStrategy(),
      panelClass: 'sbb-tooltip-content'
    });

    this.tooltipRef = this._overlay.create(overlayConfig);
    this.tooltipRef.overlayElement.setAttribute('role', 'tooltip');

    // Use the `keydownEvents` in order to take advantage of
    // the overlay event targeting provided by the CDK overlay.
    this.tooltipRef.keydownEvents().subscribe(event => {
      // Close when pressing ESCAPE, based on the a11y guidelines.
      // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
      if (event.keyCode === ESCAPE) {
        this._closeKeyEventStream.next();
      }
    });
  }
}
