import { Component } from '@angular/core';

@Component({
  selector: 'sbb-checkbox-example',
  templateUrl: './checkbox-example.component.html',
  styleUrls: ['./checkbox-example.component.css']
})
export class CheckboxExampleComponent {
  required: boolean;
  disabled: boolean;
  checked: boolean;
  changeCounter = 0;

  checkboxOptions = [
    {
      name: 'Check 1',
      value: 'value1',
      selected: true
    },
    {
      name: 'Check 2',
      value: 'value2',
      selected: false
    },
    {
      name: 'Check 3',
      value: 'value3',
      selected: false
    }
  ];

  incrementChangeCounter() {
    this.changeCounter++;
  }
}
