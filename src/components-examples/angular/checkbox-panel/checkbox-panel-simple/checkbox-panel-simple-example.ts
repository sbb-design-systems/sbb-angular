import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

/**
 * @title Simple Checkbox Panel
 * @order 10
 */
@Component({
  selector: 'sbb-checkbox-panel-simple-example',
  templateUrl: 'checkbox-panel-simple-example.html',
})
export class CheckboxPanelSimpleExample {
  checked = new UntypedFormControl(false);
}
