import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { mixinDisabled } from '@sbb-esta/angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SbbTooltip, SbbTooltipChangeEvent } from './tooltip';

// Boilerplate for applying mixins to SbbTooltipWrapper.
// tslint:disable-next-line: naming-convention
const _SbbTooltipWrapperMixinBase = mixinDisabled(class {});

let nextId = 1;

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip-wrapper.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  inputs: ['disabled'],
  host: {
    class: 'sbb-tooltip-wrapper',
    '[attr.id]': 'this.id',
    '[attr.aria-expanded]': '_tooltip._isTooltipVisible()',
  },
})
export class SbbTooltipWrapper extends _SbbTooltipWrapperMixinBase implements OnInit, OnDestroy {
  /** Identifier of tooltip. */
  @Input() id: string = `sbb-tooltip-id-${nextId++}`;

  /** The trigger event, on which the tooltip opens. */
  @Input() trigger: 'click' | 'hover' = 'click';

  /** Customizations for show delay */
  @Input()
  get hoverShowDelay(): number {
    return this._hoverShowDelay;
  }
  set hoverShowDelay(value: NumberInput) {
    this._hoverShowDelay = coerceNumberProperty(value, 0);
  }
  private _hoverShowDelay: number;

  /** Customizations for hide delay */
  @Input()
  get hoverHideDelay(): number {
    return this._hoverHideDelay;
  }
  set hoverHideDelay(value: NumberInput) {
    this._hoverHideDelay = coerceNumberProperty(value, 0);
  }
  private _hoverHideDelay: number;

  private _destroyed = new Subject<void>();

  /**
   * The indicator icon, which will be shown as the tooltip indicator.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="kom:circle-question-mark-small"
   */
  @Input() svgIcon: string = 'kom:circle-question-mark-small';

  /** Classes to be passed to the tooltip. Supports the same syntax as `ngClass`. */
  @Input() sbbTooltipClass: string | string[] | Set<string> | { [key: string]: any };

  /** Classes to be passed to the tooltip panel. Supports the same syntax as `ngClass`. */
  @Input() sbbTooltipPanelClass: string | string[] | Set<string> | { [key: string]: any };

  @ViewChild(SbbTooltip, { static: true }) _tooltip!: SbbTooltip;

  /** Event emitted when the tooltip is opened. */
  @Output() readonly opened: EventEmitter<SbbTooltipChangeEvent> =
    new EventEmitter<SbbTooltipChangeEvent>();

  /** Event emitted when the tooltip is closed. */
  @Output() readonly dismissed: EventEmitter<SbbTooltipChangeEvent> =
    new EventEmitter<SbbTooltipChangeEvent>();

  ngOnInit(): void {
    this._tooltip.opened.pipe(takeUntil(this._destroyed)).subscribe((e) => this.opened.emit(e));
    this._tooltip.dismissed
      .pipe(takeUntil(this._destroyed))
      .subscribe((e) => this.dismissed.emit(e));
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Shows the tooltip. */
  show() {
    this._tooltip.show(0);
  }

  /** Hides the tooltip. */
  hide() {
    this._tooltip.hide(0);
  }
}
