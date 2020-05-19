import { Component } from '@angular/core';

@Component({
  selector: 'sbb-checkbox-example',
  templateUrl: './checkbox-example.component.html',
})
export class CheckboxExampleComponent {
  required: boolean;
  disabled: boolean;
  checked: boolean;
  changeCounter = 0;

  incrementChangeCounter() {
    this.changeCounter++;
  }
}
