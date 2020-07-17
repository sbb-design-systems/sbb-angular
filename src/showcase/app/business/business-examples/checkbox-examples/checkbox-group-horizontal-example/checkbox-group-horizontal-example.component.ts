import { Component } from '@angular/core';

@Component({
  selector: 'sbb-checkbox-group-horizontal-example',
  templateUrl: './checkbox-group-horizontal-example.component.html',
})
export class CheckboxGroupHorizontalExampleComponent {
  checkboxOptions = [
    {
      name: 'Check 1',
      value: 'value1',
      selected: true,
    },
    {
      name: 'Check 2',
      value: 'value2',
      selected: false,
    },
    {
      name: 'Check 3',
      value: 'value3',
      selected: false,
    },
  ];
}
