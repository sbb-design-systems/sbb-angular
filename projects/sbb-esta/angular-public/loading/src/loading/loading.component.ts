import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  /** The aria-busy of loading component. */
  @HostBinding('attr.aria-busy') isBusy = 'true';
  /** The role of loading component. */
  @HostBinding('attr.role') role = 'progressbar';
  /** Types of mode for loading indicator. */
  @Input() mode: 'tiny' | 'small' | 'medium' | 'big' | 'fullscreen' | 'fullbox' = 'medium';

  /** @docs-private */
  @HostBinding('class.sbb-loading-tiny')
  get _tinyClass() {
    return this.mode === 'tiny';
  }

  /** @docs-private */
  @HostBinding('class.sbb-loading-small')
  get _smallClass() {
    return this.mode === 'small';
  }

  /** @docs-private */
  @HostBinding('class.sbb-loading-medium')
  get _mediumClass() {
    return this.mode === 'medium';
  }

  /** @docs-private */
  @HostBinding('class.sbb-loading-big')
  get _bigClass() {
    return this.mode === 'big';
  }

  /** @docs-private */
  @HostBinding('class.sbb-loading-fullscreen')
  get _fullscreenClass() {
    return this.mode === 'fullscreen';
  }

  /** @docs-private */
  @HostBinding('class.sbb-loading-fullbox')
  get _fullboxClass() {
    return this.mode === 'fullbox';
  }
}
