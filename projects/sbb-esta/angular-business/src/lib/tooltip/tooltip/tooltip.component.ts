import { Component, Input, ViewChild } from '@angular/core';
import { TooltipComponent as TooltipComponentPublic } from '@sbb-esta/angular-public';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent extends TooltipComponentPublic {
  /**
   * @docs-private
   */
  @ViewChild('tooltipTemplate', { static: true }) tooltipContentPortal: TemplatePortal<any>;

  /**
   * Customizations for trigger type
   */
  @Input() trigger: 'click' | 'hover' = 'click';
  /**
   * Customizations for delay open
   */
  private _hoverOpenDelay: number;
  @Input()
  get hoverOpenDelay(): number {
    return this._hoverOpenDelay;
  }
  set hoverOpenDelay(value: number) {
    this._hoverOpenDelay = coerceNumberProperty(value, 0);
  }

  /**
   * Customizations for delay close
   */
  private _hoverCloseDelay: number;
  @Input()
  get hoverCloseDelay(): number {
    return this._hoverCloseDelay;
  }
  set hoverCloseDelay(value: number) {
    this._hoverCloseDelay = coerceNumberProperty(value, 0);
  }

  /**
   * References for timeout used for delay open/close
   */
  private _referenceActiveTimeout: number;

  /**
   * onMouseOver method used to show the tooltip when trigger type is set to 'hover'
   * and the mouse hover the button
   */
  onMouseOver($event: MouseEvent) {
    this.clearTimoutOnChangeMouseEvent();
    event.stopPropagation();
    this._referenceActiveTimeout = window.setTimeout(() => {
      this.open(true);
    }, this.hoverOpenDelay);
  }

  /**
   * onMouseLeave method used to hide the tooltip when trigger type is set to 'hover'
   * and the mouse leave the button
   */
  onMouseLeave($event: MouseEvent) {
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
