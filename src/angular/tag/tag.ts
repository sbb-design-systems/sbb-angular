// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import {
  Attribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  NgZone,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SbbBadge } from '@sbb-esta/angular/badge';
import { _SbbCheckboxBase } from '@sbb-esta/angular/checkbox';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

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
  standalone: true,
  imports: [SbbBadge],
})
export class SbbTag extends _SbbCheckboxBase implements OnDestroy {
  /** Amount displayed in badge */
  @Input()
  get amount(): number {
    return this._amount;
  }
  set amount(value: NumberInput) {
    this._amount = coerceNumberProperty(value);
    this._badgeDescriptionFallback = $localize`:Aria label for amount of results displayed in badge pill@@sbbTagBadgePillAmountOfResults:${this.amount} results available`;

    this._amountChange.next(this._amount);
  }
  private _amount: number;

  /** Description of the badge (amount) */
  @Input('sbbBadgeDescription')
  badgeDescription: string;
  _badgeDescriptionFallback: string;

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

  constructor(
    private _zone: NgZone,
    changeDetectorRef: ChangeDetectorRef,
    focusMonitor: FocusMonitor,
    elementRef: ElementRef<HTMLElement>,
    @Attribute('tabindex') tabIndex: string,
  ) {
    super(elementRef, changeDetectorRef, focusMonitor, tabIndex);

    this._zone.onStable
      .pipe(take(1))
      .subscribe(() => this._zone.run(() => this._valueChange.next(this.checked)));
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
