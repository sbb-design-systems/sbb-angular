import { coerceNumberProperty } from '@angular/cdk/coercion';
import {
  ConnectedPosition,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';

import { DefaultTooltipComponent } from './default-tooltip.component';

@Directive({
  selector: '[sbbTooltip]'
})
export class TooltipDirective implements OnInit, OnDestroy {
  private readonly _defaultTooltipPosition: ConnectedPosition = {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -2
  };
  /**
   * Set the tooltip text or a templateRef for custom toooltip content.
   */
  @Input('sbbTooltip') content: string | TemplateRef<any>;
  private _overlayRef: OverlayRef;
  private _manualListeners = new Map<string, EventListenerOrEventListenerObject>();
  private _tooltipPosition: ConnectedPosition = this._defaultTooltipPosition;

  constructor(
    private _platform: Platform,
    private _overlay: Overlay,
    private _overlayPositionBuilder: OverlayPositionBuilder,
    private _elementRef: ElementRef,
    private _viewContainerRef: ViewContainerRef
  ) {}

  private _tooltipOpenDelay: number;

  /**
   * Set the tooltip hover delay before opening
   */
  @Input()
  set tooltipOpenDelay(value: number) {
    this._tooltipOpenDelay = coerceNumberProperty(value, 0);
  }

  get tooltipOpenDelay(): number {
    return this._tooltipOpenDelay;
  }

  private _tooltipCloseDelay: number;
  /**
   * Set the tooltip hover delay before closing.
   */
  @Input()
  set tooltipCloseDelay(value: number) {
    this._tooltipCloseDelay = coerceNumberProperty(value, 0);
  }

  get tooltipCloseDelay(): number {
    return this._tooltipCloseDelay;
  }

  /**
   * Set a custom tooltip position.
   */
  @Input()
  set tooltipPosition(positions: ConnectedPosition) {
    if (positions) {
      this._tooltipPosition = positions;
    } else {
      this._tooltipPosition = this._defaultTooltipPosition;
    }
  }

  get tooltipPosition(): ConnectedPosition {
    return this._tooltipPosition ? this._tooltipPosition : this._defaultTooltipPosition;
  }

  /**
   * References for timeout used for delay open/close
   */
  private _referenceActiveTimeout: number;

  public ngOnInit(): void {
    const positionStrategy = this._overlayPositionBuilder
      .flexibleConnectedTo(this._elementRef)
      .withPush(true)
      .withPositions([this.tooltipPosition]);

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
    // hide tooltip component
    this._onMouseLeave();

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
    }, this.tooltipOpenDelay);
  }

  /**
   * Method used to hide the tooltip when trigger type is set to 'hover'
   * and the mouse leave the button
   */
  private _onMouseLeave(): void {
    this._clearTimoutOnChangeMouseEvent();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this._hide();
    }, this.tooltipCloseDelay);
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
    if (this.content instanceof TemplateRef) {
      this._overlayRef.attach(new TemplatePortal(this.content, this._viewContainerRef));
    } else {
      const tooltipRef: ComponentRef<DefaultTooltipComponent> = this._overlayRef.attach(
        new ComponentPortal(DefaultTooltipComponent)
      );
      tooltipRef.instance.text = this.content;
    }
  }

  private _hide() {
    this._overlayRef.detach();
  }
}
