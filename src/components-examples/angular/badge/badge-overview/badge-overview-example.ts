import { Component } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIcon } from '@sbb-esta/angular/icon';

/**
 * @title Badge overview
 */
@Component({
  selector: 'sbb-badge-overview-example',
  templateUrl: 'badge-overview-example.html',
  imports: [SbbBadgeModule, SbbButtonModule, SbbIcon],
})
export class BadgeOverviewExample {
  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }
}
