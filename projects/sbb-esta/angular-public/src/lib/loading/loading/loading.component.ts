import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
  Self,
  SimpleChanges
} from '@angular/core';

import { HostClass } from '../../_common/host-class';

import { Mode } from './loading-mode.enum';

const cssPrefix = 'sbb-loading-';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HostClass]
})
export class LoadingComponent implements OnChanges {
  /** The aria-busy of loading component. */
  @HostBinding('attr.aria-busy') isBusy = 'true';
  /** The role of loading component. */
  @HostBinding('attr.role') role = 'progressbar';
  /** Types of mode for loading indicator. */
  @Input() mode:
    | 'tiny'
    | 'small'
    | 'medium'
    | 'big'
    | 'fullscreen'
    | 'fullbox' = 'medium';

  constructor(@Self() private _hostClass: HostClass) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      if (changes.mode.currentValue === Mode.FULLSCREEN) {
        this._hostClass.apply(cssPrefix + 'fullscreen-container');
      } else if (changes.mode.currentValue === Mode.FULLBOX) {
        this._hostClass.apply(cssPrefix + 'fullbox-container');
      } else {
        this._hostClass.apply(cssPrefix + changes.mode.currentValue);
      }
    }
  }
}
