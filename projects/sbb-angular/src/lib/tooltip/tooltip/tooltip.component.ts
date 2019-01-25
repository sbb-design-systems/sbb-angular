import {
  Component,
  OnInit,
  HostBinding,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  InjectionToken,
  Inject,
  ElementRef,
  Optional,
  NgZone,
  ChangeDetectorRef
} from '@angular/core';
import { OverlayRef, Overlay, OverlayConfig, ScrollStrategy, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { merge, fromEvent, Observable, of, Subscription, Subject } from 'rxjs';
import { filter, map, switchMap, tap, first } from 'rxjs/operators';
import { ESCAPE, ENTER } from '@angular/cdk/keycodes';

/** Injection token that determines the scroll handling while the calendar is open. */
export const SBB_TOOLTIP_SCROLL_STRATEGY =
  new InjectionToken<() => ScrollStrategy>('sbb-tooltip-scroll-strategy');

/** @docs-private */
export function SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.reposition();
}

/** @docs-private */
export const SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER = {
  provide: SBB_TOOLTIP_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: SBB_TOOLTIP_SCROLL_STRATEGY_FACTORY,
};

export class SbbTooltipChangeEvent {
  constructor(
    public instance: TooltipComponent,
    public isUserInput = false
  ) { }

}

let tooltipCounter = 1;

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent {

  @HostBinding('attr.id')
  tooltipId = 'sbb-tooltip-id-' + tooltipCounter++;

  @HostBinding('class')
  cssClass = 'sbb-tooltip';

  tooltipRef: OverlayRef;
  @ViewChild('tooltipTemplate') tooltipContentPortal: TemplatePortal<any>;
  @ViewChild('trigger') tooltipTrigger: ElementRef<any>;

  @Output() readonly opened = new EventEmitter<SbbTooltipChangeEvent>();
  @Output() readonly closed = new EventEmitter<SbbTooltipChangeEvent>();

  private readonly closeKeyEventStream = new Subject<void>();
  private closingActionsSubscription: Subscription;

  constructor(
    private overlay: Overlay,
    @Inject(SBB_TOOLTIP_SCROLL_STRATEGY) private scrollStrategy,
    @Optional() @Inject(DOCUMENT) private _document: any,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  onClick() {
    if (this.overlayAttached) {
      this.close(true);
    } else {
      this.open(true);
    }
  }

  open(isUserInput = false) {
    this.createPopup();
    this.tooltipRef.attach(this.tooltipContentPortal);
    this.closingActionsSubscription = this.subscribeToClosingActions();
    this.opened.emit(new SbbTooltipChangeEvent(this, isUserInput));
  }

  close(isUserInput = false) {
    this.tooltipRef.detach();
    this.tooltipRef.dispose();
    this.closingActionsSubscription.unsubscribe();
    this.closed.emit(new SbbTooltipChangeEvent(this, isUserInput));
  }

  get overlayAttached() {
    return this.tooltipRef && this.tooltipRef.hasAttached();
  }

  /** Create the popup PositionStrategy. */
  private createTooltipPositionStrategy(): PositionStrategy {
    const posStrategy = this.overlay.position()
      .flexibleConnectedTo(this.tooltipTrigger)
      .withTransformOriginOn('.sbb-tooltip-content')
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPush(false)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'center',
          overlayY: 'top',
          panelClass: 'sbb-tooltip-content-below'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          panelClass: 'sbb-tooltip-content-above'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);

    return posStrategy;
  }

  /** Stream of clicks outside of the tooltip panel. */
  private getOutsideClickStream(): Observable<any> {
    if (!this._document) {
      return of(null);
    }

    return merge(
      fromEvent<MouseEvent>(this._document, 'click'),
      fromEvent<TouchEvent>(this._document, 'touchend')
    )
      .pipe(filter(event => {
        const clickTarget = event.target as HTMLElement;

        return this.overlayAttached &&
          clickTarget !== this.tooltipTrigger.nativeElement &&
          !this.tooltipTrigger.nativeElement.contains(clickTarget) &&
          (!!this.tooltipRef && !this.tooltipRef.overlayElement.contains(clickTarget));
      }));
  }

  /**
    * A stream of actions that should close the autocomplete panel, including
    * on blur events.
    */
  get panelClosingActions(): Observable<SbbTooltipChangeEvent | null> {
    return merge(
      this.closeKeyEventStream,
      this.getOutsideClickStream(),
      this.tooltipRef ?
        this.tooltipRef.detachments().pipe(filter(() => this.overlayAttached)) :
        of()
    ).pipe(
      // Normalize the output so we return a consistent type.
      map(event => event instanceof SbbTooltipChangeEvent ? event : null)
    );
  }


  /**
  * This method listens to a stream of panel closing actions and resets the
  * stream every time the option list changes.
  */
  private subscribeToClosingActions(): Subscription {
    const firstStable = this.zone.onStable.asObservable().pipe(first());

    // When the zone is stable initially, and when the option list changes...
    return merge(firstStable)
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
      .subscribe(event => this.close());
  }

  private createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this.createTooltipPositionStrategy(),
      hasBackdrop: false,
      scrollStrategy: this.scrollStrategy(),
      panelClass: 'sbb-tooltip-content',
    });

    this.tooltipRef = this.overlay.create(overlayConfig);
    this.tooltipRef.overlayElement.setAttribute('role', 'dialog');

    // Use the `keydownEvents` in order to take advantage of
    // the overlay event targeting provided by the CDK overlay.
    this.tooltipRef.keydownEvents().subscribe(event => {
      // Close when pressing ESCAPE, based on the a11y guidelines.
      // See: https://www.w3.org/TR/wai-aria-practices-1.1/#textbox-keyboard-interaction
      // tslint:disable-next-line
      if (event.keyCode === ESCAPE) {
        this.closeKeyEventStream.next();
      }
    });
  }
}
