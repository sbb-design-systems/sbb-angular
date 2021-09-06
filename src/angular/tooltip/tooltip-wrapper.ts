import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { mixinDisabled } from '@sbb-esta/angular/core';

import { SbbTooltip } from './tooltip';

// Boilerplate for applying mixins to SbbTooltipWrapper.
// tslint:disable-next-line: naming-convention
const _SbbTooltipWrapperMixinBase = mixinDisabled(class {});

let nextId = 1;

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip-wrapper.html',
  styleUrls: ['./tooltip-wrapper.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  host: {
    class: 'sbb-tooltip-wrapper',
    '[attr.id]': 'this.id',
    '[attr.aria-expanded]': '_tooltip._isTooltipVisible()',
  },
})
export class SbbTooltipWrapper extends _SbbTooltipWrapperMixinBase {
  /** Identifier of tooltip. */
  @Input() id: string = `sbb-tooltip-id-${nextId++}`;

  /** The trigger event, on which the tooltip opens. */
  @Input() trigger: 'click' | 'hover' = 'click';

  /** Customizations for show delay */
  @Input()
  get hoverShowDelay(): number {
    return this._hoverShowDelay;
  }
  set hoverShowDelay(value: number) {
    this._hoverShowDelay = coerceNumberProperty(value, 0);
  }
  private _hoverShowDelay: number;

  /** Customizations for hide delay */
  @Input()
  get hoverHideDelay(): number {
    return this._hoverHideDelay;
  }
  set hoverHideDelay(value: number) {
    this._hoverHideDelay = coerceNumberProperty(value, 0);
  }
  private _hoverHideDelay: number;

  /**
   * The indicator icon, which will be shown as the tooltip indicator.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. indicatorIcon="kom:circle-question-mark-small"
   */
  @Input() indicatorIcon: string = 'kom:circle-question-mark-small';

  @ViewChild(SbbTooltip, { static: true }) _tooltip!: SbbTooltip;

  /** Opens the tooltip. */
  open() {
    this._tooltip.show(0);
  }

  /** Closes the tooltip. */
  close() {
    this._tooltip.hide(0);
  }

  static ngAcceptInputType_hoverShowDelay: NumberInput;
  static ngAcceptInputType_hoverHideDelay: NumberInput;
}
