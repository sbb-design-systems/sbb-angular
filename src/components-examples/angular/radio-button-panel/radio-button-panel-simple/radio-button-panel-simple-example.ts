import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Simple Radio Button Panel
 * @order 10
 */
@Component({
  selector: 'sbb-radio-button-panel-simple-example',
  templateUrl: './radio-button-panel-simple-example.html',
})
export class RadioButtonPanelSimpleExample {
  value = new FormControl();
}
