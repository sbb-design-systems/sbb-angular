import { Component } from '@angular/core';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

/**
 * @title Basic use of the tab group
 * @order 10
 */
@Component({
  selector: 'sbb-tab-group-basic-example',
  templateUrl: 'tab-group-basic-example.html',
  standalone: true,
  imports: [SbbTabsModule],
})
export class TabGroupBasicExample {}
