import { Component } from '@angular/core';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

/**
 * @title Basic Contextmenu
 * @order 10
 */
@Component({
  selector: 'sbb-menu-overview-example',
  templateUrl: 'menu-overview-example.html',
  standalone: true,
  imports: [SbbMenuModule],
})
export class MenuOverviewExample {}
