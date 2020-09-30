import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
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
  isDevMode,
  NgZone,
  OnDestroy,
  OnInit,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import {
  SbbTooltipBase,
  SbbTooltipRegistryService,
  SBB_TOOLTIP_SCROLL_STRATEGY,
} from '@sbb-esta/angular-core/base/tooltip';

// TODO: Find solution for template and style
@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SbbTooltipComponent extends SbbTooltipBase implements OnInit, OnDestroy {
  /**
   * The trigger event, on which the tooltip opens.
   */
  @Input() trigger: 'click' | 'hover' = 'click';

  /**
   * Customizations for delay open
   * @deprecated Use hoverShowDelay
   */
  @Input()
  get hoverOpenDelay(): number {
    return this.hoverShowDelay;
  }
  set hoverOpenDelay(value: number) {
    if (isDevMode()) {
      console.warn('use hoverShowDelay instead of hoverOpenDelay in sbb-tooltip component');
    }
    this.hoverShowDelay = value;
  }

  /**
   * Customizations for show delay
   */
  @Input()
  get hoverShowDelay(): number {
    return this._hoverShowDelay;
  }
  set hoverShowDelay(value: number) {
    this._hoverShowDelay = coerceNumberProperty(value, 0);
  }
  private _hoverShowDelay: number;

  /**
   * Customizations for delay close
   * @deprecated Use hoverHideDelay
   */
  @Input()
  get hoverCloseDelay(): number {
    return this.hoverHideDelay;
  }
  set hoverCloseDelay(value: number) {
    if (isDevMode()) {
      console.warn('use hoverHideDelay instead of hoverCloseDelay in sbb-tooltip component');
    }
    this.hoverHideDelay = value;
  }

  /**
   * Customizations for hide delay
   */
  @Input()
  get hoverHideDelay(): number {
    return this._hoverHideDelay;
  }
  set hoverHideDelay(value: number) {
    this._hoverHideDelay = coerceNumberProperty(value, 0);
  }
  private _hoverHideDelay: number;

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
    tooltipRegistry: SbbTooltipRegistryService,
    @Inject(SBB_TOOLTIP_SCROLL_STRATEGY) scrollStrategy: any,
    @Optional() @Inject(DOCUMENT) document: any,
    zone: NgZone,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(overlay, tooltipRegistry, document, zone, changeDetectorRef, scrollStrategy);
  }

  ngOnInit() {
    // The mouse events shouldn't be bound on mobile devices, because they can prevent the
    // first tap from firing its click event or can cause the tooltip to open for clicks.
    if (this.trigger === 'hover') {
      this._panelClass.push('sbb-tooltip-trigger-hover');

      if (!this._platform.IOS && !this._platform.ANDROID) {
        this._manualListeners
          .set('mouseenter', () => this.onMouseEnter())
          .set('mouseleave', () => this.onMouseLeave());
        this._manualListeners.forEach((listener, event) =>
          this._elementRef.nativeElement.addEventListener(event, listener)
        );
      }
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
    this._clearTimoutOnChangeMouseEvent();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this.openTooltip(true);
      this._changeDetectorRef.markForCheck();
    }, this.hoverShowDelay);
  }

  /**
   * Method used to hide the tooltip when trigger type is set to 'hover'
   * and the mouse leave the button
   */
  onMouseLeave() {
    this._clearTimoutOnChangeMouseEvent();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this.close(true);
      this._changeDetectorRef.markForCheck();
    }, this.hoverHideDelay);
  }

  /**
   * Clear timeouts used for delay. Necessary to keep the mouseover and
   * mouseleave events synchronized.
   */
  private _clearTimoutOnChangeMouseEvent() {
    if (this._referenceActiveTimeout) {
      clearTimeout(this._referenceActiveTimeout);
    }
  }

  // tslint:disable: member-ordering
  static ngAcceptInputType_hoverOpenDelay: NumberInput;
  static ngAcceptInputType_hoverCloseDelay: NumberInput;
  // tslint:enable: member-ordering
}
