import { Component } from '@angular/core';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular/checkbox-panel';
import { SbbIconModule } from '@sbb-esta/angular/icon';

/**
 * @title Checkbox Panel Icon
 * @order 40
 */
@Component({
  selector: 'sbb-checkbox-panel-icon-example',
  templateUrl: 'checkbox-panel-icon-example.html',
  imports: [SbbCheckboxPanelModule, SbbIconModule],
})
export class CheckboxPanelIconExample {}
