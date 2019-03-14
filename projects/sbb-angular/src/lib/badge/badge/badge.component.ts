import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'sbb-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class BadgeComponent {

  /**
   * The position of the badge in a element.
   * The 'default' value is used into <sbb-tag> component,
   * while the 'top' one is used into <sbb-tabs> component.
   */
  @Input() position: 'default' | 'top' = 'default';

}
