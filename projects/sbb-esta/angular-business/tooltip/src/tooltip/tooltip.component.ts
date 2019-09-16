import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Overlay } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation
} from '@angular/core';
import {
  SBB_TOOLTIP_SCROLL_STRATEGY,
  TooltipBase,
  TooltipRegistryService
} from '@sbb-esta/angular-core/base';

@Component({
  selector: 'sbb-tooltip',
  templateUrl: '../../../../angular-public/tooltip/src/tooltip/tooltip.component.html',
  styleUrls: ['./tooltip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipComponent extends TooltipBase implements OnInit, OnDestroy {
  /**
   * The trigger event, on which the tooltip opens.
   */
  @Input() trigger: 'click' | 'hover' = 'click';
  /**
   * Customizations for delay open
   */
  @Input()
  get hoverOpenDelay(): number {
    return this._hoverOpenDelay;
  }
  set hoverOpenDelay(value: number) {
    this._hoverOpenDelay = coerceNumberProperty(value, 0);
  }
  private _hoverOpenDelay: number;

  /**
   * Customizations for delay close
   */
  @Input()
  get hoverCloseDelay(): number {
    return this._hoverCloseDelay;
  }
  set hoverCloseDelay(value: number) {
    this._hoverCloseDelay = coerceNumberProperty(value, 0);
  }
  private _hoverCloseDelay: number;

  /**
   * References for timeout used for delay open/close
   */
  private _referenceActiveTimeout: number;
  /** @docs-private */
  private _manualListeners = new Map<string, EventListenerOrEventListenerObject>();

  constructor(
    private _platform: Platform,
    private _elementRef: ElementRef,
    overlay: Overlay,
    tooltipRegistry: TooltipRegistryService,
    @Inject(SBB_TOOLTIP_SCROLL_STRATEGY) scrollStrategy,
    @Optional() @Inject(DOCUMENT) document: any,
    zone: NgZone,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(overlay, tooltipRegistry, scrollStrategy, document, zone, changeDetectorRef);
  }

  ngOnInit() {
    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (this.trigger === 'hover' && !this._platform.IOS && !this._platform.ANDROID) {
      this._manualListeners
        .set('mouseenter', () => this.onMouseEnter())
        .set('mouseleave', () => this.onMouseLeave());
      this._manualListeners.forEach((listener, event) =>
        this._elementRef.nativeElement.addEventListener(event, listener)
      );
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();

    // Clean up the event listeners set in the constructor
    this._manualListeners.forEach((listener, event) => {
      this._elementRef.nativeElement.removeEventListener(event, listener);
    });
    this._manualListeners.clear();
  }

  /**
   * Method used to show the tooltip when trigger type is set to 'hover'
   * and the mouse hover the button
   */
  onMouseEnter() {
    this.clearTimoutOnChangeMouseEvent();
    event.stopPropagation();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this.open(true);
    }, this.hoverOpenDelay);
  }

  /**
   * Method used to hide the tooltip when trigger type is set to 'hover'
   * and the mouse leave the button
   */
  onMouseLeave() {
    this.clearTimoutOnChangeMouseEvent();
    event.stopPropagation();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this.close(true);
    }, this.hoverCloseDelay);
  }

  /**
   * function to clear timeouts used for delay. Necessary to keep synchronized the mouseover and
   * mouseleave events
   */
  clearTimoutOnChangeMouseEvent() {
    if (this._referenceActiveTimeout) {
      clearTimeout(this._referenceActiveTimeout);
    }
  }
}
