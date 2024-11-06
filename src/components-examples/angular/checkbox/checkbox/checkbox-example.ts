import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SbbCheckboxModule } from '@sbb-esta/angular/checkbox';

/**
 * @title Checkbox
 * @order 10
 */
@Component({
  selector: 'sbb-checkbox-example',
  templateUrl: 'checkbox-example.html',
  imports: [SbbCheckboxModule, FormsModule],
})
export class CheckboxExample {
  disabled: boolean;
  changeCounter = 0;

  incrementChangeCounter() {
    this.changeCounter++;
  }
}
