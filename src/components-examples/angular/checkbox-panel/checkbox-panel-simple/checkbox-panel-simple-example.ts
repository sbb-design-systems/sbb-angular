import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular/checkbox-panel';

/**
 * @title Simple Checkbox Panel
 * @order 10
 */
@Component({
  selector: 'sbb-checkbox-panel-simple-example',
  templateUrl: 'checkbox-panel-simple-example.html',
  imports: [SbbCheckboxPanelModule, FormsModule, ReactiveFormsModule, JsonPipe],
})
export class CheckboxPanelSimpleExample {
  checked = new FormControl(false);
}
