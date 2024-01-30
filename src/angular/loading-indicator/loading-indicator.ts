import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

const sbbAvailableModes = ['tiny', 'small', 'medium', 'big', 'fullbox', 'inline'];

export type SbbLoadingIndicatorMode = 'tiny' | 'small' | 'medium' | 'big' | 'fullbox' | 'inline';

@Component({
  selector: 'sbb-loading-indicator',
  templateUrl: './loading-indicator.html',
  styleUrls: ['./loading-indicator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-loading-indicator',
    role: 'progressbar',
    '[attr.aria-busy]': 'true',
    '[class.sbb-loading-indicator-tiny]': `this.mode === 'tiny'`,
    '[class.sbb-loading-indicator-small]': `this.mode === 'small'`,
    '[class.sbb-loading-indicator-medium]': `this.mode === 'medium'`,
    '[class.sbb-loading-indicator-big]': `this.mode === 'big'`,
    '[class.sbb-loading-indicator-fullbox]': `this.mode === 'fullbox'`,
    '[class.sbb-loading-indicator-inline]': `this.mode === 'inline'`,
  },
  standalone: true,
})
export class SbbLoadingIndicator {
  /** Types of mode for loading indicator. */
  @Input()
  get mode(): SbbLoadingIndicatorMode {
    return this._mode;
  }
  set mode(value: SbbLoadingIndicatorMode | string) {
    if (!sbbAvailableModes.includes(value)) {
      this._mode = 'medium';
      return;
    }
    this._mode = value as SbbLoadingIndicatorMode;
  }
  private _mode: SbbLoadingIndicatorMode = 'medium';
}
