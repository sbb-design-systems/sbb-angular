import { Component } from '@angular/core';

@Component({
  selector: 'sbb-checkbox-panel-group-example',
  templateUrl: './checkbox-panel-group-example.component.html',
})
export class CheckboxPanelGroupExampleComponent {
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
