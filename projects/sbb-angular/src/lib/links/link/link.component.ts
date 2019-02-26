import { Component, ChangeDetectionStrategy, Input, Self, OnChanges, SimpleChanges } from '@angular/core';
import { HostClass } from '../../_common/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HostClass],
})
export class LinkComponent implements OnChanges {
  /**
   * Link modes available for different purposes
   */
  @Input() mode: 'normal' | 'stretch' | 'form' = 'normal';
  /**
   * Icon types available for different purposes
   */
  @Input() icon: 'arrow' | 'download' = 'arrow';

  constructor(
    @Self() private hostClass: HostClass,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode && changes.mode.currentValue !== changes.mode.previousValue) {
      this.hostClass.apply(`sbb-link-${this.mode}`);
    }
  }
}
