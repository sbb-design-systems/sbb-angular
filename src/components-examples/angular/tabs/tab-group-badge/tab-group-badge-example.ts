import { Component } from '@angular/core';
import { SbbBadgeModule } from '@sbb-esta/angular/badge';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

/**
 * @title Tabs with badge
 * @order 40
 */
@Component({
  selector: 'sbb-tab-group-badge-example',
  templateUrl: 'tab-group-badge-example.html',
  imports: [SbbTabsModule, SbbBadgeModule],
})
export class TabGroupBadgeExample {}
