import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sbb-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'sbb-badge',
    '[class.sbb-badge-active]': 'active',
    '[attr.aria-label]': 'ariaLabel',
  },
})
export class SbbBadge {
  /**
   * The badge has two status, but, basically its common usage is in active state (see {@link TabsComponent}).
   * Anyway this property can change its status, and so it will change the styling.
   */
  @Input() active: boolean = true;

  @Input('aria-label') ariaLabel: string | null = null;
}
