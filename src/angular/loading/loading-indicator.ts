import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

const sbbAvailableModes = ['tiny', 'small', 'medium', 'big', 'fullscreen', 'fullbox', 'inline'];

export type SbbLoadingIndicatorMode =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'big'
  | 'fullscreen'
  | 'fullbox'
  | 'inline';

@Component({
  // TODO(v15): Remove sbb-loading selector.
  selector: 'sbb-loading-indicator, sbb-loading',
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
    // TODO: @deprecated mode fullscreen will be removed with next major version
    '[class.sbb-loading-indicator-fullscreen]': `this.mode === 'fullscreen'`,
    '[class.sbb-loading-indicator-fullbox]': `this.mode === 'fullbox'`,
    '[class.sbb-loading-indicator-inline]': `this.mode === 'inline'`,
  },
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
    } else if (value === 'fullscreen' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      console.warn(
        'The mode fullscreen for the loading indicator is deprecated and will be removed with the next major version. Please consider another mode.'
      );
    }
    this._mode = value as SbbLoadingIndicatorMode;
  }
  private _mode: SbbLoadingIndicatorMode = 'medium';
}
