import { Component } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbTabsModule } from '@sbb-esta/angular/tabs';

/**
 * @title Using tabs with a custom label template
 * @order 20
 */
@Component({
  selector: 'sbb-tab-group-custom-label-example',
  templateUrl: 'tab-group-custom-label-example.html',
  styleUrls: ['tab-group-custom-label-example.css'],
  imports: [SbbTabsModule, SbbIconModule],
})
export class TabGroupCustomLabelExample {}
