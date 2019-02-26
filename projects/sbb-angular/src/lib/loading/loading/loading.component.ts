import { Component, HostBinding, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges, Self } from '@angular/core';
import { Mode } from './loading-mode.enum';
import { HostClass } from '../../_common/common';

const cssPrefix = 'sbb-loading-';

@Component({
  selector: 'sbb-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HostClass],
})
export class LoadingComponent implements OnChanges {
  /** The aria-busy of loading component. */
  @HostBinding('attr.aria-busy') isBusy = 'true';
  /** The role of loading component. */
  @HostBinding('attr.role') role = 'progressbar';
  /** Types of mode for loading indicator. */
  @Input() mode: 'tiny' | 'small' | 'medium' | 'big' | 'fullscreen' | 'fullbox' = 'medium';

  constructor(
    @Self() private hostClass: HostClass,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      if (changes.mode.currentValue === Mode.FULLSCREEN) {
        this.hostClass.apply(cssPrefix + 'fullscreen-container');
      } else if (changes.mode.currentValue === Mode.FULLBOX) {
        this.hostClass.apply(cssPrefix + 'fullbox-container');
      } else {
        this.hostClass.apply(cssPrefix + changes.mode.currentValue);
      }
    }
  }
}
