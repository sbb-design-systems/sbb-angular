import { Component } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

/**
 * @title Contextmenu with icons
 * @order 20
 */
@Component({
  selector: 'sbb-menu-icons-example',
  templateUrl: 'menu-icons-example.html',
  imports: [SbbMenuModule, SbbIconModule],
})
export class MenuIconsExample {}
