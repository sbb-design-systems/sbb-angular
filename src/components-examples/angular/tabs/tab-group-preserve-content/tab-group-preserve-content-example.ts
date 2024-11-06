import { Component } from '@angular/core';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

/**
 * @title Tab group that keeps its content inside the DOM when it's off-screen.
 * @order 90
 */
@Component({
  selector: 'sbb-tab-group-preserve-content-example',
  templateUrl: 'tab-group-preserve-content-example.html',
  imports: [SbbTabsModule],
})
export class TabGroupPreserveContentExample {}
