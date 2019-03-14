import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';

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

  /**
   * The badge has two status, but, basically its common usage is in active state (see <sbb-tabs>).
   * Anyway this property can change its status, and so it will change the styling.
   */
  @HostBinding('class.sbb-badge-active')
  @Input() active = true;

  /**
   * Class activated when the position property is valued with 'top'
   */
  @HostBinding('class.sbb-badge-top')
  get badgeStyleClass(): boolean {
    return this.position === 'top';
  }

  @HostBinding('class.sbb-badge')
  cssClass = true;

}
