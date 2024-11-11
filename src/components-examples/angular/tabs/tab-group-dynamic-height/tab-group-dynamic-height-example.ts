import { Component } from '@angular/core';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

/**
 * @title Tab group with dynamic height based on tab contents
 * @order 70
 */
@Component({
  selector: 'sbb-tab-group-dynamic-height-example',
  templateUrl: 'tab-group-dynamic-height-example.html',
  styleUrls: ['tab-group-dynamic-height-example.css'],
  imports: [SbbTabsModule],
})
export class TabGroupDynamicHeightExample {}
