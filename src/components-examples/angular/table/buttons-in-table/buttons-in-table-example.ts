import { Component } from '@angular/core';
import { SbbButtonModule } from '@sbb-esta/angular/button';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbMenuModule } from '@sbb-esta/angular/menu';

/**
 * @title Buttons in Table
 * @order 110
 * @devOnly
 */
@Component({
  selector: 'sbb-buttons-in-table-example',
  templateUrl: 'buttons-in-table-example.html',
  imports: [SbbMenuModule, SbbIconModule, SbbButtonModule],
})
export class ButtonsInTableExample {}
