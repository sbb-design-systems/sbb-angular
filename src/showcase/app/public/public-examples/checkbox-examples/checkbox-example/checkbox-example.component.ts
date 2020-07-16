import { Component } from '@angular/core';

@Component({
  selector: 'sbb-checkbox-example',
  templateUrl: './checkbox-example.component.html',
})
export class CheckboxExampleComponent {
  disabled: boolean;
  changeCounter = 0;

  incrementChangeCounter() {
    this.changeCounter++;
  }
}
