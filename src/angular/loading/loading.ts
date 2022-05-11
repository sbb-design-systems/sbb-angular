import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

const sbbAvailableModes = ['tiny', 'small', 'medium', 'big', 'fullscreen', 'fullbox', 'inline'];

/**
 * @deprecated please import the new SbbLoadingIndicatorMode from
 * `import { SbbLoadingIndicatorMode } from '@sbb-esta/angular/loading-indicator'`
 */
export type SbbLoadingMode =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'big'
  | 'fullscreen'
  | 'fullbox'
  | 'inline';

/**
 * @deprecated pleae import the new SbbLoadingIndicator from
 * `import { SbbLoadingIndicator } from '@sbb-esta/angular/loading-indicator'`
 */
@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.html',
  styleUrls: ['./loading.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'sbb-loading',
    role: 'progressbar',
    '[attr.aria-busy]': 'true',
    '[class.sbb-loading-tiny]': `this.mode === 'tiny'`,
    '[class.sbb-loading-small]': `this.mode === 'small'`,
    '[class.sbb-loading-medium]': `this.mode === 'medium'`,
    '[class.sbb-loading-big]': `this.mode === 'big'`,
    // TODO: @deprecated mode fullscreen will be removed with next major version
    '[class.sbb-loading-fullscreen]': `this.mode === 'fullscreen'`,
    '[class.sbb-loading-fullbox]': `this.mode === 'fullbox'`,
    '[class.sbb-loading-inline]': `this.mode === 'inline'`,
  },
})
export class SbbLoading {
  /** Types of mode for loading indicator. */
  @Input()
  get mode(): SbbLoadingMode {
    return this._mode;
  }
  set mode(value: SbbLoadingMode | string) {
    if (!sbbAvailableModes.includes(value)) {
      this._mode = 'medium';
      return;
    } else if (value === 'fullscreen' && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      console.warn(
        'The mode fullscreen for the loading indicator is deprecated and will be removed with the next major version. Please consider another mode.'
      );
    }
    this._mode = value as SbbLoadingMode;
  }
  private _mode: SbbLoadingMode = 'medium';
}
