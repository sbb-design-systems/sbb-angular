import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Chips Reactive Forms
 * @order 1
 */
@Component({
  selector: 'sbb-chips-reactive-forms-example',
  templateUrl: 'chips-reactive-forms-example.html',
})
export class ChipsReactiveFormsExample {
  formControl = new FormControl(new Set(['Re420', 'Re460']));

  get valuesArray() {
    return [...this.formControl.value.values()];
  }
}
