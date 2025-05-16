import { _IdGenerator } from '@angular/cdk/a11y';
import { AsyncPipe } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  numberAttribute,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { mixinVariant } from '@sbb-esta/angular/core';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { SbbTooltip, SbbTooltipChangeEvent, TooltipPosition } from './tooltip';

// Boilerplate for applying mixins to SbbTooltipWrapper.
const _SbbTooltipWrapperMixinBase = mixinVariant(class {});

@Component({
  selector: 'sbb-tooltip',
  templateUrl: './tooltip-wrapper.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-tooltip-wrapper',
    '[attr.id]': 'this.id',
    '[attr.aria-expanded]': '_tooltip._isTooltipVisible()',
  },
  imports: [SbbTooltip, SbbIcon, AsyncPipe],
})
export class SbbTooltipWrapper
  extends _SbbTooltipWrapperMixinBase
  implements OnInit, OnChanges, OnDestroy
{
  /** Identifier of tooltip. */
  @Input() id: string = inject(_IdGenerator).getId('sbb-tooltip-id-');

  /** The trigger event, on which the tooltip opens. */
  @Input() trigger: 'click' | 'hover' = 'click';

  /** Customizations for show delay */
  @Input({ transform: numberAttribute }) hoverShowDelay: number;

  /** Customizations for hide delay */
  @Input({ transform: numberAttribute }) hoverHideDelay: number;

  @Input() position: TooltipPosition = 'below';

  private _destroyed = new Subject<void>();

  /**
   * The indicator icon, which will be shown as the tooltip indicator.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="circle-question-mark-small"
   */
  @Input() svgIcon: string;

  /** Whether the tooltip is disabled. */
  @Input({ transform: booleanAttribute }) disabled: boolean = false;

  /** Subject for the current icon. */
  private _svgIconSubject = new BehaviorSubject<string | null>(null);

  /** An observable of the current icon. */
  _svgIcon: Observable<string> = combineLatest([this.variant, this._svgIconSubject]).pipe(
    map(([variant, icon]) => {
      if (icon) {
        return icon;
      } else {
        return variant === 'standard' ? 'circle-question-mark-small' : 'circle-information-small';
      }
    }),
  );

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

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['svgIcon'] &&
      changes['svgIcon'].currentValue !== changes['svgIcon'].previousValue
    ) {
      this._svgIconSubject.next(this.svgIcon);
    }
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
