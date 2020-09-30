import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'attr.role': 'progressbar',
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
  /**
   * The aria-busy of loading component.
   * @deprecated internal use
   */
  isBusy = 'true';

  /**
   * The role of loading component.
   * @deprecated internal use
   * */
  role = 'progressbar';

  /** Types of mode for loading indicator. */
  @Input() mode: 'tiny' | 'small' | 'medium' | 'big' | 'fullscreen' | 'fullbox' | 'inline' =
    'medium';

  /**
   * @docs-private
   * @deprecated internal use
   */
  get _tinyClass() {
    return this.mode === 'tiny';
  }

  /**
   * @docs-private
   * @deprecated internal use
   */
  get _smallClass() {
    return this.mode === 'small';
  }

  /**
   * @docs-private
   * @deprecated internal use
   */
  get _mediumClass() {
    return this.mode === 'medium';
  }

  /**
   * @docs-private
   * @deprecated internal use
   */
  get _bigClass() {
    return this.mode === 'big';
  }

  /**
   * @docs-private
   * @deprecated internal use
   */
  get _fullscreenClass() {
    return this.mode === 'fullscreen';
  }

  /**
   * @docs-private
   * @deprecated internal use
   */
  get _fullboxClass() {
    return this.mode === 'fullbox';
  }

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
