import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbRadioButtonModule } from '@sbb-esta/angular/radio-button';
import { SbbRadioButtonPanelModule } from '@sbb-esta/angular/radio-button-panel';

/**
 * @title Radio Button Panel Content
 * @order 20
 */
@Component({
  selector: 'sbb-radio-button-panel-content-example',
  templateUrl: 'radio-button-panel-content-example.html',
  imports: [SbbRadioButtonModule, SbbRadioButtonPanelModule, SbbCheckboxModule, FormsModule],
})
export class RadioButtonPanelContentExample {
  disabled = false;
}
