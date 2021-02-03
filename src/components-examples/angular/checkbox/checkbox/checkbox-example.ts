import { Component } from '@angular/core';

/**
 * @title Checkbox
 * @order 10
 */
@Component({
  selector: 'sbb-checkbox-example',
  templateUrl: './checkbox-example.html',
})
export class CheckboxExample {
  disabled: boolean;
  changeCounter = 0;

  incrementChangeCounter() {
    this.changeCounter++;
  }
}
