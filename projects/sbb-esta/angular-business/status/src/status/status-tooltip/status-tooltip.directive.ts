import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Overlay, OverlayPositionBuilder, OverlayRef } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { StatusTooltipComponent } from './status-tooltip.component';

@Directive({
  selector: '[sbbStatusTooltip]'
})
export class StatusTooltipDirective implements OnInit, OnDestroy {
  /**
   * Set the status tooltip text.
   */
  @Input() sbbStatusTooltip = '';
  private _overlayRef: OverlayRef;
  private _manualListeners = new Map<string, EventListenerOrEventListenerObject>();

  constructor(
    private _platform: Platform,
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef
  ) {}

  private _hoverOpenDelay: number;
  /**
   * Customizations for delay open
   */
  @Input()
  set hoverOpenDelay(value: number) {
    this._hoverOpenDelay = coerceNumberProperty(value, 0);
  }

  get hoverOpenDelay(): number {
    return this._hoverOpenDelay;
  }

  private _hoverCloseDelay: number;
  /**
   * Customizations for delay close
   */
  @Input()
  set hoverCloseDelay(value: number) {
    this._hoverCloseDelay = coerceNumberProperty(value, 0);
  }

  get hoverCloseDelay(): number {
    return this._hoverCloseDelay;
  }

  /**
   * References for timeout used for delay open/close
   */
  private _referenceActiveTimeout: number;

  public ngOnInit(): void {
    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPush(true)
      .withPositions([
        {
          originX: 'center',
          originY: 'top',
          overlayX: 'center',
          overlayY: 'bottom',
          offsetY: -2
        }
      ]);

    this._overlayRef = this._overlay.create({ positionStrategy });

    if (!this._platform.IOS && !this._platform.ANDROID) {
      this._manualListeners
        .set('mouseenter', () => this._onMouseEnter())
        .set('mouseleave', () => this._onMouseLeave());
      this._manualListeners.forEach((listener, event) =>
        this._elementRef.nativeElement.addEventListener(event, listener)
      );
    }
  }

  public ngOnDestroy() {
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
  private _onMouseEnter(): void {
    this._clearTimoutOnChangeMouseEvent();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this._show();
    }, this.hoverOpenDelay);
  }

  /**
   * Method used to hide the tooltip when trigger type is set to 'hover'
   * and the mouse leave the button
   */
  private _onMouseLeave(): void {
    this._clearTimoutOnChangeMouseEvent();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this._hide();
    }, this.hoverCloseDelay);
  }

  /**
   * Clear timeouts used for delay. Necessary to keep the mouseover and
   * mouseleave events synchronized.
   */
  private _clearTimoutOnChangeMouseEvent(): void {
    if (this._referenceActiveTimeout) {
      clearTimeout(this._referenceActiveTimeout);
    }
  }

  private _show(): void {
    const tooltipRef: ComponentRef<StatusTooltipComponent> = this._overlayRef.attach(
      new ComponentPortal(StatusTooltipComponent)
    );
    tooltipRef.instance.text = this.sbbStatusTooltip;
  }

  private _hide() {
    this._overlayRef.detach();
  }
}
