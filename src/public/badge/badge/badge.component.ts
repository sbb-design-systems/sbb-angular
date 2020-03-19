import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'sbb-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  /**
   * The badge has two status, but, basically its common usage is in active state (see {@link TabsComponent}).
   * Anyway this property can change its status, and so it will change the styling.
   */
  @HostBinding('class.sbb-badge-active')
  @Input()
  active = true;

  @HostBinding('class.sbb-badge')
  cssClass = true;

  @Input('aria-label')
  @HostBinding('attr.aria-label')
  ariaLabel: string | null = null;
}
