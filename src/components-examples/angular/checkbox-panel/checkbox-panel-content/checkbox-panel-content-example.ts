import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';
import { SbbCheckboxPanelModule } from '@sbb-esta/angular/checkbox-panel';

/**
 * @title Checkbox Panel Content
 * @order 20
 */
@Component({
  selector: 'sbb-checkbox-panel-content-example',
  templateUrl: 'checkbox-panel-content-example.html',
  imports: [SbbCheckboxPanelModule, SbbCheckboxModule, FormsModule],
})
export class CheckboxPanelContentExample {
  disabled = false;
}
