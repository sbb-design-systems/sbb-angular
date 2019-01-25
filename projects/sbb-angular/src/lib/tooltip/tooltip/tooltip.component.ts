import {
  Component,
  OnInit,
  HostBinding,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  ViewContainerRef,
  InjectionToken,
  Inject,
  ElementRef
} from '@angular/core';
import { OverlayRef, Overlay, OverlayConfig, ScrollStrategy, PositionStrategy } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

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


@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent implements OnInit {

  @HostBinding('class') cssClass = 'sbb-tooltip';

  tooltipRef: OverlayRef;
  @ViewChild('tooltipTemplate') tooltipContentPortal: TemplatePortal<any>;
  @ViewChild('trigger') tooltipTrigger: ElementRef<any>;

  @Output() change = new EventEmitter();

  visible = false;

  constructor(
    private overlay: Overlay,
    @Inject(SBB_TOOLTIP_SCROLL_STRATEGY) private scrollStrategy,
  ) { }

  ngOnInit() {
  }

  onClick() {
    if (this.tooltipRef && this.tooltipRef.hasAttached()) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.createPopup();
    this.tooltipRef.attach(this.tooltipContentPortal);
  }

  close() {
    this.tooltipRef.dispose();
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

  private createPopup(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this.createTooltipPositionStrategy(),
      hasBackdrop: false,
      scrollStrategy: this.scrollStrategy(),
      panelClass: 'sbb-tooltip-content',
    });

    this.tooltipRef = this.overlay.create(overlayConfig);
    this.tooltipRef.overlayElement.setAttribute('role', 'dialog');
  }
}
