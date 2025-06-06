// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  Injector,
  Input,
  NgZone,
  numberAttribute,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbBadge } from '@sbb-esta/angular/badge';
import { SbbCheckbox } from '@sbb-esta/angular/checkbox';
import { SbbIcon } from '@sbb-esta/angular/icon';
import { Subject } from 'rxjs';

@Component({
  selector: 'sbb-tag',
  exportAs: 'sbbTag',
  templateUrl: './tag.html',
  styleUrls: ['./tag.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SbbTag),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: ['tabIndex'],
  host: {
    class: 'sbb-tag',
    '[class.sbb-tag-disabled]': 'disabled',
    '[class.sbb-tag-active]': 'active',
  },
  imports: [SbbBadge, SbbIcon],
})
export class SbbTag extends SbbCheckbox implements OnDestroy {
  private _zone = inject(NgZone);
  /** Amount displayed in badge */
  @Input({ transform: numberAttribute })
  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = value;
    this._badgeDescriptionFallback = $localize`:Aria label for amount of results displayed in badge pill@@sbbTagBadgePillAmountOfResults:${this.amount} results available`;

    this._amountChange.next(this._amount);
  }
  private _amount: number;

  /** Description of the badge (amount) */
  @Input('sbbBadgeDescription')
  badgeDescription: string;
  _badgeDescriptionFallback: string;

  /**
   * The indicator icon, which will be shown before the text.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="circle-information-small"
   */
  @Input() svgIcon: string;

  /** Emits the current amount when the amount changes */
  readonly _amountChange = new Subject<number>();

  /** Emits when values are set from outside */
  readonly _valueChange = new Subject<any>();

  /** Refers if a tag is active. */
  get active() {
    return this._active || (this.checked && !this.disabled);
  }
  set active(value: boolean) {
    this._active = value;
    this._changeDetectorRef.markForCheck();
  }
  private _active = false;

  private _injector = inject(Injector);

  constructor(...args: unknown[]);
  constructor() {
    super();

    afterNextRender(() => this._zone.run(() => this._valueChange.next(this.checked)), {
      injector: this._injector,
    });
  }

  override writeValue(value: any) {
    super.writeValue(value);
    this._valueChange.next(value);
  }

  /** @docs-private internal use only */
  _setCheckedAndEmit(checked: boolean) {
    const previousChecked = this.checked;
    this.checked = checked;
    if (previousChecked !== this.checked) {
      this._emitChangeEvent();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this._amountChange.complete();
    this._valueChange.complete();
  }
}
