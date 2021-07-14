// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'a[sbb-tag-link]',
  templateUrl: './tag-link.html',
  styleUrls: ['./tag.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-tag-base sbb-link-reset sbb-tag-link',
  },
})
export class SbbTagLink {
  /** Amount displayed in badge */
  @Input()
  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = coerceNumberProperty(value);
    this._badgeDescriptionFallback =
      typeof $localize === 'function'
        ? $localize`:Aria label for amount of results displayed in badge pill@@sbbTagBadgePillAmountOfResults:${this.amount} results available`
        : `${this.amount} results available`;
  }
  private _amount: number;

  /** Description of the badge (amount) */
  @Input('sbbBadgeDescription')
  badgeDescription: string;
  _badgeDescriptionFallback: string;

  static ngAcceptInputType_amount: NumberInput;
}
