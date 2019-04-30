import { Component, ChangeDetectionStrategy, Input, Self, OnChanges, SimpleChanges, ViewEncapsulation, HostBinding } from '@angular/core';
import { HostClass } from '../../_common/host-class';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[sbbLink]',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [HostClass],
})
export class LinkComponent implements OnChanges {
  /** @docs-private */
  @HostBinding('class.sbb-link') linkClass = true;
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
