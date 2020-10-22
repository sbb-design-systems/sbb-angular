import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    '[attr.aria-busy]': 'true',
    '[class.sbb-loading-tiny]': `this.mode === 'tiny'`,
    '[class.sbb-loading-small]': `this.mode === 'small'`,
    '[class.sbb-loading-medium]': `this.mode === 'medium'`,
    '[class.sbb-loading-big]': `this.mode === 'big'`,
    '[class.sbb-loading-fullscreen]': `this.mode === 'fullscreen'`,
    '[class.sbb-loading-fullbox]': `this.mode === 'fullbox'`,
    '[class.sbb-loading-inline]': `this.mode === 'inline'`,
  },
})
export class SbbLoading {
  /** Types of mode for loading indicator. */
  @Input() mode: 'tiny' | 'small' | 'medium' | 'big' | 'fullscreen' | 'fullbox' | 'inline' =
    'medium';

  // tslint:disable: member-ordering
  static ngAcceptInputType_mode:
    | 'tiny'
    | 'small'
    | 'medium'
    | 'big'
    | 'fullscreen'
    | 'fullbox'
    | 'inline'
    | string
    | null
    | undefined;
  // tslint:enable: member-ordering
}
