import { Component } from '@angular/core';
import { SbbIconModule } from '@sbb-esta/angular/icon';
import { SbbRadioButtonPanelModule } from '@sbb-esta/angular/radio-button-panel';

/**
 * @title Radio Button Panel Icon
 * @order 40
 */
@Component({
  selector: 'sbb-radio-button-panel-icon-example',
  templateUrl: 'radio-button-panel-icon-example.html',
  imports: [SbbRadioButtonPanelModule, SbbIconModule],
})
export class RadioButtonPanelIconExample {}
