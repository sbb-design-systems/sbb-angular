// Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1265
/// <reference types="@angular/localize/init" />

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  numberAttribute,
  ViewEncapsulation,
} from '@angular/core';
import { SbbBadge } from '@sbb-esta/angular/badge';
import { SbbIcon } from '@sbb-esta/angular/icon';

@Component({
  selector: 'a[sbb-tag-link]',
  exportAs: 'sbbTagLink',
  templateUrl: './tag-link.html',
  styleUrls: ['./tag.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-tag-base sbb-link-reset sbb-tag-link',
  },
  imports: [SbbBadge, SbbIcon],
})
export class SbbTagLink {
  /** Amount displayed in badge */
  @Input({ transform: numberAttribute })
  get amount(): number {
    return this._amount;
  }
  set amount(value: number) {
    this._amount = value;
    this._badgeDescriptionFallback = $localize`:Aria label for amount of results displayed in badge pill@@sbbTagBadgePillAmountOfResults:${this.amount} results available`;
  }
  private _amount: number;

  /**
   * The indicator icon, which will be shown before the text.
   * Must be a valid svgIcon input for sbb-icon.
   *
   * e.g. svgIcon="circle-information-small"
   */
  @Input() svgIcon: string;

  /** Description of the badge (amount) */
  @Input('sbbBadgeDescription')
  badgeDescription: string;
  _badgeDescriptionFallback: string;
}
